const updateOrderFormElements = document.querySelectorAll( '.order-form' );

async function updateOrder ( event )
{
    event.preventDefault();
    const form = event.target;

    const orderid = form.dataset.orderid;

    const orderStatusElement = document.getElementById( `order-status-${ orderid }` );

    const formData = new FormData( form );
    const newStatus = formData.get( 'status' );
    const orderId = formData.get( 'orderid' );
    const csrfToken = formData.get( '_csrf' );

    let response;

    try
    {
        response = await fetch( `/admin/orders/${ orderId }`, {
            method: 'PATCH',
            body: JSON.stringify( {
                newStatus: newStatus,
                _csrf: csrfToken,
            } ),
            headers: {
                'Content-Type': 'application/json',
            },
        } );
    } catch ( error )
    {
        alert( 'Something went wrong - could not update order status.' );
        return;
    }

    if ( !response.ok )
    {
        alert( 'Something went wrong - could not update order status.' );
        return;
    }

    const responseData = await response.json();

    orderStatusElement.classList.remove( 'cancelled' );
    orderStatusElement.classList.remove( 'pending' );
    orderStatusElement.classList.remove( 'fulfilled' );
    orderStatusElement.classList.add( responseData.newStatus );

    orderStatusElement.textContent = responseData.newStatus.toUpperCase();
}

for ( const updateOrderFormElement of updateOrderFormElements )
{
    updateOrderFormElement.addEventListener( 'submit', updateOrder );
}
