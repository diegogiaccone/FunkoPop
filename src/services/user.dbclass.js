import mongoose, { isValidObjectId } from 'mongoose';
import userModel from '../model/user.model.js';
import rolModel from '../model/rol.model.js';
import bcrypt from 'bcryptjs'
import { generateToken, authToken } from '../auth/jwt.config.js'
import cartModel from '../model/Cart.model.js';
import ticketModel from '../model/ticket.model.js';
import { recoverPass, generateTokenpass } from '../utils.js';


class Users {
    constructor() {
        this.users = [];
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['firstName', 'lastName', 'userName', 'password'];


    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg;
    }

    addUser = async (req, res) => {
        try{            
            const name = req.body.name
            const apellido = req.body.apellido
            const user = req.body.user
            const pass = req.body.pass           
            const avatar = req.body.avatar  
            const last_connection = new Date()              
            let passHash = await bcrypt.hash(pass, 8)
            const rol = await rolModel.findOne({name: "Usuario"})
            const cart = await cartModel.create({
                name: "cart",
                products: []
            })
            const ticket = await ticketModel.create({
                name: "ticket",
                purchase: []
            })
            const verify = await userModel.findOne({user: user})
            if(!name || !apellido || !user || !pass){
                res.send(`debe completar todos los campos`)
            }else{
                if(!verify){
                    userModel.create({name: name, apellido: apellido, user: user, pass: passHash, rol: rol, cart: cart, avatar: avatar, ticket: ticket, last_connection: last_connection})     
                    res.status(200).redirect('/')      
                }else{                 
                    res.send(`El usuario ya existe Por favor intente con otro nombre de usuario`)
                }
            }
        } catch (error) {
            console.log(error)
        }       
    }

    getUsers = async () => {
        try {
            const users = await userModel.find().populate(`rol`);            
            this.status = 1;
            this.statusMsg = 'Usuarios recuperados';
            return users;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUsers: ${err}`;
        }
    }

    getUserById = async (id) => {
        try {
            this.status = 1;
            const user = userModel.findById(id);
            return user;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUserById: ${err}`;
        }
    }

    updateUser = async (req, res) => {
        try {
            const user = req.session.user.user                       
            const userObjet = await userModel.findOne({user: user})
            const uid = userObjet._id            
            const userpass = userObjet.pass
            const bodypass = req.body.pass
            const newpass = req.body.newpass
            const newpass2 = req.body.newpass2
            const verify = await bcrypt.compareSync(bodypass, userpass)            
            if(verify == true && bodypass != newpass && newpass == newpass2){
                const passHash = await bcrypt.hash(newpass, 8)                
                const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {pass: passHash});                
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Contraseña actualizada";                
            }

        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateUser: ${err}`;
        }
    }

    getPass = async (req, res) => {
        const token = req.params.token        
        const userObjet = await userModel.findOne({token: token})        
        const user = userObjet.user
        const userToken = userObjet.token       
        res.render(`passrecovery`, {user: user, token: userToken})
    }

    passRecovery = async (req, res) => {
        try {            
            const user = req.body.user                 
            const userObjet = await userModel.findOne({user: user})
            const uid = userObjet._id   
            const userpass = userObjet.pass        
            const newpass = req.body.newpass
            const newpass2 = req.body.newpass2 
            const verify = await bcrypt.compareSync(newpass, userpass) 
            if(verify == true){
                res.redirect(`mailequal`)
            }else{
                if(newpass == newpass2){
                    const passHash = await bcrypt.hash(newpass, 8)                
                    await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {pass: passHash});                                           
                    res.redirect(`success`)
                }else{
                    res.redirect(`passequal`)
                }
            }                                 

        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateUser: ${err}`;
        }
    }

    updatePass = async (req, res) => {
        try{
            const user = req.body.user
            const userObjet = await userModel.findOne({user: user})
            if(userObjet != null) {
                const uid = userObjet._id             
                const token = generateTokenpass()                
                recoverPass(user, token)
                const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {token: token});
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Contraseña actualizada";    
                res.redirect(`messages`)                                    
            }else{
                res.redirect(`errmessages`)
            }            
        }catch(err){
            console.log(err)
        }
    }

    getMessages = async (req, res) => {
        res.render(`messages`)
    }

    getErrMessages = async (req, res) => {
        res.render(`errmessages`)
    }   

    updateRol = async (req, res) => {
        try {
            const user = req.body.user                       
            const userObjet = await userModel.findOne({user: user})
            if(userObjet){
                const uid = userObjet._id            
                const rol = req.body.rol                                           
                const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {rol: rol});                
                    this.status = 1;
                    process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Avatar actualizada";
                    res.redirect(`/`)
            }else{
                res.send("El Usuario ingresado no se encuentra en nuestra base de datos por favor verifique los datos e intentelo nuevamente")
            } 

        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateUser: ${err}`;
        }
    } 

    updatePremium = async (req, res) => {
        try {
            const user = req.body.user                       
            const userObjet = await userModel.findOne({user: user})
            const rolID = userObjet.rol[0]           
            const roles = await rolModel.findById({ '_id': new mongoose.Types.ObjectId(rolID)})
            if(roles.name === "Premium"){
                const uid = userObjet._id            
                const rol = req.body.rol                                           
                const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {rol: rol});                
                    this.status = 1;
                    process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Actualizado a Usuario";
                    res.redirect(`/`)
            }else{
                const documents = userObjet.documents                
                if(documents.length === 3){
                    const uid = userObjet._id            
                    const rol = req.body.rol                                           
                    const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {rol: rol});                
                    this.status = 1;
                    process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Actualizado a Premium";
                    res.redirect(`/`)
                }else{
                    res.redirect(`/loadDocuments`)
                }
            } 

        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateUser: ${err}`;
        }
    } 

    deleteUser = async (id) => {
        try {
            const process = await userModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id)});
            this.status = 1;
            process.deletedCount === 0 ? this.statusMsg = "El ID no existe": this.statusMsg = "Usuario borrado";
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteUser: ${err}`;
        }
    }

    uploadDocuments = async (req, res) => {
        try{
            const userId = req.params.uid;          
            const uploadedDocuments = req.files           
           
                const user = await userModel.findOneAndUpdate(
                    { _id: userId },
                    { $set: { documents: uploadedDocuments}},
                    { new: true }
                    );                             
                    if (!user) {
                        return res.status(404).json({ message: 'Usuario no encontrado' });
                    }                    
                    
                
                res.redirect(`/`)
        }catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Error al subir los documentos' });
          }        
    }

    uploadAvatar = async (req, res) => {
        try {            
            const userId = req.params.uid;
            const uploadedDocuments = req.file
            const avatar = req.body.avatar            
            if(avatar){
            const user = req.session.user.user                       
            const userObjet = await userModel.findOne({user: user})            
            const uid = userObjet._id            
            const avatar = req.body.avatar                                          
            const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(uid)}, {avatar: avatar});                
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Avatar actualizada";   
                res.redirect(`/`)        

        } else {
            const user = await userModel.findOneAndUpdate(
                { _id: userId },
                { $set: { documents: {name: uploadedDocuments.originalname, reference: uploadedDocuments.fieldname}, avatar: "/public/profiles/"+uploadedDocuments.originalname}},
                { new: true }
              );
        
              if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
              }      
              // Envía una respuesta adecuada
              res.redirect(`/`)
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al subir los documentos' });
          }
    }           
   
    validateUser = async (req, res, next) => {
        const { user, pass } = req.body; // Desestructuramos el req.body
        const findUser = await userModel.findOne({user:user}).populate(`rol`)       
        if (!findUser) {
            req.sessionStore.errorMessage = 'No se encuentra el usuario';
            res.redirect(`/`);           
        }else{
            const passHash = await bcrypt.compareSync(pass, findUser.pass)               
            if (passHash === false) {                
                    req.sessionStore.errorMessage = 'Clave incorrecta'; 
                    res.redirect(`/`);  
                } else{  
                    await userModel.updateOne({user:user}, {last_connection: new Date()})                           
                    req.session.userValidated = req.sessionStore.userValidated = true;
                    req.session.errorMessage = req.sessionStore.errorMessage = '';
                    req.session.user = req.sessionStore.user = {user: user, name: findUser.name, apellido: findUser.apellido, rol: findUser.rol, cart: findUser.cart, avatar: findUser.avatar, ticket: findUser.ticket};                    
                    const date = new Date();                                                  
                    const token = generateToken({ user: user, name : findUser.name, apellido: findUser.apellido, rol: findUser.rol, avatar: findUser.avatar})                           
                    res.cookie('token', token, {
                        maxAge: date.setDate(date.getDate() + 1),
                        secure: false, // true para operar solo sobre HTTPS
                        httpOnly: true
                    })                    
                    res.redirect(`/`) 
                }      
            }
        } 
    }        


export default Users;



