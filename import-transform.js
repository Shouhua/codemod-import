const path = require('path');
const fs = require('fs');
const { escapeRegexpStr, kebabCase } = require('./utils');
// const describe = require('jscodeshift-helper').describe;
const { inspect } = require('util');
const colors = require('colors');

const ignoreStr = ["element-ui", "echarts", "zrender", "App"];
const onlyShowRegex = [""]; // only show regex, not change
const ignoreRename = /^\.|\.\./;
const extensions = ['.js', '.vue', '.json', '.svg', '.png'];

const findFunc = function (path) {
  const ignoreRegex = new RegExp(ignoreStr.map(item => '\\b' + escapeRegexpStr(item) + '\\b').join('|'));
  return kebabCase(path.value) !== path.value && !ignoreRegex.test(path.value);
}

/**
 * test extensions
 * @param {String} p path without extension
 * @returns {String} extension if exist or empty string or null
 */
var execExt = function (p) {
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(p + extensions[i])) {
      return extensions[i];
    }
  }
  p = p + '/index';
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(p + extensions[i])) {
      return '';
    }
  }
  return null;
}

/**
 * rename function
 * @param {String} s source path 
 * @param {String} d destination path 
 * @param {String} e extension
 * @param {Boolean} dry is simulation
 */
const renameFunc = function (s, d, e, options) {
  try {
    let ext = e;
    let notExist = false;
    if (ext === '' || !extensions.includes(ext)) {
      if ((ext = execExt(s)) === null) {
        // console.error(`${'Can\'t find file path by append extensions'.red}`)
        notExist = true;
      } else {
        s = s + ext;
        d = d + ext;
      }
    }
    // if (!notExist) {
    //   console.log(`${'rename old path:'.green} ${s}, ${'new path:'.green} ${d}`);
    // }
    if (!options.dry && !notExist) {
      // fs.rename(s, d, (err) => {
      //   if (err) throw err;
      //   console.log('Rename complete!');
      // });
      fs.writeFileSync(options.tmpFile, `${s},${d}\n`, {
        encoding: 'utf8',
        flag: 'a'
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * repalce function
 * @param {Object} nodePath 
 * @param {Object} fileInfo 
 * @param {Object} options 
 */
const replaceFunc = function (nodePath, fileInfo, options) {
  const { node } = nodePath;
  const parsedObj = path.parse(node.value);

  const oldPath = node.value;
  const newPath = parsedObj.dir + '/' + kebabCase(parsedObj.name) + parsedObj.ext;
  // console.log(`${'file:'.yellow} ${fileInfo.path}, ${'line:'.yellow} ${node.loc.start.line}, ${'old path:'.yellow} ${node.value}, ${'new path:'.yellow} ${newPath}`)
  const onlyShow = new RegExp(onlyShowRegex.map(item => '\\b' + escapeRegexpStr(item) + '\\b').join('|'));
  if(!onlyShow.test(node.value)) {
    node.value = newPath;
  } else {
    console.log(`${'manually rename:'.yellow} ${fileInfo.path}, ${'line:'.yellow} ${node.loc.start.line}, ${'old path:'.yellow} ${node.value}, ${'new path:'.yellow} ${newPath}`)
  }
  // rename file name-begin with . or ..
  try {
    if (ignoreRename.test(node.value)) {
      let oPath = path.resolve(fileInfo.path, '..', oldPath);
      let nPath = path.resolve(fileInfo.path, '..', newPath);
      renameFunc(oPath, nPath, parsedObj.ext, options);
    }
  } catch (error) {
    console.error(`rename file failed: ${error.message}`.red);
  }
  // rename file name - start with @/ or @modules or @utils or @store
  try {
    const aliasRegex = /(^@)(?=modules|utils|store|\/)/;
    if (aliasRegex.test(node.value)) {
      let oPath = oldPath.replace(aliasRegex, path.resolve(options.srcPath));
      let nPath = node.value.replace(aliasRegex, path.resolve(options.srcPath));
      renameFunc(oPath, nPath, parsedObj.ext, options);
    }
  } catch (error) {
    console.error(`\trename file failed: ${error.message}`.red);
  }
  return node;
}

module.exports = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  let root = j(fileInfo.source);

  // describe(root.find(j.ImportDeclaration).find(j.Literal).get(0).node);

  root.find(j.ImportDeclaration)
    .find(j.Literal, (path) => {
      return findFunc(path);
    })
    .replaceWith(nodePath => {
      return replaceFunc(nodePath, fileInfo, options);
    })

  root.find(j.CallExpression, {
      callee: {
        type: 'Import'
      }
    })
    .find(j.Literal, (path) => {
      return findFunc(path);
    })
    .replaceWith(nodePath => {
      return replaceFunc(nodePath, fileInfo, options);
    });
  return root.toSource({quote: 'single'});
};
