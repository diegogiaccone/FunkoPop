import { Router } from "express";
import { createOrder } from "../controller/payment.controller.js";
import { validate } from "../controller/user.controller.js";
import { authentication } from "../auth/passport.jwt.js";

const paymentRouter = Router();

const paymentRoutes = (io) => {

    paymentRouter.get('/creatOrder', createOrder, [validate, authentication('jwtAuth')]);

    paymentRouter.get('/carts/all', createOrder, [validate, authentication('jwtAuth')]);

    paymentRouter.get('/carts/:id', createOrder, [validate, authentication('jwtAuth')])
   
    paymentRouter.post('/carts/:cid/purchase',createOrder , [validate, authentication('jwtAuth')])
   
    paymentRouter.post('/carts/:cid/products/:pid',createOrder , [validate, authentication('jwtAuth')])

    paymentRouter.delete('/carts/:cid/products/:pid', createOrder, [validate, authentication('jwtAuth')]);
 
    paymentRouter.delete('/carts/:cid',createOrder , [validate, authentication('jwtAuth')]);

    paymentRouter.put('/carts/:id',createOrder , [validate, authentication('jwtAuth')])

    paymentRouter.put('/carts/:cid/products/:pid/:qty',createOrder , [validate, authentication('jwtAuth')])

return paymentRouter

}

export default paymentRoutes