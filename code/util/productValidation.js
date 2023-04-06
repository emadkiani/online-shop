function NotNumber ( value )
{
    return isNaN( value );
}

function isEmpty ( value )
{
    return !value || value.trim() === '';
}

function productDetailsAreValid ( title, brand, category, summary, description, price, discount, quantity )
{
    return (
        !isEmpty( title ) &&
        !isEmpty( brand ) &&
        !isEmpty( category ) &&
        !isEmpty( summary ) &&
        !isEmpty( description ) &&
        !NotNumber( price ) &&
        !NotNumber( discount ) &&
        !NotNumber( quantity )
    );
}

module.exports = {
    productDetailsAreValid: productDetailsAreValid
};
