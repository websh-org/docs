----
title: File API Commands
nav:
  title: Commands
----


## file-new
Create an empty document.

````js
Command "file-new" {} => true
````

### Example
````js
WebShellApp.command( "file-new", async function () { 
  await myEditor.emptyContent();
  return true;
})
````

### Steps
1. The user clicks the **File > New** button
2. WebShell sends the command to the app
3. The app creates a new empty document
4. The app returns `true`
5. WebShell sets the current file in accordance with the manifest
    > The file is named `New [label].[extension]`

## file-open
````js
Command "file-open" { String extension, String format, Varying content } => true
````

The app receives the content of the file to be opened, as well as its extension and the ID of its format (this will be one of the formats specified in the app's manifest). The type of `content` depends on the encoding specified in the format.


### Errors

````js
Error "file-cannot-open" { String reason }
````
Throw if the received content does not match the supplied expected format.

### Example
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

### Steps
1. The user clicks the **File > Open** button
2. WebShell displays the **File Open** dialog to allow the user tp choose a file.
3. WebShell sends the command to the app
4. The app creates a new document from the file's contents.
5. The app returns `true`
> If the app throws an error, WebShell display it and skips the following steps.
6. WebShell sets the current file to the opened file

## file-save
````js
Command "file-save" { String format } => { content }
````
The app receives the format of the file that is to be saved, and returns the content of the file that will be saved. The expected type of `content` depends on the encoding specified in the manifest. The default mime type specified in the format in the manifest will be used for the saved file.




### Example
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

### Steps
#### Save
1. The user clicks the **File > Save**
3. WebShell sends the command to the app, with `format` and `extension` set according to the current file.
4. The app creates the file content from its current document
5. The app returns the content.
6. WebShell saves the file.

#### Save As
1. The user clicks **File > Save As** button
2. WebShell displays the **File Save As** dialog to allow the user to choose a file name and format.
3. WebShell sends the command to the app, setting `format` and `extension` from the dialog.
4. The app creates the file content from its current document.
5. The app returns the content.
6. WebShell saves the file
7. WebShell sets the current file to the new file name and format.