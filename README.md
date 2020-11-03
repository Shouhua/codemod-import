### Fixed problem:
This project is mainly aim to transform file name and import references from camel case to kebab case, here is issues field:
1. default extension: [.js .vue .json .svg]
2. resolve webpack alias like @,@modules,@store,@utils
4. resolve file hierarchy like:
  * Comp
    * index.[vue,js]

5. rewrite references by using single quote
### How to use:
1. ```npm i git+ssh://git addr -g```
2. ```codemod-import [vue project src directory]```