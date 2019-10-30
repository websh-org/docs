const recursive = require("recursive-readdir");
const fs = require("fs").promises;
const Path = require('path');
let ejs = require('ejs');
const YAML = require('yaml')

class DocBundler {
  extensions = {};
  types = {}  
  files = {};
  
  constructor({source}) {
    this.source = source;
    this._layouts = Path.resolve(source,"_layouts");
    this.registerType("static",DocStatic);
    this.registerType("markdown",DocMarkdown);
    
    this.registerExtension("md","markdown")
    this.registerExtension("css","static")
  }

  async loadFiles() {
    const names = await recursive(this.source);
    this.files = {};
    for (const name of names) {
      const file = await this.createFile(name,{});
      if(!file) continue;
      this.files[file.path]=file;
    }
    console.log(Object.keys(this.files));
  }

  generateToc(path,depth=0,res=[]) {
    const file = this.files[path];
    if (!file) return;
    if (res.includes(file)) return;
    const conf = file.data.toc || {};
    res.push({
      title: conf.title || file.title,
      path: file.path,
      depth,
      link: conf.link !== false
    });
    for (const child of conf.children||[]) {
      const childPath = file.path.split("/").slice(0,-1).join("/")+"/"+child;
      this.generateToc(childPath,depth+1,res);
    }
    return res;
  }

  get toc() {
    
    const res = this.generateToc("/");
    return res;
  }

  serve(req,res,path) {
    const file = this.files[path];
    if (!file) return res.status(404).end(path+" not found");
    return file.serve(req,res);
  }

  async layout(file,content) {
    return new Promise(resolve=>{
      ejs.renderFile(Path.resolve(this._layouts,"default.ejs"),{
          page: file,
          data: file.data,
          site: this,
          content
        },{},(err,res)=>{
        if (err) resolve(String(err));
        else resolve(res);
      })
    });
  }

  registerType(id,type) {
    this.types[id]=type;
  }
  registerExtension(id,ext) {
    this.extensions[id]=ext;
  }
  async createFile(absolute) {
    const { ext } = Path.parse(absolute);
    const type = this.extensions[ext.substr(1)];
    const Type = this.types[type];
    if (!Type) return null;
    return await Type.create(this,absolute)
  }

}

class DocFile {
  data = {};
  async create(bundler, absolute) {
    this.bundler = bundler;
    this.absolute = absolute;
    this.relative = this.path = absolute.substr(bundler.source.length)
    this.parsed = Path.parse(this.path);
    this.outfile = this.parsed.base;
    this.depth = this.path.split("/").filter(Boolean).length
    this.title = this.parsed.name;
  }
  
  static async create(absolute,...args) {
    const me = new this();
    await me.create(absolute,...args);
    return me;
  }
}

class DocStatic extends DocFile {
  async output() {
    return await fs.readFile(this.absolute);
  }
  async serve(req,res) {
    res.sendFile(this.absolute);
  }
}

class DocPage extends DocFile {
  async create(...args) {
    await super.create(...args);
    this.outfile = this.parsed.name+".html";

    const content = await fs.readFile(this.absolute);
    const lines = String(content).split(/\n/);
    var yamlFound = false;
    const yamlLines = [];

    for (var l = 0; l<lines.length; l++) {
      const line = lines[l];
      if (!line.trim()) continue;
      if (line.trim().match(/^----+$/)) {
        yamlFound = !yamlFound;
        continue;
      }
      if (!yamlFound) break;
      yamlLines.push(line);
    }
    const yaml = yamlLines.join("\n");
    const json = YAML.parse(yaml) || {}
    this.data = json;
    this.content = lines.slice(l).join("\n")
    this.title = this.data.title || this.parsed.name;
  }

  async output() {
    return await this.bundler.layout(this,this.transform());
  }

  transform() {
    return this.content;
  }
  async serve(req,res) {
    res.header("content-type","text/html");
    res.end(await this.output());
  }
}

const marked = require('marked');
class DocMarkdown extends DocPage {
  async create(...args) {
    await super.create(...args);
    if (this.parsed.name === "index") {
      this.path = this.parsed.dir !=="/" ? this.parsed.dir+"/" : "/";
    } else {
      this.path = Path.join(this.parsed.dir,this.parsed.name)
    }
  }
  transform() {
    return marked(this.content);
  }
}

module.exports = DocBundler;