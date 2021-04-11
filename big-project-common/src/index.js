const devtools = require('./DevTools');
const auth = require('./Auth');
const docTools = require('./DocTools');
const theme = require('./Theme')
const appName = "Time Tamer"
module.exports = { ...auth, ...docTools, ...devtools, ...theme, appName };