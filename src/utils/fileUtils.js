/**
 * Converts an array of files to a FileList.
 *
 * @param {Array<File>} fileArray
 * @returns {FileList}
 */
export function fileArrayToFileList(fileArray) {
  const dataTransfer = new DataTransfer();
  fileArray.forEach((f) => dataTransfer.items.add(f));
  return dataTransfer.files;
}

/**
 * Handle dataTransfer object coming from drag&drop.
 *
 * Returns files array in a promise, containing all files
 * plus files in the directory and sub-directories.
 *
 * @param {DataTransfer} dataTransfer
 * @returns {Promise<Array<File>>}
 */
export async function handleDataTransfer(dataTransfer) {
  const items = dataTransfer.items;
  const allFiles = [];
  const promises = [];

  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        promises.push(traverseFileTree(item, "", allFiles));
      }
    }
  }

  await Promise.all(promises);
  return allFiles;
}

function traverseFileTree(item, path = "", allFiles = []) {
  return new Promise((resolve, reject) => {
    if (item.isFile) {
      item.file((file) => {
        const relativePath = file.webkitRelativePath || path + file.name;
        file.relativePath = relativePath;
        allFiles.push(file);
        resolve();
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();

      function readEntries() {
        dirReader.readEntries((entries) => {
          if (entries.length === 0) {
            resolve();
          } else {
            const entryPromises = entries.map((entry) =>
              traverseFileTree(entry, path + item.name + "/", allFiles),
            );
            Promise.all(entryPromises).then(readEntries);
          }
        });
      }
      readEntries();
    }
  });
}
