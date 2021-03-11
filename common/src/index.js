var app_name = "group21-big";
function frontend_address(route)
{
    if (process.env.NODE_ENV === 'production') 
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
    if (process.env.NODE_ENV === 'production') 
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

module.exports = {frontend_address, backend_address, is_production };