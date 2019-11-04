import YAML from 'yaml';
import { promises as fs} from "fs";

import { DocFile } from './DocFile.js';

export class DocPage extends DocFile {
  get outfile() {
    return  this.parsed.name + ".html"
  }
  
  async load(...args) {
    await super.load(...args);

    const content = await fs.readFile(this.absolute);
    const lines = String(content).split(/\n/);
    var yamlFound = false;
    const yamlLines = [];

    for (var l = 0; l < lines.length; l++) {
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
    return await this.bundler.layout(this, await this.transform());
  }

  async transform() {
    return this.content;
  }

  async serve(req, res) {
    res.header("last-modified", this.lastModified)
    res.header("content-type", "text/html");
    if (req.method === "HEAD") return res.end();
    res.end(await this.output());
  }
}

