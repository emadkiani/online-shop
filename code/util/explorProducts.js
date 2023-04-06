function findProducts ( products, token )
{
    let findedProducts = [];

    for ( const product of products )
    {
        if (
            product[ 'title' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            product[ 'brand' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            product[ 'summary' ].toUpperCase().trim().includes( token.toUpperCase().trim() ) ||
            product[ 'description' ].toUpperCase().trim().includes( token.toUpperCase().trim() )
        )
        {
            findedProducts.push( product );
        }
    }

    return findedProducts;
}

function categoryProducts ( products, category )
{
    let findedProducts = [];

    for ( const product of products )
    {
        if (
            product[ 'category' ].toUpperCase().trim().includes( category.toUpperCase().trim() ) )
        {
            findedProducts.push( product );
        }
    }

    return findedProducts;
}

function sortProducts ( products, sortTyple )
{
    switch ( sortTyple )
    {
        case 'a-z':
            products.sort( function ( a, b )
            {
                if ( a[ 'title' ] < b[ 'title' ] )
                {
                    return -1;
                }
                if ( a[ 'title' ] > b[ 'title' ] )
                {
                    return 1;
                }
                return 0;
            } );
            break;

        case 'z-a':
            products.sort( function ( a, b )
            {
                if ( a[ 'title' ] > b[ 'title' ] )
                {
                    return -1;
                }
                if ( a[ 'title' ] < b[ 'title' ] )
                {
                    return 1;
                }
                return 0;
            } );
            break;

        case 'max-min':
            products.sort( function ( a, b )
            {
                if ( +a[ 'price' ] > +b[ 'price' ] && +a[ 'quantity' ] > 0 )
                {
                    return -1;
                }
                if ( +a[ 'price' ] < +b[ 'price' ] && +a[ 'quantity' ] > 0 )
                {
                    return 1;
                }
                if ( +a[ 'quantity' ] < 1 )
                {
                    return 0;
                }
                return 0
            } );
            break;

        case 'min-max':
            products.sort( function ( a, b )
            {
                if ( +a[ 'price' ] < +b[ 'price' ] )
                {
                    return -1;
                }
                if ( +a[ 'price' ] > +b[ 'price' ] )
                {
                    return 1;
                }
                return 0;
            } );
            break;

        default:
            products.sort( function ( a, b )
            {
                if ( a[ 'title' ] < b[ 'title' ] )
                {
                    return -1;
                }
                if ( a[ 'title' ] > b[ 'title' ] )
                {
                    return 1;
                }
                return 0;
            } );
    }

    return products;
}

function availableProducts ( products )
{
    let availableProd = [];

    for ( const product of products )
    {
        if ( product[ 'quantity' ] > 0 )
        {
            availableProd.push( product );
        }
    }

    return availableProd;
}

module.exports = {
    findProducts: findProducts,
    sortProducts: sortProducts,
    categoryProducts: categoryProducts,
    availableProducts: availableProducts
};