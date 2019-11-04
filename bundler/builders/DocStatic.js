import { promises as fs } from "fs";
import { DocFile } from "./DocFile.js";

export class DocStatic extends DocFile {
  async output() {
    return await fs.readFile(this.absolute);
  }
  async serve(req, res) {
    res.sendFile(this.absolute);
  }
}
