import userModel from '../model/user.model.js';
import rolModel from '../model/rol.model.js';

class Rol {
    constructor() {       
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    isAdmin = async (req, res, next) => {        
        const userAd = await userModel.findOne({user: req.session.user.user}).populate(`rol`)              
        const rol = await rolModel.find({_id: {$in: userAd.rol}})       
        for (let i = 0; i < rol.length; i++) {
            if(rol[i].name === "Admin"){
                next()
            }else{
                return res.status(403).json({message: "Necesita ser Admin para ejecutar esta acción"})
            }            
        }
    }

    isPremium = async (req, res, next) => {        
        const userAd = await userModel.findOne({user: req.session.user.user}).populate(`rol`)              
        const rol = await rolModel.find({_id: {$in: userAd.rol}})       
        for (let i = 0; i < rol.length; i++) {
            if(rol[i].name === "Premium"){
                next()
            }else{
                return res.status(403).json({message: "Necesita ser Admin para ejecutar esta acción"})
            }            
        }
    }

    isUser = async (req, res, next) => {        
        const userAd = await userModel.findOne({user: req.session.user.user}).populate(`rol`)              
        const rol = await rolModel.find({_id: {$in: userAd.rol}})       
        for (let i = 0; i < rol.length; i++) {
            if(rol[i].name === "Usuario"){
                next()
            }else{
                return res.status(403).json({message: "Necesita ser Admin para ejecutar esta acción"})
            }            
        }
    }
}

export default Rol;
