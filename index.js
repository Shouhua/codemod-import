#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const tmp = require('tmp');
const path = require('path');
 
var tmpobj = tmp.fileSync();
// console.log('File: ', tmpobj.name);
// console.log('Filedescriptor: ', tmpobj.fd);
  
// fs.writeFileSync('abc.txt', '');

const tranformFilePath = path.resolve(__dirname, 'my-transform.js');

try {
  execSync('which jscodeshift');
} catch (error) {
  execSync('npm i -g jscodeshift');
}

const child = spawn('jscodeshift', [...process.argv.slice(2), '-t', tranformFilePath , '--extensions=vue,js', `--srcPath=${process.argv[2]}`, `--tmpFile=${tmpobj.name}`]);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('close', (code) => {
  var inStream = fs.createReadStream(tmpobj.name);
  var outStream = new stream;
  var rl = readline.createInterface(inStream, outStream);
  rl.on('line', (line) => {
    const l = line.split(',');
    // if(fs.existsSync(l[0]) && !fs.existsSync(l[1])) {
      try {
        fs.renameSync(l[0], l[1]);
      } catch (error) {
        if(error.errno !== -2) {
          console.error('rename error: ', error.message);
        }
      }
    // }
  });
  // If we don't need the file anymore we could manually call the removeCallback
  // But that is not necessary if we didn't pass the keep option because the library
  // will clean after itself.
  tmpobj.removeCallback();
});