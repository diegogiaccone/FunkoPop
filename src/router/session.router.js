import { Router } from "express";
import passport from "passport";
import initializePassport from "../auth/passport.config.js";
import { authentication } from "../auth/passport.jwt.js";
import { login, logout } from "../controller/session.controller.js";

initializePassport();

const sessionRoutes = () => {    
    const router = Router();   

    router.get('/github', passport.authenticate('github', { scope: ['user:email']}))

    router.get('/githubcallback',passport.authenticate('github', { scope: ['user:email']}), login);   

    router.get('/google', passport.authenticate('google', {  scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]}))

    router.get('/auth/google/callback',passport.authenticate('google', {  scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]}), login);     

    router.get('/facebook', passport.authenticate('facebook', { scope : ['email']}))

    router.get('/auth/facebook/callback',passport.authenticate('facebook', { scope : ['email']}), login);   

    router.get('/logout', logout);    
   
    return router;
}

export default sessionRoutes;