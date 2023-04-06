const bcrypt = require( 'bcryptjs' );
const mongodb = require( 'mongodb' );

const db = require( '../data/database' );

class Admin
{
    constructor ( email, password, fullname )
    {
        this.email = email;
        this.password = password;
        this.name = fullname;
    }

    static findById ( userId )
    {
        const uid = new mongodb.ObjectId( userId );

        return db
            .getDb()
            .collection( 'admin' )
            .findOne( { _id: uid }, { projection: { password: 0 } } );
    }

    getUserWithSameEmail ()
    {
        return db.getDb().collection( 'admin' ).findOne( { email: this.email } );
    }

    async existsAlready ()
    {
        const existingUser = await this.getUserWithSameEmail();
        if ( existingUser )
        {
            return true;
        }
        return false;
    }

    async signup ()
    {
        const hashedPassword = await bcrypt.hash( this.password, 12 );

        await db.getDb().collection( 'admin' ).insertOne( {
            email: this.email,
            password: hashedPassword,
            name: this.name,
            isAdmin: true,
        } );
    }

    async updateAdmin ( userId )
    {
        const hashedPassword = await bcrypt.hash( this.password, 12 );

        const user = {
            email: this.email,
            password: hashedPassword,
            name: this.name
        };

        if ( this.password === '' )
        {
            delete user.password;
        }

        const uid = new mongodb.ObjectId( userId );

        try
        {
            await db
                .getDb()
                .collection( 'admin' )
                .updateOne( { _id: uid }, { $set: user } );
        } catch ( err )
        {
            err.code = 404;
            throw err;
        }
    }

    hasMatchingPassword ( hashedPassword )
    {
        return bcrypt.compare( this.password, hashedPassword );
    }
}

module.exports = Admin;
