----
title: File API Manifest
toc:
  title: Manifest
----
Add this to your app's manifest to enable file operations.

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
