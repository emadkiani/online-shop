const cartItemUpdateFormElements = document.querySelectorAll( '.cart-item-management' );
const cartTotalPriceElement = document.getElementById( 'cart-total-price' );
const cartBadgeElements = document.querySelectorAll( '.cart-number' );

async function updateCartItem ( event )
{
	event.preventDefault();

	const form = event.target;

	const productId = form.dataset.productid;
	const csrfToken = form.dataset.csrf;
	const quantity = document.getElementById( `quantity-${ productId }` ).value;

	let response;
	try
	{
		response = await fetch( '/cart/items', {
			method: 'PATCH',
			body: JSON.stringify( {
				productId: productId,
				quantity: quantity,
				_csrf: csrfToken,
			} ),
			headers: {
				'Content-Type': 'application/json',
			},
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

	if ( responseData.updatedCartData.updatedItemPrice === 0 )
	{
		document.getElementById( `cart-item-${ productId }` ).remove();
	} else
	{
		const cartItemTotalPriceElement = document.getElementById( `item-price-${ productId }` );
		cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed( 2 );
	}

	cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed( 2 );

	for ( const cartBadgeElement of cartBadgeElements )
	{
		cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
	}
}

for ( const formElement of cartItemUpdateFormElements )
{
	formElement.addEventListener( 'submit', updateCartItem );
}
