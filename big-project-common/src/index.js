var app_name = "group21-big";
function frontend_address(route)
{
    if (is_production())
    {
        return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
        return 'http://localhost:3000/' + route;
    }
}

function backend_address(route)
{
    if (is_production())
    {
        return 'https://' + app_name +  '.herokuapp.com/api/' + route;
    }
    else
    {        
        return 'http://localhost:4000/api/' + route;
    }
}

function is_production() {
    return process.env.NODE_ENV === 'production';
}
const auth = require('./Auth');
const setAuthHandler = auth.setAuthHandler;
module.exports = { frontend_address, backend_address, is_production, setAuthHandler };