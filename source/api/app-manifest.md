----
title: App Manifest
----

The app manifest describes the app and its capabilities to WebShell. It is defined with `WebShellApp.manifest()` and sent
to WebShell when the app is loaded.

The root object of the manifest contains general information about the app.

For each API that it supports, the app must include an entry in the `.api` object in its manifest, formatted as specified in each app API.


````js
WebShellApp.manifest({
  v: 0,
  String name, 
  String short_name,
  String description,
  String version,
  String author,
  String homepage,
  String repository,
  String bugs,
  String author,
  String icon, // Icon url
  Object api: {
    ...
  }
})
````

