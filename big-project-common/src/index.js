const devtools = require('./DevTools');
const auth = require('./Auth');
const docTools = require('./DocTools');
const theme = require('./Theme')
const appName = "Time Tamer"
const search_url = 'search'
const total_url = 'total'
module.exports = { ...auth, ...docTools, ...devtools, ...theme, appName, search_url, total_url };