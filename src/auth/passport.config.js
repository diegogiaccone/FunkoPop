import passport from "passport";
import {} from 'dotenv/config'
import GithubStrategy from 'passport-github2';
import userModel from '../model/user.model.js';
import rolModel from "../model/rol.model.js";
import cartModel from "../model/Cart.model.js";
import config from "../config/config.env.js";
import GoogleStrategy from "passport-google-oauth20"
import FacebookStrategy from "passport-facebook"
import ticketModel from "../model/ticket.model.js";


const initializePassport = () => {
    // Estrategia Github
    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackUrl: `${config.BASE_URL}/githubcallback`,  
    }, async (accessToken, refreshToken, profile, done) => {        
        try{
            let users = await userModel.findOne({user: profile._json.email})            
            if(!users){
                const rol = await rolModel.findOne({name: "Usuario"})
                const cart = await cartModel.create({
                    name: "cart",
                    products: []
                })
                const ticket = await ticketModel.create({
                    name: "ticket",
                    purchase: []
                })

                let newUser = {
                    name: profile._json.name,
                    user: profile._json.email, 
                    avatar: profile._json.avatar_url,                   
                    rol: rol,
                    cart: cart,
                    ticket: ticket
                }                               
                let result = await userModel.create(newUser)
                done(null, result)
            }else{
                done(null, users)
            }
        }catch (error){
            return done(error)
        }
    }));

    passport.use(`google`, new GoogleStrategy({
        clientID: config.GOOGLE_ID,
        clientSecret: config.GOOGLE_SECRET,
        callbackURL: `${config.BASE_URL}/auth/google/callback`,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        scope: ['openid', 'email', 'profile']
      },
      async(accessToken, refreshToken, profile, cb) => {        
        
        try{            
            let users = await userModel.findOne({ user: profile.emails[0].value })
            if(!users){
                const rol = await rolModel.findOne({name: "Usuario"})
                const cart = await cartModel.create({
                    name: "cart",
                    products: []
                })
                const ticket = await ticketModel.create({
                    name: "ticket",
                    purchase: []
                })
                let newUser = {
                    name: profile._json.given_name,
                    apellido: profile._json.family_name,
                    user: profile.emails[0].value, 
                    avatar: profile._json.picture,                   
                    rol: rol,
                    cart: cart,
                    ticket: ticket
                }    
                              
                let result = await userModel.create(newUser)
                cb(null, result)
            }else{
                cb(null, users)
            }}catch(err){
                cb(err)
            }
        }
    ))     

    passport.use('facebook', new FacebookStrategy({
        clientID: config.FACEBOOK_ID,
        clientSecret: config.FACEBOOK_SECRET,
        callbackURL: `${config.BASE_URL}/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name', 'photos' ] 
      },
      async(accessToken, refreshToken, profile, cb) => {      
        try{
            let users = await userModel.findOne({ user: profile.emails[0].value})                    
            if(!users){
                const rol = await rolModel.findOne({name: "Usuario"})
                const cart = await cartModel.create({
                    name: "cart",
                    products: []
                })
                const ticket = await ticketModel.create({
                    name: "ticket",
                    purchase: []
                })
                let newUser = {
                    name: profile.name.givenName,                    
                    user: profile.emails[0].value, 
                    avatar: config.AVATAR,                   
                    rol: rol,
                    cart: cart,
                    ticket: ticket
                }                               
                let result = await userModel.create(newUser)
                cb(null, result)
            }else{
                cb(null, users)
            }}catch(err){
                cb(err)
            }
        }
    ))     

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err.message);
        }
    });
}

export default initializePassport;