
import Path from "path";
import DocBundler from "./DocBundler.js";
import watch from "node-watch";
import express from "express"

const __dirname = Path.dirname(new URL(import.meta.url).pathname);
const SOURCE = Path.resolve(__dirname , "../source");

const bundler = new DocBundler({source:SOURCE});

watch(SOURCE, { recursive: true }, async function(evt, name) {
  await bundler.updateFile(evt,name);
});

async function serve() {
  await bundler.loadFiles();
  const port = process.env.PORT || 3000
  const app = express()
  app.head((req, res) => {
    bundler.serve(req,res,req.path);
  })
  app.use((req, res) => {
    bundler.serve(req,res,req.path);
  })
  
  app.listen(port, () => console.log(`DocBundler listening on port ${port}!`))
}
serve();

