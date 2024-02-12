import config from '../config/config.env.js';
import { generateToken } from '../auth/jwt.config.js'
import userModel from '../model/user.model.js';
   
export const login = async (req, res) => {  
    if (req.user === undefined) {                       
        res.render('login', { sessionInfo: req.session});
    } else {
        req.session.user = req.sessionStore.user = req.user                       
        req.session.userValidated = req.sessionStore.userValidated = true;     
        const date = new Date();
        //const user = await (req.user).populate(`rol`)       
        const token = generateToken({ user: req.user.user, name: req.user.name, apellido: req.user.apellido, rol: req.user.rol})   
        res.cookie('token', token, {
            maxAge: date.setDate(date.getDate() + 1),
            secure: false, // true para operar solo sobre HTTPS
            httpOnly: true
        }) 
        res.redirect(`/`)
    }
    };

export const logout = async (req, res) => {
    req.session.userValidated = req.sessionStore.userValidated = false;
    await userModel.updateOne({user:user}, {last_connection: new Date()})
    res.clearCookie('connect.sid',{domain:".localhost"});
    res.clearCookie('token', {domain: ".localhost"})
    req.session.destroy((err) => {
        req.sessionStore.destroy(req.sessionID, (err) => {
            if (err) console.log(`Error al destruir sesión (${err})`);
            console.log('Sesión destruída');
            res.redirect(`/`) 
        });
    })
    };


   
