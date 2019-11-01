----
title: Step 1 - Import the library
----

In this tutorial, we will build a VanillaJS app in a single HTML file.

We'll start with standard HTML boilerplate in `index.html`.
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
      // this is where we will put our code.
    </script>
  </body>
</html>
````

We included the latest version of the library from npm via JsDeliver. You can specify a particular version, if you wish to.

We're putting our code at the end of the `<body>` tag. This is not required for WebShellApp, but it makes a single-file application
easier to code without having to wait for onload events.

We're ready for [step 2](step2).