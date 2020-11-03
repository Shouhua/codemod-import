const compiler = require('vue-template-compiler');
const descriptorToString = require('vue-sfc-descriptor-to-string');

module.exports = function adapt(transform) {
  return function newTransform(fileInfo, api, options) {
    if (!fileInfo.path.endsWith('.vue')) {
      return transform(fileInfo, api, options);
    }

    const sfcDescriptor = compiler.parseComponent(fileInfo.source);
    const scriptBlock = sfcDescriptor.script;

    if (scriptBlock) {
      fileInfo.source = scriptBlock.content;

      const newScriptContent = transform(fileInfo, api, options);
      if (!!newScriptContent) {
        scriptBlock.content = newScriptContent;

        return descriptorToString(sfcDescriptor);
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };
}