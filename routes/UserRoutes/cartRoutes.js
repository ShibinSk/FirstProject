const express=require('express');
const router =express.Router();

const cartCantroller=require('../../Cantroller/cartCantroller')


// =====================ADD TO CART================================================


router.get('/cart',cartCantroller.cartget)

router.get('/add-to-cart',cartCantroller.addcartget)

router.get('/remove-cart',cartCantroller.removeget)

router.post('/change-product-quantity',cartCantroller.quantitypost)

// ===============================place-order===============================================

router.get('/place-order',cartCantroller.placeorder)

router.post('/place-order',cartCantroller.placeorderpost)

router.get('/order-complate',cartCantroller.ordercomplate)

// ==========================================Orders=======================

router.get('/orders',cartCantroller.ordersget)




module.exports=router;