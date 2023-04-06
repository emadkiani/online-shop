const User = require( '../models/user.model' );

const authUtil = require( '../util/authentication' );
const validation = require( '../util/validation' );
const sessionFlash = require( '../util/session-flash' );

async function getUpdateProfile ( req, res, next )
{
    let sessionData = sessionFlash.getSessionData( req );

    if ( !sessionData )
    {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: '',
        };
    }

    try
    {
        const user = await User.findById( req.params.id );
        res.render( 'customer/profile/update-profile', {
            user: user,
            inputData: sessionData,
        } );
    } catch ( error )
    {
        return next( error );
    }
}

async function updateProfile ( req, res, next )
{
    let userPassword;

    if ( !req.body.password )
    {
        userPassword = 'password';
    } else
    {
        userPassword = req.body.password;
    }

    if (
        !validation.userDetailsAreValid(
            req.body.email,
            userPassword,
            req.body.fullname,
            req.body.street,
            req.body.postal,
            req.body.city
        )
    )
    {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    'Please check your input.',
            },
            function ()
            {
                res.redirect( `/profile/update-profile/${ req.params.id }` );
            }
        );
        return;
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    );

    try
    {
        await user.updateProfile( req.params.id );
    } catch ( error )
    {
        return next( error );
    }

    res.redirect( `/profile/update-profile/${ req.params.id }` );
}

function logout ( req, res )
{
    authUtil.destroyUserAuthSession( req );
    res.redirect( '/' );
}

module.exports = {
    logout: logout,
    updateProfile: updateProfile,
    getUpdateProfile: getUpdateProfile,
};
