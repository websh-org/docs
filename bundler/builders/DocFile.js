import Path from "path";

export class DocFile {
  data = {};
  navParent = null;
  navParents = [];
  navChildren = [];
  get navRoot() {
    return this.navParents[0];
  }

  get outfile() {
    return this.parsed.base;
  }

  get path() {
    return this.relative;
  }

  constructor(bundler, absolute) {
    this.lastModified = new Date().toGMTString();
    this.bundler = bundler;
    this.absolute = absolute;
    this.relative = absolute.substr(bundler.source.length)
    this.parsed = Path.parse(this.relative);
    this.level = this.path.split("/").filter(Boolean).length
    this.title = this.parsed.name;
  }

  load() {}

  static async create(...args) {
    const me = new this(...args);
    await me.load(...args);
    return me;
  }
}