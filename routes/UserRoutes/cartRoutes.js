const express=require('express');
const router =express.Router();

const cartCantroller=require('../../Cantroller/cartCantroller')
//middlewear

const userMiddlewere=require('../../Middleweres/userMiddlewere')
router.use(function (req, res, next) {
    if (req.query._method == 'DELETE') {
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
});

router.use((req, res, next) => {
    if (req.query._method == 'PUT') {
        req.method = 'PUT';
        req.url = req.path;
    }
    next();
})

// =====================ADD TO CART================================================


router.get('/cart',userMiddlewere.isLogout,cartCantroller.cartget)

router.get('/add-to-cart',userMiddlewere.isLogout,cartCantroller.addcartget)

router.delete('/remove-cart',userMiddlewere.isLogout,cartCantroller.removeget)

router.put('/change-product-quantity',userMiddlewere.isLogout,cartCantroller.quantitypost)

// ===============================place-order===============================================

router.get('/place-order',userMiddlewere.isLogout,cartCantroller.placeorder)

router.post('/place-order',userMiddlewere.isLogout,cartCantroller.placeorderpost)

router.get('/order-complate',userMiddlewere.isLogout,cartCantroller.ordercomplate)

// ==========================================Orders=======================

router.get('/orders',userMiddlewere.isLogout,cartCantroller.ordersget)

router.get('/history',userMiddlewere.isLogout,cartCantroller.gethisroy)

// =========================verifypayment======================================

router.post('/verify-payment',userMiddlewere.isLogout,cartCantroller.paymentVerification)

// ==========================PaypalSuccess=============================

router.get('/success',userMiddlewere.isLogout,cartCantroller.paypalsuccess)


// router.get('/pick-address/:id',cartCantroller.picupAddress)

router.post('/addNewaddress',userMiddlewere.isLogout,cartCantroller.addaddress)


// router.post('/orderStatusChange',cartCantroller.statuspost)

// ==========coupon apply =================================

router.post('/apply-coupon',userMiddlewere.isLogout,cartCantroller.applycoupon)




// ==============return-product =======================

router.get('/return-product',userMiddlewere.isLogout,cartCantroller.getreturnproduct)

router.get('/return-conform',userMiddlewere.isLogout,cartCantroller.getconform)
module.exports=router;