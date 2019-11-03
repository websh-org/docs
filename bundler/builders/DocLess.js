import { promises as fs} from "fs";
import less from "less";

import { DocFile } from "./DocFile.js";

export class DocLess extends DocFile {
  get outfile() {
    return  this.parsed.name + ".css"
  }

  get path() {
    return this.parsed.dir+"/"+this.parsed.name + ".css";
  }
  
  async load(...args) {
    this.content = await fs.readFile(this.absolute,"utf8");
    
  }

  async output() {
    try {
      const out = await less.render(this.content);
      return out.css;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  async serve(req,res) {

    res.header("content-type", "text/css");
    if (req.method === "HEAD") return res.end();
    res.end(await this.output());
  }
}