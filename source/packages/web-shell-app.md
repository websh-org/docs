----
title: @websh/web-shell-app
toc:
  title: web-shell-app
----

**[https://github.com/websh-org/web-shell-app](https://github.com/websh-org/web-shell-app)**

The WebShell library for apps. For now, this is is just a wrapper for [remote-slave-port](remote-slave-port). In the future, it might offer more specialized behaviour for WebShell apps.

## Synopsis
````bash
$ npm install @websh/web-shell-app
````

````js
import WebShellApp from "@websh/web-shell-app";

WebShellApp.manifest({
  ... 
})

WebShellApp.command('command-id', async function ({arg1,arg2}) {
  // the handler can be, but doesn't have to be async
  try {
    const res = await myApp.executeCommand(arg1,arg2);
    return res;
  } catch (error) {

    WebShellApp.throw('error-code',error)

  }
})


````
**NOTE**: Command ids, args for each command, expected results, errors and events, are defined in app APIs.
