const devtools = require('./DevTools');
const auth = require('./Auth');
const docTools = require('./DocTools');

module.exports = { ...auth, ...docTools, ...devtools };