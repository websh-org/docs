
const recursive = require("recursive-readdir");
const fs = require("fs").promises;
const Path = require('path');
const SOURCE = Path.resolve(__dirname , "../source");
const DocBundler = require("./DocBundler.js")
const bundler = new DocBundler({source:SOURCE});

const watch = require('node-watch');

watch(SOURCE, { recursive: true }, async function(evt, name) {
  await bundler.loadFiles();
});

async function serve() {
  await bundler.loadFiles();
  const port = process.env.PORT || 3000
  const express = require('express')
  const app = express()
  app.use((req, res) => {
    bundler.serve(req,res,req.path);
  })
  
  app.listen(port, () => console.log(`DocBundler listening on port ${port}!`))
}
serve();

