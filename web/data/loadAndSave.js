//Save file from https://web.dev/patterns/files/save-a-file/
//With some modification
const saveFile = async (blob, suggestedName) => {
    // Feature detection. The API needs to be supported
    // and the app not run in an iframe.
    const supportsFileSystemAccess =
      'showSaveFilePicker' in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();
    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      try {
        // Show the file save dialog.
        const handle = await showSaveFilePicker({
          suggestedName, accept: {'text/plain': ['.txt']}
        });
        // Write the blob to the file.
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        // Fail silently if the user has simply canceled the dialog.
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
          return;
        }
      }
    }
    // Fallback if the File System Access API is not supported…
    // Create the blob URL.
    const blobURL = URL.createObjectURL(blob);
    // Create the `<a download>` element and append it invisibly.
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = suggestedName;
    a.style.display = 'none';
    document.body.append(a);
    // Programmatically click the element.
    a.click();
    // Revoke the blob URL and remove the element.
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      a.remove();
    }, 1000);
  };


//Load File From https://web.dev/patterns/files/open-one-or-multiple-files/
//With some modification
const loadFile = async (multiple = false) => {
    // Feature detection. The API needs to be supported
    // and the app not run in an iframe.
    const supportsFileSystemAccess =
      "showOpenFilePicker" in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();
    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      let fileOrFiles = undefined;
      try {
        // Show the file picker, optionally allowing multiple files.
        const handles = await showOpenFilePicker({ multiple });
        // Only one file is requested.
        if (!multiple) {
          // Add the `FileSystemFileHandle` as `.handle`.
          fileOrFiles = await handles[0].getFile();
          fileOrFiles.handle = handles[0];
        } else {
          fileOrFiles = await Promise.all(
            handles.map(async (handle) => {
              const file = await handle.getFile();
              // Add the `FileSystemFileHandle` as `.handle`.
              file.handle = handle;
              return file;
            })
          );
        }
      } catch (err) {
        // Fail silently if the user has simply canceled the dialog.
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      }
      return fileOrFiles;
    }
    // Fallback if the File System Access API is not supported.
    return new Promise((resolve) => {
      // Append a new `<input type="file" multiple? />` and hide it.
      const input = document.createElement('input');
      input.style.display = 'none';
      input.type = 'file';
      document.body.append(input);
      if (multiple) {
        input.multiple = true;
      }
      // The `change` event fires when the user interacts with the dialog.
      input.addEventListener('change', () => {
        // Remove the `<input type="file" multiple? />` again from the DOM.
        input.remove();
        // If no files were selected, return.
        if (!input.files) {
          return;
        }
        // Return all files or just one file.
        resolve(multiple ? Array.from(input.files) : input.files[0]);
      });
      // Show the picker.
      if ('showPicker' in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.click();
      }
    });
  };