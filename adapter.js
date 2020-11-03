const compiler = require('vue-template-compiler');
const descriptorToString = require('vue-sfc-descriptor-to-string');

module.exports = function adapt(transform) {
  return function newTransform(fileInfo, api, options) {
    console.log('\t>>>inside new transform');
    if (!fileInfo.path.endsWith('.vue')) {
      return transform(fileInfo, api, options);
    }

    console.log('\t>>>source: ', fileInfo);

    const sfcDescriptor = compiler.parseComponent(fileInfo.source);
    const scriptBlock = sfcDescriptor.script;
    console.log('\t>>>', scriptBlock);

    if (scriptBlock) {
      fileInfo.source = scriptBlock.content;

      const newScriptContent = transform(fileInfo, api, options);
      if (!!newScriptContent) {
        scriptBlock.content = newScriptContent;

        return descriptorToString(sfcDescriptor, {
          indents: {
            template: 0
          }
        });
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };
}