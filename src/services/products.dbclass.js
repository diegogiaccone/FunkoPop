import mongoose from 'mongoose';
import productModel from '../model/products.model.js';
import rolModel from '../model/rol.model.js';
import { deleteProdMail } from '../utils.js';
import userModel from '../model/user.model.js';


export default class Products {
    constructor() {     
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['description', 'price', 'stock'];

    static #verifyRequiredFields = (obj) => {
        return Products.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }

    static #objEmpty (obj) {
        return Object.keys(obj).length === 0;
    }

    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg;
    }

    readProducts = async () => {
        const carts = await productModel.find();
        return carts;
    }

    exist = async (id) => {
        let carts = await this.readProducts(id);
        return carts.find(cart => cart.id === id)
    }


    addProduct = async (product) => {
        try {
            if (!Products.#objEmpty(product) && Products.#verifyRequiredFields(product)) {                
                const newprod = await productModel.create(product);                       
                this.status = 1;
                this.statusMsg = "Producto registrado en bbdd";
                return newprod      
            } else {
                this.status = -1;
                this.statusMsg = `Faltan campos obligatorios (${Products.requiredFields.join(', ')})`;
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `AddProduct: ${err}`;
        }
    }


    getProducts = async () => {
        try {
            const products = await productModel.find()
            this.status = 1;
            this.statusMsg = 'Productos recuperados';
            return products;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }
    }

    getProductById = async (id) => {
        try {
            this.status = 1;
            const products = productModel.findById(id)
            return products;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProductById: ${err}`;
        }
    }

    getProductsPaginated = async (offset, itemsPerPage, req) => {
        try {
            const queryOptions = {
                offset: offset,
                limit: itemsPerPage,
                lean: true // habilitamos esta opción para evitar problemas con Handlebars
            }
            
            const filter = undefined                         
             if(filter == undefined){
                const products = await productModel.paginate({}, queryOptions);
                this.status = 1;
                this.statusMsg = 'Productos recuperados';                
                return products
            }else{
                const products = await productModel.paginate({category: filter}, queryOptions);
                this.status = 1;
                this.statusMsg = 'Productos recuperados';
                return products
            }            
           
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }
    }

    updateProduct = async (req, res) => {
        try {
                const pid = req.params.pid 
                const product = await productModel.findOne({ '_id': new mongoose.Types.ObjectId(pid)});
                const user = req.session.user              
                const data = req.body                
                if(user.rol[0].name === "Admin" || user.rol[0].name === "Premium"){
                    if(user.rol[0].name === "Admin"){
                        await productModel.updateOne({ '_id': new mongoose.Types.ObjectId(pid) }, data);
                        res.redirect(`products_index`)
                    }else{
                        if(user.rol[0].name === "Premium" && product.owner == user.user){
                            await productModel.updateOne({ '_id': new mongoose.Types.ObjectId(pid) }, data);
                            res.redirect(`products_index`)
                        }else{
                            res.redirect(`errorOwner`)
                        }                   
                    }    
                }else{
                    res.redirect("errorOwner")
                }                      
            }            
        catch (err) {
            this.status = -1;
            this.statusMsg = `updateProduct: ${err}`;
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const id = req.body            
            const product = await productModel.findOne({ '_id': new mongoose.Types.ObjectId(id.id)});            
            const user = req.session.user
            const rol = await rolModel.findOne({ '_id': new mongoose.Types.ObjectId(user.rol[0]._id)});                    
            const owner = product.owner
            const userOwner = await userModel.findOne({user: owner})
            const ownerRol = await rolModel.findOne({ '_id': new mongoose.Types.ObjectId(userOwner.rol[0])})
            if(rol.name === "Admin" || rol.name === "Premium"){
                if(rol.name === "Admin"){
                    const deleteProd = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id.id)});
                    if(ownerRol.name === "Premium"){
                        deleteProdMail(owner, user.name)
                    }
                    res.redirect(`products_index`)
                    return deleteProd
                }else{
                    if(rol.name === "Premium" && owner === user.user){
                        const deleteProd = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id.id)});
                        res.redirect(`products_index`)
                        return deleteProd
                    }else{
                        res.redirect(`errorOwner`)
                    }                   
                }    
            }else{
                res.redirect(`errorOwner`)
            }                                                    
        } catch (err) {
            console.log(err)
        }        
    }

    getErrOwner = async (req, res) => {
        res.render(`errorOwner`)
    }

    getErrAddOwner = async (req, res) => {
        res.render(`errAddOwner`)
    }
}

