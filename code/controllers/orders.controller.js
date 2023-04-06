const stripe = require( 'stripe' )( 'YOUR-KEY' ); //Put tour Sripe-Key here

const Order = require( '../models/order.model' );
const User = require( '../models/user.model' );
const Prodcut = require( '../models/product.model' );

const sessionFlash = require( '../util/session-flash' );
const exploreOrders = require( '../util/exploreOrders' );

let websiteUrl = 'http://localhost:3000';

if ( process.env.WEBSITE_URL )
{
    websiteUrl = process.env.WEBSITE_URL;
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
        let orders = await Order.findAllForUser( res.locals.uid );

        orders = exploreOrders.sortOrders( orders, 'new-old' );

        res.render( 'customer/orders/all-orders', { orders: orders, inputData: sessionData } );
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
        let orders = await Order.findAllForUser( res.locals.uid );

        if ( !( sessionData.orderStatus === 'all' ) )
        {
            orders = exploreOrders.statusOrders( orders, sessionData.orderStatus );
        }

        if ( !( sessionData.orderToken === '' ) && sessionData.orderToken )
        {
            orders = exploreOrders.findOrders( orders, sessionData.orderToken );
        }

        orders = exploreOrders.sortOrders( orders, sessionData.orderSortType );

        res.render( 'customer/orders/all-orders', { orders: orders, inputData: sessionData } );
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
            message: 'Search result',
            ...enteredData,
        },
        function ()
        {
            res.redirect( '/orders/search' );
        }
    );
}

async function addOrder ( req, res, next )
{
    const cart = res.locals.cart;

    let userDocument;

    if ( !cart || cart.totalPrice <= 0 || cart.totalQuantity <= 0 )
    {
        {
            sessionFlash.flashDataToSession(
                req,
                {
                    errorMessage:
                        'There is no cart - maybe add some!'
                },
                function ()
                {
                    res.redirect( '/cart' );
                }
            );
            return;
        }
    }

    try
    {
        userDocument = await User.findById( res.locals.uid );

        for ( const item of res.locals.cart.items )
        {
            result = await Prodcut.paymentProcess(
                item.quantity,
                item.product.id
            );
        }
    } catch ( error )
    {
        return next( error );
    }

    const order = new Order( cart, userDocument );

    try
    {
        await order.save();
    } catch ( error )
    {
        next( error );
        return;
    }

    req.session.cart = null;

    const session = await stripe.checkout.sessions.create( {
        line_items: cart.items.map( function ( item )
        {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.title
                    },
                    unit_amount: Math.round( ( +item.product.price ) * 100 )
                },
                quantity: +item.quantity,
            }
        } ),
        mode: 'payment',
        success_url: `${ websiteUrl }/orders/success`,
        cancel_url: `${ websiteUrl }/orders/failure`,
    } );

    res.redirect( 303, session.url );
}

function getSuccess ( req, res )
{
    res.render( 'customer/orders/success' );
}

function getFailure ( req, res )
{
    res.render( 'customer/orders/failure' );
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    getSuccess: getSuccess,
    getFailure: getFailure,
    searchOrders: searchOrders,
    getSearchOrders: getSearchOrders
};
