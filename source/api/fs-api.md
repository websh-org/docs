# FS API

## FS Volumes

### fs-volume-mount
Open a FS adapter in an iframe and connect it to the file system.
````js
Command "fs-volume-mount" { String url, HTMLIframeElement iframe } => { String vid }

Error "fs-volume-already-mounted" { vid }
````

### fs-volume-umount
Ask the FS volume to disconnect nicely. 
````js
Command "fs-volume-umount" { String vid } => "OK"

Error "fs-volume-not-mounted" { vid }
````


### fs-volume-umount-force
Force unload an app.
````js
Command "fs-volume-umount-force" { String appid } => "OK"

Error "fs-volume-not-mounted" { String appid }
````

## FS File Operations
> File operations should probably support multiple encodings, to make it easier for UI developers. Recoding should be done in one place, either here or in the shell.

> There are currently no explicit operations for folders. `fs-file-get` can read folder contents. Anything that is a folder (i.e. can have children) should have its `.is.folder` set to `true`. 

### fs-file-get 
Get information for a path in the FS, possibly including the content.
````js
Command "fs-file-get" { 
  String path, 
  Object include: { 
    Boolean parent, 
    Boolean parents, 
    Boolean children, 
    Boolean content 
  } => WebShellFile

Error "fs-not-found" { String path }
Error "fs-access-denied" { String path }
````

### fs-file-create
Create a named file at a path in the FS.
> Should this create folders if type is `folder/directory`? Are directories the only kind of folder that we might want to create? 
````js
Command "fs-file-create" { 
  String parentpath, 
  String name,
  String type,
  ArrayBuffer content,
  Object include: { 
    Boolean parent, 
    Boolean parents, 
    Boolean children, 
    Boolean content 
  } => WebShellFile

Error "fs-not-found" { String path }
Error "fs-access-denied" { String path }
````


### fs-file-update
Update the content of a file at a path in the FS.
> Should this also update file names, i.e. rename files? Should it update the file parent, i.e. move files?
````js
Command "fs-file-update" { 
  String path, 
  String type,
  ArrayBuffer content,
  Object include: { 
    Boolean parent, 
    Boolean parents, 
    Boolean children, 
    Boolean content 
  } => WebShellFile

Error "fs-not-found" { String path }
Error "fs-access-denied" { String path }
````
