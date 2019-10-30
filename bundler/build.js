const util = require('util');

const rimraf = util.promisify(require("rimraf"));
const fs = require("fs").promises;
const Path = require('path');
const SOURCE = Path.resolve(__dirname , "../source");
const DEST = Path.resolve(__dirname , "../docs");
const DocBundler = require("./DocBundler.js")

const bundler = new DocBundler({source:SOURCE});


async function build() {
  await bundler.loadFiles();

  Object.values(bundler.files).forEach( async file => {
    await rimraf(Path.join(DEST,'*'));
    const dir = Path.join(DEST,file.parsed.dir)
    const dest = Path.join(dir,file.outfile)
    const output = await file.output();
    await fs.mkdir(dir,{recursive:true})
    await fs.writeFile(dest,output)
  })
}
build();

