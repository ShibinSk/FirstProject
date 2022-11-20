









// exports.paymentVerification= async(req,res)=>{
    
// try {
//     const details= req.body
//     console.log(req.body);
//     console.log('heyyyyyyyyyyyy');



//     const crypto=require('crypto');
//     let hmac=crypto.createHmac('sh256','r7g6b2ScrJedg3CddhpF3v9x')

//     hmac.update(
//         details["payment[razorpay_order_id]"] +
//           "|" +
//           details["payment[razorpay_payment_id]"]
//       );
//       hmac=hmac.digest('hex')

//       if(hmac==details['payment[razorpay_signature]']){
//         const result = await db
//         .get()
//         .collection(collection.ORDER_COLLECTION)
//         .updateOne(
//           { _id: ObjectId(objId) },
//           {
//             $set: {status: "Confirmed" },
//           }
//         );
//         res.json({ status: true });

//       }else{
//         console.log("payment failed");
//         res.json({ status: false });
//       }


    
// } catch (err) {
//     console.log(err);
    
// }


// }
