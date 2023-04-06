const mongodb = require( 'mongodb' );

const db = require( '../data/database' );

class Product
{
    constructor ( productData )
    {
        this.title = productData.title;
        this.brand = productData.brand;
        this.category = productData.category;
        this.price = +productData.price;
        this.discount = +productData.discount;
        this.quantity = +productData.quantity;
        this.summary = productData.summary;
        this.description = productData.description;
        this.image = productData.image; // the name of the image file
        this.updateImageData();
        if ( productData._id )
        {
            this.id = productData._id.toString();
        }
    }

    static async findById ( productId )
    {
        let prodId;
        try
        {
            prodId = new mongodb.ObjectId( productId );
        } catch ( error )
        {
            error.code = 404;
            throw error;
        }

        const product = await db
            .getDb()
            .collection( 'products' )
            .findOne( { _id: prodId } );

        if ( !product )
        {
            const error = new Error( 'Could not find product with provided id.' );
            error.code = 404;
            throw error;
        }

        return new Product( product );
    }

    static async findAll ()
    {
        const products = await db.getDb().collection( 'products' ).find().toArray();

        return products.map( function ( productDocument )
        {
            return new Product( productDocument );
        } );
    }

    static async findMultiple ( ids )
    {
        const productIds = ids.map( function ( id )
        {
            return new mongodb.ObjectId( id );
        } );

        const products = await db
            .getDb()
            .collection( 'products' )
            .find( { _id: { $in: productIds } } )
            .toArray();

        return products.map( function ( productDocument )
        {
            return new Product( productDocument );
        } );
    }

    updateImageData ()
    {
        this.imagePath = `product-data/images/${ this.image }`;
        this.imageUrl = `/products/assets/images/${ this.image }`;
    }

    async save ()
    {
        const productData = {
            title: this.title,
            brand: this.brand,
            category: this.category,
            price: this.price,
            discount: this.discount,
            quantity: this.quantity,
            summary: this.summary,
            description: this.description,
            image: this.image,
        };

        if ( this.id )
        {
            const productId = new mongodb.ObjectId( this.id );

            if ( !this.image )
            {
                delete productData.image;
            }

            await db.getDb().collection( 'products' ).updateOne(
                { _id: productId },
                {
                    $set: productData,
                }
            );
        } else
        {
            await db.getDb().collection( 'products' ).insertOne( productData );
        }
    }

    static async paymentProcess ( quantity, productId )
    {
        let newQuantity;
        let prodId;

        try
        {
            prodId = new mongodb.ObjectId( productId );
        } catch ( error )
        {
            error.code = 404;
            throw error;
        }

        const product = await db
            .getDb()
            .collection( 'products' )
            .findOne( { _id: prodId } );

        if ( product.quantity >= quantity )
        {
            newQuantity = +product.quantity - quantity;

            await db
                .getDb()
                .collection( 'products' )
                .updateOne( { _id: prodId }, { $set: { quantity: newQuantity } } );
        } else
        {
            const error = new Error( 'Out of stock!' );
            error.code = 404;
            throw error;
        }

        return true;
    }

    replaceImage ( newImage )
    {
        this.image = newImage;
        this.updateImageData();
    }

    remove ()
    {
        const productId = new mongodb.ObjectId( this.id );
        return db.getDb().collection( 'products' ).deleteOne( { _id: productId } );
    }
}

module.exports = Product;
