function findOrders ( orders, token )
{
    let findedOrders = [];

    for ( const order of orders )
    {
        if (
            order[ 'userData' ][ 'name' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            order[ 'userData' ][ 'email' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            order[ 'userData' ][ 'address' ][ 'street' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            order[ 'userData' ][ 'address' ][ 'postalCode' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            order[ 'userData' ][ 'address' ][ 'city' ].toUpperCase().trim().includes( token.toUpperCase().trim() )
        )
        {
            findedOrders.push( order );
        }
    }

    return findedOrders;
}

function statusOrders ( orders, status )
{
    let findedOrders = [];

    for ( const order of orders )
    {
        if (
            order[ 'status' ].toUpperCase().trim().includes( status.toUpperCase().trim() ) )
        {
            findedOrders.push( order );
        }
    }

    return findedOrders;
}

function sortOrders ( orders, sortType )
{
    switch ( sortType )
    {
        case 'new-old':
            orders.sort( function ( a, b )
            {
                return new Date( b.date ) - new Date( a.date );
            } );
            break;

        case 'old-new':
            orders.sort( function ( a, b )
            {
                return new Date( a.date ) - new Date( b.date );
            } );
            break;

        default:
            orders.sort( function ( a, b )
            {
                return new Date( b.date ) - new Date( a.date );
            } );
    }

    return orders;
}

module.exports = {
    findOrders: findOrders,
    sortOrders: sortOrders,
    statusOrders: statusOrders
};