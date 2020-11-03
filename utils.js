/**
 * kebab case
 * @param {String} str 
 */
function kebabCase(str) {
	return str.replace(/(?!^)([A-Z\u00C0-\u00D6])/g, function (match) {
		return '-' + match.toLowerCase();
  });
};

/**
 * test if array
 * @param {Object} obj 
 */
const isArray = function(obj) {
  if(Array.isArray) return Array.isArray(obj);
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * escape regular expression character
 */
const escapeRegexpStr = function(str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"); // $& means the whole matched string
};

module.exports = {
  kebabCase,
  isArray,
  escapeRegexpStr
}