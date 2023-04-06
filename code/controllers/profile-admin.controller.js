const Admin = require( '../models/admin.model' );

const authUtil = require( '../util/authentication' );
const validation = require( '../util/adminValidation' );
const sessionFlash = require( '../util/session-flash' );

async function getUpdateAdmin ( req, res )
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
        const admin = await Admin.findById( req.params.id );
        return res.render( 'admin/profile/update-admin', {
            admin: admin,
            inputData: sessionData,
        } );
    } catch ( error )
    {
        return next( error );
    }
}

async function updateAdmin ( req, res, next )
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
            req.body.fullname
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
                res.redirect( `/admin/update-admin/${ req.params.id }` );
            }
        );
        return;
    }

    const user = new Admin(
        req.body.email,
        req.body.password,
        req.body.fullname
    );

    try
    {
        await user.updateAdmin( req.params.id );
    } catch ( error )
    {
        return next( error );
    }

    res.redirect( `/admin/update-admin/${ req.params.id }` );
}

function logout ( req, res )
{
    authUtil.destroyUserAuthSession( req );
    res.redirect( '/' );
}

module.exports = {
    logout: logout,
    updateAdmin: updateAdmin,
    getUpdateAdmin: getUpdateAdmin,
};
