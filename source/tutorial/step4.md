----
title: Step 4 - Declare file operations
----

To allow the user to use file operations, we need to tell WebShell that our app implements the File API, and describe the file formats that we can open and save. 

Insert the following into the app manifest:

````js
  api: {
    file: {
      formats: {
        text: {
          name: "Text File",
          type: "text/plain",
          extension: "txt"
        },
      },
      save: ["text"],
      open: ["text"],
      new: "text",
    }
  }
````

In short, we know one format, the humble Text File, we create it when the user clicks the **New** button, and it's among the formats
(i.e. is the only format) we can open and save. This is enough for the file toolbar buttons to appear, but we still need to implement
the file operations inside the app.

On to [step 5](step5)!


<details><summary><code>index.html</code></summary>

````html
<!doctype html>
<html>
  <head>
    <!-- include the WebShellApp libray -->
    <script src="https://cdn.jsdelivr.net/npm/@websh/web-shell-app/dist/web-shell-app.js"></script>
  </head>
  <body>
    <div id="app">
      <!-- this is where we will put our UI -->
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
    </script>
  </body>
</html>
````
</details>