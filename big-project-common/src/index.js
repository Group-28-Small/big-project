const devtools = require('./DevTools');
const auth = require('./Auth');
const docTools = require('./DocTools');
const appName = "Time Tamer"
module.exports = { ...auth, ...docTools, ...devtools, appName };