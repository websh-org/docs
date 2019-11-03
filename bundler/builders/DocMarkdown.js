import Path from "path";
import marked from "marked";
import hljs from "highlight.js";
import { DocPage } from "./DocPage.js";
marked.setOptions({
  highlight: function (code,lang) {
    try {
      return hljs.highlight(lang,code).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }
});

export class DocMarkdown extends DocPage {

  get path() {
    if (this.parsed.name === "index") {
      return this.parsed.dir !== "/" ? this.parsed.dir + "/" : "/";
    } else {
      return Path.join(this.parsed.dir, this.parsed.name)
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