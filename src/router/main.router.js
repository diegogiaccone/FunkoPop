import { Router } from "express";
import { getProductsPaginated, login, logout } from "../controller/main.controller.js";
import { validate } from "../controller/user.controller.js";
import { authentication } from "../auth/passport.jwt.js";


const mainRoutes = (io) => {
    const router = Router();
   
    router.get('/', getProductsPaginated, [validate, authentication('jwtAuth')] );

    router.post(`/`, getProductsPaginated, [validate, authentication('jwtAuth')])
    
    router.get('/logout', logout);    

    router.post('/login', login); 

    return router;
}

export default mainRoutes;