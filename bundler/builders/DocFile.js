import Path from "path";

export class DocFile {
  data = {};
  parents=[];
  async create(bundler, absolute) {
    this.lastModified = new Date().toGMTString();
    this.bundler = bundler;
    this.absolute = absolute;
    this.relative = this.path = absolute.substr(bundler.source.length)
    this.parsed = Path.parse(this.path);
    this.outfile = this.parsed.base;
    this.level = this.path.split("/").filter(Boolean).length
    this.title = this.parsed.name;
  }

  static async create(absolute, ...args) {
    const me = new this();
    await me.create(absolute, ...args);
    return me;
  }
}