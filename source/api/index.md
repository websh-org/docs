----
title: App API Docs
toc: 
  link: false
  children:
    - how-it-works
    - app-manifest
    - file/
----

> **Implemented in WebShell apps, by app developers, using the `WebShellApp` object .**

This document describes the API that a webpage needs to implement to be considered a WebShell app. 

## How it works

The connection between the app (in a sandboxed iframe) and the shell (in the parent window) is established through an async-enabled
messaging channel. The app side of the connection is managed by the `WebShellApp` object from the `@websh/web-shell-app` package.

On connection (immediately after the app is loaded), the app sends  to the shell its manifest, which consists of various meta data about the app and the description of its capabilities according to this API. Use `WebShellApp.manifest` in the app to specify the app's manifest.

After connection, the app receives commands from the shell, which it executes and returns the resuls, or throws an error. The result or the error is then transmitted back to the shell. Use `WebShellApp.command` in the app to register command handlers.

The app can also send events to the shell. Use `WebShellApp.trigger` in the app to send an event.

Commands, expected results, errors and events are defined in various app APIs. 

## App Manifest

````js
WebShellApp.manifest({
  V: "0",
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
For each API that it supports, the app must include an entry in the `.api` object in its manifest, formatted as specified in each app API.
## Commands

Commands are sent from the shell to the app. To register a command handler in the app, use e.g.
````js
WebShellApp.command('test-echo', function ({ text }) {
  if (text === undefined) {
    WebShellApp.throw("command-bad-arguments",{ reason: "must supply text" });
  }
  return { text }
})
````
Handler functions should return the results as described in each app API. If an error occurrs and the result can not be returned, an error should be thrown. Errors should be thrown using `WebShellApp.throw`:
````js
WebShellApp.throw(error,data);
````
## Errors
Errors are described in each app API. In addition to those errors, the following may be thrown if no specific error applies.

````js
Error "command-not-allowed" { String reason }
Error "command-failed" { String reason }
Error "command-internal-error" { String reason }
````
