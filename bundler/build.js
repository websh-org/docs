import util from "util";

import _rimraf from "rimraf";
import {promises as fs} from "fs"
import Path from "path";
import DocBundler from "./DocBundler.js"

const __dirname = Path.dirname(new URL(import.meta.url).pathname);
const SOURCE = Path.resolve(__dirname , "../source");
const DEST = Path.resolve(__dirname , "../docs");

const bundler = new DocBundler({source:SOURCE});
const rimraf = util.promisify(_rimraf);

async function build() {
  await bundler.loadFiles();

  Object.values(bundler.paths).forEach( async file => {
    await rimraf(Path.join(DEST,'*'));
    const dir = Path.join(DEST,file.parsed.dir)
    const dest = Path.join(dir,file.outfile)
    const output = await file.output();
    await fs.mkdir(dir,{recursive:true})
    await fs.writeFile(dest,output)
  })
}
build();

