----
title: Step 5 - Implement file operations
----

We will use a `<textarea>` as our text editor. Insert this into `div#app`:

````html
  <textarea id="editor"><textarea>
````

Let's now implement the three file operations:

````js
  const editor = document.getElementByID("editor");

  WebShellApp
  .command("file-new",()=>{
    editor.value = "";
  })
  .command("file-open",({content})=>{
    editor.value = content;
  })
  .command("file-save",()=>{
    return { content: editor.value };
  })
````

**We are done!** 

You can now go to the [WebShell Sandbox](https://websh.org/sandbox) and open your app again. It will have 
the fool file toolbar, and you can actually use it to edit your text files. It's no worse than Windows Notepad!

See below for the full content of `index.html`, including some basic styling.

We will finish in [step 6](step6).

<details><summary><code>index.html</code></summary>

````html
<!doctype html>
<html>
  <head>
    <!-- include the WebShellApp libray -->
    <script src="https://cdn.jsdelivr.net/npm/@websh/web-shell-app/dist/web-shell-app.js"></script>
    <style>
      #app {
        position:fixed; top:0; left:0; width:100%; height:100%;
      }
      #editor {
        position:absolute; top:0; right:0; width:100%; height:100%; border: none;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <textarea id="editor"><textarea>
    </div>
    <script>
      WebShellApp.manifest({
        v: 0 // must be 0 for now,
        name: "My First App",
        icon: "icon.png", 
        short_name: "MyApp",  // This is optional
        description: "This is my first WebShell app.",
        license: "ISC",
        api: {
          file: {
            formats: {
              text: { name: "Text File", type: "text/plain", extension: "txt" }
            },
            save: ["text"],
            open: ["text"],
            new: "text",
          }
        }
      })
  
      const editor = document.getElementByID("editor");

      WebShellApp
      .command("file-new",()=>{
        editor.value = "";
      })
      .command("file-open",({content})=>{
        editor.value = content;
      })
      .command("file-save",()=>{
        return { content: editor.value };
      })
    </script>
  </body>
</html>
````
</details>