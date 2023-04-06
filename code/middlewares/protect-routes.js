function protectRoutes ( req, res, next )
{
    if ( req.path.startsWith( '/admin' ) && !res.locals.isAdmin )
    {
        return res.redirect( '/403' );
    }

    if ( req.path.startsWith( '/orders' ) && !res.locals.isAuth )
    {
        return res.redirect( '/401' );
    }

    if ( req.path.startsWith( '/profile' ) && !res.locals.isAuth )
    {
        return res.redirect( '/401' );
    }

    if ( req.path.startsWith( '/public' ) && res.locals.isAdmin )
    {
        return res.redirect( '/404' );
    }

    if ( req.path.startsWith( '/cart' ) && res.locals.isAdmin )
    {
        return res.redirect( '/404' );
    }

    if ( req.path.startsWith( '/auth' ) && res.locals.isAuth )
    {
        return res.redirect( '/404' );
    }

    next();
}

module.exports = protectRoutes;
