const deleteProductButtonElements = document.querySelectorAll( '.delete-btn' );

async function deleteProduct ( event )
{
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;

    const response = await fetch( '/admin/products/' + productId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    } );

    if ( !response.ok )
    {
        alert( 'Something went wrong!' );
        return;
    }

    document.getElementById( `product-cart-${ productId }` ).remove();
}

for ( const deleteProductButtonElement of deleteProductButtonElements )
{
    deleteProductButtonElement.addEventListener( 'click', deleteProduct );
}