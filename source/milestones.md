----
title: Milestones
----

## 0.1 - Core
* Core: Async Message Channel
  * see [@websh/remote-master-port](/packages/remote-master-port) and [@websh/remote-slave-port](/packages/remote-slave-port)
* Core: App Controler
  * see [src/app-controller.mjs](https://github.com/websh-org/shell/blob/master/src/app-controller.mjs) at [@websh/shell](https://github.com/websh-org/shell)
* Core: JS Library For Apps
  * see [@websh/web-shell-app](/packages/remote-master-port) 
* App API: App Manifest
  * see [App API](/app-api)
* App API: Open File, Save File, New File
  * see [App API: File](/app-api-file)

## 0.2 - Single App Shell
* Single App Shell: Publish App Sandbox
  * see [WebShell Sandbox](/sandbox) and [the source](https://github.com/websh-org/sandbox)
* Single App Shell: Save/Open from local FS
  * see [WebShell Sandbox](/sandbox) and [the source](https://github.com/websh-org/sandbox)
* App: Example App - Textarea
  * see the [Vanilla Example app]((https://github.com/websh-org/template-app-vanilla)) and [the Parcel Example app](https://github.com/websh-org/template-app-parcel)
* App: Example App - Image viewer
  * see the [Image Example app]((https://github.com/websh-org/app-example-image)

## 0.3 - Shell FS
* Core: Secure message channel with JWT
* FS API: FS Adapter Manifest
* FS API: List / Info / Read / Write
* File Manager: File Dialogs
* FS Adapter: Solid Storage Files
* Single App Shell, File Manager: Integrate FS and File Dialogs
* App: Rich Text Editor

## 0.4 - Registry
* Registry API: Basic CRUD
* Registry Adapter: IndexedDB
* File Manager: Connect multiple adapters
* FS API, Registry API: Persistent FS connections
* FS Adapter: remotestorage.io
* Single App Shell, Registry API: Integrate Registry
* App: Source Code Editor

## 0.5 - Basic Desktop
* Desktop: Windows
* Desktop: Dock
* Desktop: Panel
* DesktopFile Manager: File Browser
* Desktop: Main Menu
* Desktop, Registry API: Known Apps Inventory
* Desktop, Single App Shell, Registry API: Login
* Registry Adapter: Solid Storage
* App: Image editor - resize / crop / basic filters

## 0.6 - Advanced Apps
* App API: Import File, Export File
* App API, Registry API: Persistent App State
* App API: Notifications
* FS Adapter: Github
* Desktop, Registry API: Known File Formats inventory
* Desktop, File Manager: Open File with ...
* App: Example game with high scores

## 0.7 - Advanced Desktop
* App API: App Settings
* App API: Restore Session
* App API: Autosave
* Desktop: Panes
* Desktop: Notifications / log pane
* Desktop: System Settings pane
* FS Adapter: Dropbox
* App: Painter

## 0.8 - Advanced FS
* FS API: Copy / Move
* File Manager, FS API: Custom Actions
* Desktop: Support Themes
* FS Adapter: Google Drive
* App: Drawing Editor

## 0.9 - Self Hosting
* Registry Adapter: Self-hosted registry
* Desktop: Install / remove apps on server
* FS Adapter: Server FS
* FS Adapter: SFTP proxy FS
* FS Adapter: FTP proxy FS
* Desktop: Clock / Calendar pane
* Desktop: Radio pane
* App: Simple IDE for self-hosted apps

# 1.0 - Release
* Known bugs fixed
* Release
