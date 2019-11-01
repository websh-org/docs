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
    console.log("Reading from",this.source)
    const names = await recursive(this.source);
    this.files = {};
    for (const name of names) {
      const file = await this.loadFIle(name,{});
      if(!file) continue;
      this.files[file.path]=file;
    }
    console.log(Object.keys(this.files).length, "files read.");
  }
  _toc = null;
  generateToc(path,depth=0,res=[]) {
    const file = this.files[path];
    if (!file) return;
    if (res.find(r=>r.file===file)) return;
    const conf = file.data.toc || {};
    //console.log(file.path)
    res.push({
      file,
      title: conf.title || file.title,
      path: file.path,
      depth,
      link: conf.link !== false
    });
    for (const child of conf.children||[]) {
      const parentPath = file.path.replace(/(.)[/]$/,"$1");
      //console.log({parentPath,child});
      const childPath = Path.resolve(parentPath,child)+(child.endsWith("/")?"/":"")
      this.generateToc(childPath,depth+1,res);
    }
    return res;
  }

  get toc() {
    if (!this._toc) {
      console.log("generating toc")
      this._toc = this.generateToc("/");
    }
    return this._toc;
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
  async loadFIle(absolute) {
    const { ext } = Path.parse(absolute);
    const type = this.extensions[ext.substr(1)];
    const Type = this.types[type];
    if (!Type) return null;
    const file = await Type.create(this,absolute)
    this._toc = null;
    return file;
  }

}

class DocFile {
  data = {};
  async create(bundler, absolute) {
    this.lastModified = new Date().toGMTString();
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
    res.header("last-modified",this.lastModified)
    res.header("content-type","text/html");
    if (req.method==="HEAD") return res.end();
    res.end(await this.output());
  }
}

const marked = require('marked');
const hljs = require("highlight.js");

marked.setOptions({
  highlight: function(code,lang) {
    return hljs.highlight(lang,code,true).value;
  },
  gfm:true
})

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