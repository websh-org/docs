import recursive from "recursive-readdir";
import Path from "path";
import ejs from 'ejs';

import { DocMarkdown, DocStatic, DocLess } from "./builders/index.js";

export default class DocBundler {
  extensions = {};
  registerExtension(ext, Type) {
    this.extensions[ext] = Type;
  }

  files = {};

  constructor({ source }) {
    this.source = source;
    this._layouts = Path.resolve(source, "_layouts");
    this.registerExtension(".md", DocMarkdown)
    this.registerExtension(".less", DocLess)
  }

  loadedFiles = null;

  async loadFiles() {
    this.loadedFiles = this._loadFiles();
    return await this.loadedFiles;
  }

  async _loadFiles() {
    console.log("Reading from", this.source)
    const names = await recursive(this.source);
    this.files = {};
    for (const name of names) {
      const file = await this.loadFile(name, {});
      if (!file) continue;
      this.files[file.path] = file;
    }
    console.log(Object.keys(this.files).length, "files read.");
  }


  onFileChanged = [];

  async loadFile(absolute) {
    this.onFileChanged.forEach(x => x());
    this.onFileChanged = [];
    const { ext } = Path.parse(absolute);
    const Type = this.extensions[ext] || DocStatic;
    const file = Type.create(this, absolute);

    this._nav = null;
    return file;
  }


  _nav = null;
  generateNav(path, level = 0, res = [], parents = []) {
    const file = this.files[path];
    if (!file) return;
    if (res.find(r => r.file === file)) return;
    const conf = file.data.nav || {};
    //console.log(file.path)
    file.parents = parents;
    file.parent = parents[parents.length-1];
    res.push({
      file,
      title: conf.title || file.title,
      path: file.path,
      level,
      parents: [...parents],
      link: conf.link !== false
    });
    for (const child of conf.children || []) {
      const parentPath = file.path.replace(/(.)[/]$/, "$1");
      //console.log({parentPath,child});
      const childPath = Path.resolve(parentPath, child) + (child.endsWith("/") ? "/" : "")
      this.generateNav(childPath, level + 1, res, [...parents, file.path]);
    }
    return res;
  }



  get nav() {
    if (!this._nav) {
      console.log("generating nav")
      this._nav = this.generateNav("/");
    }
    return this._nav;
  }

  async serve(req, res, path) {
    await this.loadedFiles;
    const file = this.files[path];
    if (!file) return res.status(404).end(path + " not found");
    if ('wait' in req.query) {
      this.onFileChanged.push(() => {
        res.end();
      })
      return;
    }
    console.log(req.path, "=>", file.absolute);
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
