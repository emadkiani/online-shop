const Product = require( '../models/product.model' );
const Order = require( '../models/order.model' );

const sessionFlash = require( '../util/session-flash' );
const productValidation = require( '../util/productValidation' );
const explorProducts = require( '../util/explorProducts' );
const exploreOrders = require( '../util/exploreOrders' );

async function getProducts ( req, res, next )
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

        res.render( 'admin/products/all-products', { products: products, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
        return;
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

        res.render( 'admin/products/all-products', { products: products, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
        return;
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
            res.redirect( '/admin/products/search' );
        }
    );
}

function getNewProduct ( req, res )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            title: '',
            brand: '',
            category: '',
            price: '',
            discount: '',
            quantity: '',
            summary: '',
            description: ''
        };
    }

    res.render( 'admin/products/new-product', { inputData: sessionData } );
}

async function createNewProduct ( req, res, next )
{
    const enteredData = {
        title: req.body.title,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        discount: req.body.discount,
        quantity: req.body.quantity,
        summary: req.body.summary,
        description: req.body.description
    };

    if (
        !productValidation.productDetailsAreValid(
            req.body.title,
            req.body.brand,
            req.body.category,
            req.body.summary,
            req.body.description,
            req.body.price,
            req.body.discount,
            req.body.quantity,
        )
    )
    {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    'Please check your input.',
                ...enteredData,
            },
            function ()
            {
                res.redirect( '/admin/products/new' );
            }
        );
        return;
    }

    const product = new Product( {
        ...req.body,
        image: req.file.filename,
    } );

    try
    {
        await product.save();
    } catch ( error )
    {
        next( error );
        return;
    }

    res.redirect( '/admin/products' );
}

async function getUpdateProduct ( req, res, next )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            title: '',
            brand: '',
            category: '',
            price: '',
            discount: '',
            quantity: '',
            summary: '',
            description: ''
        };
    }

    try
    {
        const product = await Product.findById( req.params.id );
        res.render( 'admin/products/update-product', { product: product, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
    }
}

async function updateProduct ( req, res, next )
{
    const enteredData = {
        title: req.body.title,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        discount: req.body.discount,
        quantity: req.body.quantity,
        summary: req.body.summary,
        description: req.body.description
    };

    if (
        !productValidation.productDetailsAreValid(
            req.body.title,
            req.body.brand,
            req.body.category,
            req.body.summary,
            req.body.description,
            req.body.price,
            req.body.discount,
            req.body.quantity,
        )
    )
    {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    'Please check your input.',
                ...enteredData,
            },
            function ()
            {
                res.redirect( `/admin/products/${ req.params.id }` );
            }
        );
        return;
    }

    const product = new Product( {
        ...req.body,
        _id: req.params.id,
    } );

    if ( req.file )
    {
        product.replaceImage( req.file.filename );
    }

    try
    {
        await product.save();
    } catch ( error )
    {
        next( error );
        return;
    }

    res.redirect( '/admin/products' );
}

async function deleteProduct ( req, res, next )
{
    let product;
    try
    {
        product = await Product.findById( req.params.id );
        await product.remove();
    } catch ( error )
    {
        return next( error );
    }

    res.json( { message: 'Deleted product!' } );
}

async function getOrders ( req, res, next )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            orderStatus: 'all',
            orderToken: '',
            orderSortType: 'new-old',
        };
    }

    try
    {
        let orders = await Order.findAll();

        orders = exploreOrders.sortOrders( orders, 'new-old' );

        res.render( 'admin/orders/admin-orders', { orders: orders, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
    }
}

async function getSearchOrders ( req, res, next )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            orderStatus: 'all',
            orderToken: '',
            orderSortType: 'new-old',
        };
    }

    try
    {
        let orders = await Order.findAll();

        if ( !( sessionData.orderStatus === 'all' ) )
        {
            orders = exploreOrders.statusOrders( orders, sessionData.orderStatus );
        }

        if ( !( sessionData.orderToken === '' ) )
        {
            orders = exploreOrders.findOrders( orders, sessionData.orderToken );
        }

        orders = exploreOrders.sortOrders( orders, sessionData.orderSortType );

        res.render( 'admin/orders/admin-orders', { orders: orders, inputData: sessionData } );
    } catch ( error )
    {
        next( error );
    }
}

function searchOrders ( req, res )
{
    const enteredData = {
        orderStatus: req.body.status,
        orderToken: req.body.token,
        orderSortType: req.body.sort,
    }

    sessionFlash.flashDataToSession(
        req,
        {
            message: `Search: ${ req.body.status } - ${ req.body.token } - ${ req.body.sort }.`,
            ...enteredData,
        },
        function ()
        {
            res.redirect( '/admin/orders/search' );
        }
    );
}

async function updateOrder ( req, res, next )
{
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;

    try
    {
        const order = await Order.findById( orderId );

        order.status = newStatus;

        await order.save();

        res.json( { message: 'Order updated', newStatus: newStatus } );
    } catch ( error )
    {
        next( error );
    }
}

module.exports = {
    getProducts: getProducts,
    searchProducts: searchProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
    updateOrder: updateOrder,
    getSearchProducts: getSearchProducts,
    getSearchOrders: getSearchOrders,
    searchOrders: searchOrders
};
