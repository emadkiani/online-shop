const Product = require( '../models/product.model' );

const explorProducts = require( '../util/explorProducts' );
const sessionFlash = require( '../util/session-flash' );

async function getAllProducts ( req, res, next )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            productCategory: 'all',
            productSearch: '',
            productSortType: 'a-z',
            productAvailable: 'on'
        };
    }

    try
    {
        let products = await Product.findAll();

        products = explorProducts.availableProducts( products );

        products = explorProducts.sortProducts( products, 'a-z' );

        res.render( 'customer/products/all-products', { products: products, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
    }
}

async function getSearchProducts ( req, res, next )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            productCategory: 'all',
            productToken: '',
            productSortType: 'a-z',
            productAvailable: 'on'
        };
    }

    try
    {
        let products = await Product.findAll();

        if ( sessionData.productAvailable === 'on' )
        {
            products = explorProducts.availableProducts( products );
        }

        if ( !( sessionData.productToken === '' ) )
        {
            products = explorProducts.findProducts( products, sessionData.productToken );
        }

        if ( !( sessionData.productCategory === 'all' ) )
        {
            products = explorProducts.categoryProducts( products, sessionData.productCategory );
        }

        products = explorProducts.sortProducts( products, sessionData.productSortType );

        res.render( 'customer/products/all-products', { products: products, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
    }
}

function searchProducts ( req, res )
{
    const enteredData = {
        productCategory: req.body.category,
        productToken: req.body.token,
        productSortType: req.body.sort,
        productAvailable: req.body.available[ req.body.available.length - 1 ]
    }

    sessionFlash.flashDataToSession(
        req,
        {
            message: 'Search result',
            ...enteredData,
        },
        function ()
        {
            res.redirect( '/public/products/search' );
        }
    );
}

async function getProductDetails ( req, res, next )
{
    try
    {
        const product = await Product.findById( req.params.id );
        res.render( 'customer/products/product-details', { product: product } );
    } catch ( error )
    {
        next( error );
    }
}

module.exports = {
    getAllProducts: getAllProducts,
    searchProducts: searchProducts,
    getProductDetails: getProductDetails,
    getSearchProducts: getSearchProducts
};
