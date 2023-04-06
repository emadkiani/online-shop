const Admin = require( '../models/admin.model' );

const authUtil = require( '../util/authentication' );
const adminValidation = require( '../util/adminValidation' );
const sessionFlash = require( '../util/session-flash' );

function getAdminSignup ( req, res )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
        };
    }

    res.render( 'admin/auth/signup', { inputData: sessionData } );
}

async function adminSignup ( req, res, next )
{
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body[ 'confirm-email' ],
        password: req.body.password,
        fullname: req.body.fullname,
    };

    if (
        !adminValidation.userDetailsAreValid(
            req.body.email,
            req.body.password,
            req.body.fullname,
        ) ||
        !adminValidation.emailIsConfirmed( req.body.email, req.body[ 'confirm-email' ] )
    )
    {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    'Please check your input. Password must be at least 6 character slong, postal code must be 5 characters long.',
                ...enteredData,
            },
            function ()
            {
                res.redirect( '/auth/signup-admin' );
            }
        );
        return;
    }

    const user = new Admin( req.body.email, req.body.password, req.body.fullname );

    try
    {
        const existsAlready = await user.existsAlready();

        if ( existsAlready )
        {
            sessionFlash.flashDataToSession(
                req,
                {
                    errorMessage: 'User exists already! Try logging in instead!',
                    ...enteredData,
                },
                function ()
                {
                    res.redirect( '/auth/signup-admin' );
                }
            );
            return;
        }

        await user.signup();
    } catch ( error )
    {
        next( error );
        return;
    }

    res.redirect( '/auth/login-admin' );
}

async function adminLogin ( req, res, next )
{
    const user = new Admin( req.body.email, req.body.password );
    let existingUser;
    try
    {
        existingUser = await user.getUserWithSameEmail();
    } catch ( error )
    {
        next( error );
        return;
    }

    const sessionErrorData = {
        errorMessage:
            'Invalid credentials - please double-check your email and password!',
        email: user.email,
        password: user.password,
    };

    if ( !existingUser )
    {
        sessionFlash.flashDataToSession( req, sessionErrorData, function ()
        {
            res.redirect( '/auth/login-admin' );
        } );
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(
        existingUser.password
    );

    if ( !passwordIsCorrect )
    {
        sessionFlash.flashDataToSession( req, sessionErrorData, function ()
        {
            res.redirect( '/auth/login-admin' );
        } );
        return;
    }

    authUtil.createUserSession( req, existingUser, function ()
    {
        res.redirect( '/admin/products' );
    } );
}

function getAdminLogin ( req, res )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            email: '',
            password: '',
        };
    }

    res.render( 'admin/auth/login', { inputData: sessionData } );
}

module.exports = {
    getAdminSignup: getAdminSignup,
    adminSignup: adminSignup,
    adminLogin: adminLogin,
    getAdminLogin: getAdminLogin
};
