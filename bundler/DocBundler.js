import recursive from "recursive-readdir";
import Path from "path";
import ejs from 'ejs';

import { DocMarkdown, DocStatic, DocLess } from "./builders/index.js";

export default class DocBundler {
  extensions = {};
  registerExtension(ext, Type) {
    this.extensions[ext] = Type;
  }

  constructor({ source }) {
    this.source = source;
    this._layouts = Path.resolve(source, "_layouts");
    this.registerExtension(".md", DocMarkdown)
    this.registerExtension(".less", DocLess)
  }

  paths = {};
  files = {};

  async addFile(absolute) {
    const {ext} = Path.parse(absolute);
    const Type = this.extensions[ext] || DocStatic;
    const file = new Type(this, absolute);
    if (!file) {
      console.log("[BUNDLE] Not including",file)
      return;
    }
    this.paths[file.path] = this.files[absolute] = file;
    await this.loadFile(file);
  }

  async loadFile(file) {
    await file.load();
  }

  async removeFile(file) {
    delete this.paths[file.path];
    delete this.files[file.absolute];
  }

  async _updateFile(evt, absolute) {
    const file = this.files[absolute];
    if (evt === "remove") {
      if (!file) return;
      console.log("[BUNDLE] Removing", file.path);
      await this.removeFile(file);
    } else if (evt === "update") {
      if (file) {
        console.log("[BUNDLE] Updating", file.path);
        await this.loadFile(file);
      } else {
        await this.addFile(absolute);
        console.log("[BUNDLE] Adding", absolute);
      }
    }
    this._nav = null;
    this.onFileChanged.forEach(x => x());
    this.onFileChanged = [];
  }

  async updateFile(...args) {
    this.loadedFiles = this._updateFile(...args);
    return await this.loadedFiles;
  }

  loadedFiles = null;

  async loadFiles() {
    this.loadedFiles = this._loadFiles();
    return await this.loadedFiles;
  }

  async _loadFiles() {
    console.log("[BUNDLE] Reading from", this.source)
    const names = await recursive(this.source);
    this.paths = {};
    for (const name of names) {
      await this.addFile(name);
    }
    console.log("[BUNDLE]",Object.keys(this.paths).length, "files read.");
  }


  onFileChanged = [];

  _nav = null;

  _navParents = new WeakMap();
  _navChildren = new WeakMap();

  _removeNavChildren(parent) {
    if (!this._navChildren.has(parent)) return;
    const children = this._navChildren.get(parent);
    for (const child of [...children]) {
      this._navParents.delete(child);
    }
    this._navChildren.delete(parent);
  }

  _addNavChild(parent,child) {
    const children = this._navChildren.get(parent) || new Set();
    children.add(child);
    this._navChildren.set(parent,children);
    this._navParents.set(child,parent);
  }
    
  generateNav(path, level = 0, res = [], parents = []) {
    const file = this.paths[path];
    if (!file) return;
    if (res.find(r => r.file === file)) return;
    const conf = file.data.nav || {};
//    console.log(file.path,file.data.nav)
    //console.log(file.path)
    file.navParents = parents;
    file.navParent = parents[parents.length-1];
    res.push({
      file,
      title: conf.title || file.title,
      path: file.path,
      level,
      parents: [...parents],
      link: conf.link !== false
    });
    file.navChildren = [];
    for (const child of conf.children || []) {
      const parentPath = file.path.replace(/[^/]+$/,"");
      let childPath =Path.resolve("/",parentPath,child);
      if (child.endsWith("/")) childPath+="/";
      const childFile = this.paths[childPath];
      if (childFile) {
        file.navChildren.push(childPath);
        this.generateNav(childPath, level + 1, res, [...parents, file.path]);
      }
    }
    return res;
  }



  get nav() {
    if (!this._nav) {
      console.log("[BUNDLE] Generating nav.")
      this._nav = this.generateNav("/");
    }
    return this._nav;
  }

  async serve(req, res, path) {
    await this.loadedFiles;
    const file = this.paths[path];
    if (!file) return res.status(404).end(path + " not found");
    if ('wait' in req.query) {
      this.onFileChanged.push(() => {
        res.end();
      })
      return;
    }
    console.log("[SERVE]", req.path, "->", file.absolute);
    return file.serve(req, res);
  }

  async layout(file, content) {
    return new Promise(resolve => {
      ejs.renderFile(Path.resolve(this._layouts, "default.ejs"), {
        page: file,
        data: file.data,
        site: this,
        content
      }, {}, (err, res) => {
        if (err) resolve(String(err));
        else resolve(res);
      })
    });
  }
}
