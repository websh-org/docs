----
title: App Developer's Guide
nav:
  children:
    - works-how
    - ../tutorial/
----

## Getting Started

Your app must include the WebShellApp library.

### Vanilla JS
````html
<script src="https://cdn.jsdelivr.net/npm/@websh/web-shell-app/dist/web-shell-app.js">
````

### ES6 Modules

````sh
npm install @websh/web-shell-app
````
````js
import { WebShellApp } from "@websh/web-shell-app"
````
 
### Common JS

````sh
npm install @websh/web-shell-app
````
````js
const { WebShellApp } = require("@websh/web-shell-app")
````
 
## Manifest

Your app must provide a manifest with information about it. It must be a JSONable object. To specify your app's manifest, use `WebShellApp.manifest()`.

````js
WebShellApp.manifest({
  v: 0 // must be 0 for now,
  name: "My First App", 
  short_name: "MyApp",  // This is optional
  description: "This is my first WebShell app.",
  license: "ISC" // or any SPDX-compliant license ID
})
