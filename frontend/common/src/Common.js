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
export { backend_address, frontend_address };