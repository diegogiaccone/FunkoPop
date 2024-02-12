import { Router } from "express";
import { addProductInCart, deleteCartProduct, emptyCart, getCartPopulated, getCarts, productsInCart, purchase, updateCart, updateProductQty } from "../controller/Cart.controller.js";
import { validate } from "../controller/user.controller.js";
import { authentication } from "../auth/passport.jwt.js";

const CartRouter = Router();

const cartRoutes = (io) => {

    CartRouter.get('/carts', productsInCart, [validate, authentication('jwtAuth')]);

    CartRouter.get('/carts/all', getCarts, [validate, authentication('jwtAuth')]);

    CartRouter.get('/carts/:id', getCartPopulated, [validate, authentication('jwtAuth')])
   
    CartRouter.post('/carts/:cid/purchase', purchase, [validate, authentication('jwtAuth')])
   
    CartRouter.post('/carts/:cid/products/:pid', addProductInCart, [validate, authentication('jwtAuth')])

    CartRouter.delete('/carts/:cid/products/:pid', deleteCartProduct, [validate, authentication('jwtAuth')]);
 
    CartRouter.delete('/carts/:cid', emptyCart, [validate, authentication('jwtAuth')]);

    CartRouter.put('/carts/:id', updateCart, [validate, authentication('jwtAuth')])

    CartRouter.put('/carts/:cid/products/:pid/:qty', updateProductQty, [validate, authentication('jwtAuth')])

return CartRouter

}

export default cartRoutes