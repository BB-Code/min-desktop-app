'use strict';
const osenv = require('osenv');
const fs = require('fs');
const async = require('async');
const path = require('path');

function getHomeFolder() {
    return osenv.home();
}

function getFilsInFolder(folderPath, cb) {
    fs.readdir(folderPath, cb);
}

function getFileType(filePath, cb) {
    let result = {
        file: path.basename(filePath),
        path: filePath,
        type: ''
    };
    fs.stat(filePath, (err, stats) => {
        if (err) {
            cb(err);
        } else {
            if (stats.isDirectory()) {
                result.type = 'directory';
            }
            if (stats.isFile()) {
                result.type = 'file';
            }
            cb(err, result);
        }
    })
}

function getFileInfo(folderPath, files, cb) {
    async.map(files, (file, asyncCb) => {
        let resPath = path.resolve(folderPath, file);
        getFileType(resPath, asyncCb);
    }, cb);
}

function displayFileToHtml(file) {
    const mainArea = document.getElementById('main-area');
    const template = document.getElementById('item-template');
    let clone = document.importNode(template.content, true);
    console.log(file.type);
    if (file.type === 'file') {
        clone.querySelector('.icon').innerHTML = `<svg
          width="5em"
          height="5em"
          viewBox="0 0 16 16"
          class="bi bi-file-earmark text-warning"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"
          />
          <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z" />
        </svg>`;
    }
    if (file.type === 'directory') {
        clone.querySelector('.icon').innerHTML = `<svg
              width="5em"
              height="5em"
              viewBox="0 0 16 16"
              class="bi bi-folder text-primary"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"
              />
              <path
                fill-rule="evenodd"
                d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"
              />
            </svg>`;
    }
    clone.querySelector('.text-success').innerText = file.file;
    mainArea.appendChild(clone);
}

function displayFiles(err, files) {
    if (err) {
        return alert(`没法显示文件`);
    }
    files.forEach(file => {
        displayFileToHtml(file);
    });
}

function main() {
    const folderPath = getHomeFolder();
    getFilsInFolder(folderPath, (err, files) => {
        if (err) return alert(err);
        // files.forEach((files) => {
        //     console.log(`${folderPath}/${files}`);
        // });
        getFileInfo(folderPath, files, displayFiles);
    });
}

main();