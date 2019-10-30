----
title: File API
toc:
  link: false
  children:
    - manifest
    - commands
----


Supports file operations in WebShell apps.
* *format* is a file format described in the app manifest.
* *document* is the current state of the app that can be opened or saved to a file.
* *current file* is the file that was opened or created by the app. This is tracked by WebShell, not the app.

## API Manifest
````js
{
  ...
  api: {
    Object file: {
      String new,
      Array<String>: open,
      Array<String>: save,
      Object formats: {
        "format-id": Object {
          String name, 
          String extension, 
          String type,
          String accept,
          String encoding = "text",
        }
      }
    }
  }
}
````
* `new` is the id of the "native" file format of the app. It will be used to name new files. It must refer to one of the file formats defined under `formats`.
* `open` is an array of ids of the file formats that the app can open.
* `save` is an array of ids of the file formats that the app can save.

### File formats details:
* `name` - The human readable name of this file format.
  * Will be used for display in file dialogs and for naming new files.
* `extension` - The extension for this file format. 
  * Will be appended to file names on Save As.
  * Unless `accept˙ is satisfied, will be used for filtering files in file dialogs.
* `type` - the content type of this format. 
  * Files of this format will be saved with this type.
* `accept` - the filter for this file format in file dialogs. 
  * Uses the same format as the `accept` attribute of the HTML file input.
* `encoding`
  * The encoding to be used when transferring this format. The valid values are:
    * `"text"` - The content is text and will be transfered as a string.
    * `"dataurl"` - The content will be transferred as a data url.
    * Not yet implemented:
      * `"json"` - The content is JSON text and will be transfered as any JSONable value.
      * `"base64"` - The content is binary and will be transfered as a base64-encoded string.
      * `"binary"` - The content is binary and will be transferred as a `UInt8Array` buffer.
      * `"blob"` - The content will be transferred as a blob object.
    

### Example

````json
{
  ...
  "api": {
    "file": {
      "new": "text",
      "open": ["text"],
      "save": ["text"],
      "formats": {
        "text": {
          "name": "Text File",
          "extension": "txt",
          "type": "text/plain",
          "accept": "text/*"
        }
      }
    }
  }
}
````

## Commands

### file-new
Create an empty document.

#### Synopsys
````js
Command "file-new" {} => true
````

#### Example
````js
WebShellApp.command( "file-new", async function () { 
  await myEditor.emptyContent();
  return true;
})
````

#### Workflow
1. The user clicks the **File > New** button
2. WebShell sends the command to the app
3. The app creates a new empty document
4. The app returns `true`
5. WebShell sets the current file in accordance with the manifest
    > The file is named `New [label].[extension]`

### file-open
The app receives the content of the file to be opened, as well as its extension and the ID of its format (this will be one of the formats specified in the app's manifest). The type of `content` depends on the encoding specified in the format.

#### Synopsis
````js
Command "file-open" { String extension, String format, Varying content } => true
````

#### Errors

````js
Error "file-cannot-open" { String reason }
````
Throw if the received content does not match the supplied expected format.

#### Example
````js
WebShellApp.command("file-open", async function ({format, content, extension}) { 
  try {
    await myEditor.setContent(content);
  } catch (error) {
    this.throw("file-cannot-open", { 
      reason: String(error) 
    })
  }
  return true;
})
````

#### Workflow
1. The user clicks the **File > Open** button
2. WebShell displays the **File Open** dialog to allow the user tp choose a file.
3. WebShell sends the command to the app
4. The app creates a new document from the file's contents.
5. The app returns `true`
> If the app throws an error, WebShell display it and skips the following steps.
6. WebShell sets the current file to the opened file

### file-save
The app receives the format and the extension of the file that is to be saved, and returns the content of the file that will be saved. The expected type of `content` depends on the encoding specified in the manifest. The default mime type specified in the format in the manifest will be used for the saved file.


#### Synopsis

````js
Command "file-save" { String extension,  String format } => { content }
````


#### Example
````js
WebShellApp.command("file-open", async function ({format, extension}) { 
  switch (format) {
    case "text": return ({ 
      content: await myEditor.getText() 
    })
    case "myFormat": return ({ 
      content: await myEditor.getContent() 
    })
  }
})
````

#### Workflow
##### Save
1. The user clicks the **File > Save**
3. WebShell sends the command to the app, with `format` and `extension` set according to the current file.
4. The app creates the file content from its current document
5. The app returns the content.
6. WebShell saves the file.

##### Save As
1. The user clicks **File > Save As** button
2. WebShell displays the **File Save As** dialog to allow the user to choose a file name and format.
3. WebShell sends the command to the app, setting `format` and `extension` from the dialog.
4. The app creates the file content from its current document.
5. The app returns the content.
6. WebShell saves the file
7. WebShell sets the current file to the new file name and format.