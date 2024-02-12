import Users from "../services/user.dbclass.js";
import userModel from "../model/user.model.js";
import cartModel from "../model/Cart.model.js";
import mongoose from "mongoose";
import { InactiveMail, __dirname, generateUser } from '../utils.js';
import cron from "node-cron"

const manager = new Users();
    
export const validate = async (req, res, next) => {
        if (req.session.userValidated) {
            next();
        } else {
            res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
        }
}

export const getUsers = async (req,res) => {
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;
    const name = userObjet.name
    const pass = userObjet.pass
    const existPass = pass === undefined ? false : true 
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false; 
    const isPremium = rol === "Premium" ? true : false;
    const isUsuario = rol === "Usuario" ? true : false;
    const avatar = userObjet.avatar  
    const users = await manager.getUsers()   
    const payload = [] 
    users.forEach(element => {
        const object = {name: element.name, mail: element.user, rol: element.rol[0].name}
        payload.push(object)
    });    
    res.status(200).render(`users`, {name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, isPremium: isPremium, isUsuario: isUsuario, user: payload, cart: cartExist, cartQty: cartElements});
}    
    
export const getUpdate = async (req, res) => {                  
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)    
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;  
    const name = userObjet.name
    const pass = userObjet.pass
    const existPass = pass === undefined ? false : true 
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false; 
    const isPremium = rol === "Premium" ? true : false;
    const isUsuario = rol === "Usuario" ? true : false;
    const avatar = userObjet.avatar                               
    res.render('updatepass', {
        name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, isPremium: isPremium, isUsuario: isUsuario, cart: cartExist, cartQty: cartElements});
}

export const getRol = async (req, res) => {                  
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)    
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;        
    const name = userObjet.name
    const pass = userObjet.pass
    const existPass = pass === undefined ? false : true 
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false;    
    const avatar = userObjet.avatar                               
    res.render('rol', {
        name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, cart: cartExist, cartQty: cartElements});
}

export const getPremium = async (req, res) => {                  
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)   
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;         
    const name = userObjet.name
    const user = userObjet.user
    const pass = userObjet.pass
    const uid = userObjet._id
    const existPass = pass === undefined ? false : true 
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false; 
    const isPremium = rol === "Premium" ? true : false;
    const isUsuario = rol === "Usuario" ? true : false;
    const avatar = userObjet.avatar                               
    res.render('premium', {
        name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, uid: uid, user: user, isPremium: isPremium, isUsuario: isUsuario, cart: cartExist, cartQty: cartElements});
}
    
export const getAvatarUpdate = async (req, res) => {                  
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)  
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;    
    const name = userObjet.name 
    const pass = userObjet.pass
    const existPass = pass === undefined ? false : true
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false; 
    const isPremium = rol === "Premium" ? true : false;
    const isUsuario = rol === "Usuario" ? true : false;
    const avatar = userObjet.avatar
    const uid = userObjet._id                           
    res.render('updateavatar', {
        name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, uid: uid, isPremium: isPremium, isUsuario: isUsuario, cart: cartExist, cartQty: cartElements});
}    
    
export const getEqual = async (req, res) => {
    res.render('mailequal')
}
    
export const getPassEqual = async (req, res) => {
    res.render('passequal')
}
    
export const getSuccess = async (req, res) => {
    res.render('success')
}
    
export const getRecovery = async (req, res) => {
    res.render('recovery')
}    
    
export const getUserById = async (req, res) => { 
    try {
        if (req.params.id != undefined) {
            const users = await manager.getUserById(req.params.id);
            res.status(200).send({ status: 'OK', data: users });
        } else {
            const user = await manager.getUserById(req.params.id);
            res.status(200).send({ status: 'OK', data: user });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: 'No se encuentra el usuario' });
    }
};

export const fakeUser = async (req, res) => {
    const users = [];
    for (let i= 0; i < 10; i++){users.push(generateUser())}
    res.send({status: "OK", payload: users })
}

export const getRegister = async (req, res) => {        
    res.render('registrar');
};   

export const getUserDelete = async (req, res) => {        
    res.render('userDelete');
};  

export const updateUser = async (uid, res) => {
    try {            
        await manager.updateUser(uid);
        
        if (manager.checkStatus() === 1) {
            console.log({ status: 'OK', msg: manager.showStatusMsg() });
            res.redirect(`/logout`)
        } else {
            res.send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        console.log({ status: 'ERR', error: err });
    }
};

export const deleteInactiveUser = async(req, res) => {      

        try {
            const users = await manager.getUsers()
            const date = new Date()      
           
            users.forEach(async (element) => {
                const last_connection = element.last_connection
                const last_connection_date = new Date(last_connection)
                const timeDifference = date - last_connection_date
                const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                if(daysDifference >= 1){      
                    const id = element._id    
                    const user = element.user      
                    await manager.deleteUser(id)
                    InactiveMail(user)                          
                }else {
                    console.log(`estos usuarios son activos ${element.name}`)
                }            
            });        
                
                    
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
     
};

export const deleteUser = async(req, res) => {      

    try { 
        const user = req.body.user
        const process = await userModel.findOne({user: user}) 
        console.log(process)
        const id = process._id         
        await manager.deleteUser(id)             
        if (manager.checkStatus() === 1) {
            res.redirect(`/userDelete`)
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
 
};

export const getUploadDocument = async(req, res) =>{
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)   
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;   
    const name = userObjet.name 
    const pass = userObjet.pass
    const existPass = pass === undefined ? false : true
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false; 
    const isPremium = rol === "Premium" ? true : false;
    const isUsuario = rol === "Usuario" ? true : false;
    const avatar = userObjet.avatar
    const uid = userObjet._id                           
    res.render('uploadDocuments', {
        name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, uid: uid, isPremium: isPremium, isUsuario: isUsuario, cart: cartExist, cartQty: cartElements});
    
}

export const getloadDocument = async(req, res) =>{
    const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)    
    const cid = req.session.user.cart[0]
    const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
    const cartElements = cart.products.length
    const cartExist = cartElements > 0 ? true : false;  
    const name = userObjet.name 
    const pass = userObjet.pass
    const existPass = pass === undefined ? false : true
    const rol = userObjet.rol[0].name        
    const isAdmin = rol === "Admin" ? true : false; 
    const isPremium = rol === "Premium" ? true : false;
    const isUsuario = rol === "Usuario" ? true : false;
    const avatar = userObjet.avatar
    const uid = userObjet._id                           
    res.render('loadDocuments', {
        name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, uid: uid, isPremium: isPremium, isUsuario: isUsuario, cart: cartExist, cartQty: cartElements});
    
}

export const updatePremium = manager.updatePremium

export const uploadDocuments = manager.uploadDocuments

export const uploadAvatar = manager.uploadAvatar

export const getMessages = manager.getMessages

export const getErrMessages = manager.getErrMessages

export const getRecoveryPass = manager.getPass   

export const addUser = manager.addUser

export const updateRol = manager.updateRol

export const passRecovery = manager.passRecovery

export const mailPassRecovery =  manager.updatePass  
