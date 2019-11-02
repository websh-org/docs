import Path from "path";
import marked from "marked";

import { DocPage } from "./DocPage.js";

export class DocMarkdown extends DocPage {
  async create(...args) {
    await super.create(...args);
    if (this.parsed.name === "index") {
      this.path = this.parsed.dir !== "/" ? this.parsed.dir + "/" : "/";
    } else {
      this.path = Path.join(this.parsed.dir, this.parsed.name)
    }
  }
  toc = [];
  transform() {
    const toc = [];
    const renderer = new marked.Renderer;
    renderer.heading = function (text, level, raw, slugger) {
      const slug = slugger.slug(text);
      toc.push({ level, text, slug });
      return `
      <h${level}>
        <a name="${slug}" class="anchor" href="#${slug}">
          <span class="header-link"></span>
        </a>
        ${text}
      </h${level}>`;
    };
    marked.setOptions({ renderer })
    const ret = marked(this.content);
    this.toc = toc;
    return ret;
  }
}