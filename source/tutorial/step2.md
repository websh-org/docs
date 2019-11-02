----
title: Step 2 - App manifest
----
Your app must provide a manifest with information about it. It must be a JSONable object. To specify your app's manifest, use `WebShellApp.manifest()`.

Add this to our `<script>` tag in `index.html`;

````js
WebShellApp.manifest({
  v: 0 // must be 0 for now,
  name: "My First App",
  icon: "icon.png", 
  short_name: "MyApp",  // This is optional
  description: "This is my first WebShell app.",
  license: "ISC" // must be an SPDX-compliant license ID
})
````

Add an icon file called `icon.png` next to our `index.html` file. The file can be named anything
and be in any standard image format. 

That's it! We have a working WebShell app!

We will see it in action in [step 3](step3).

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
        license: "ISC" 
      })
    </script>
  </body>
</html>
````
</details>