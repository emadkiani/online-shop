const addToCartButtonElements = document.querySelectorAll( '.add-to-cart' );
const cartBadgeElements = document.querySelectorAll( '.cart-number' );

for ( const addToCartButtonElement of addToCartButtonElements )
{
    addToCartButtonElement.addEventListener( 'click', async function ()
    {
        const productId = addToCartButtonElement.dataset.productid;
        const csrfToken = addToCartButtonElement.dataset.csrf;

        let response;
        try
        {
            response = await fetch( '/cart/items', {
                method: 'POST',
                body: JSON.stringify( {
                    productId: productId,
                    _csrf: csrfToken
                } ),
                headers: {
                    'Content-Type': 'application/json'
                }
            } );

        } catch ( error )
        {
            alert( 'Something went wrong!' );
            return;
        }

        if ( !response.ok )
        {
            alert( 'Something went wrong!' );
            return;
        }

        const responseData = await response.json();

        const newTotalQuantity = responseData.newTotalItems;

        for ( const cartBadgeElement of cartBadgeElements )
        {
            cartBadgeElement.textContent = newTotalQuantity;
        }
    } );
}
