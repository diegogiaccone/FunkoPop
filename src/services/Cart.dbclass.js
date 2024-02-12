import mongoose from 'mongoose';
import cartModel from '../model/Cart.model.js';
import productModel from '../model/products.model.js';
import userModel from '../model/user.model.js';

export default class CartManager {
    static id = 0
    constructor(){       
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg;
    }

    readCarts = async () => {
        const carts = await cartModel.find();
        return carts;
    }

    writeCarts = async (cart) => {
        await cartModel.create(cart);
    }

    exist = async (id) => {
        let carts = await this.readCarts(id);
        return carts.find(cart => cart.id === id)
    }

    createCart = async (req,res) => {
        let newCart = await cartModel.create(req.body)       
        return console.log(newCart)
    }

    getCarts = async () => {
        try {
            const carts = await cartModel.find();                  
            this.status = 1;
            this.statusMsg = 'Carritos recuperados';
            return carts;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    }

    getCartsById = async (req, res) => {        
        const cartById = await cartModel.findOne(req.body);
        if(!cartById) return "Carrito no encontrado"
        return cartById 
    }  

    addProductInCart = async (req, res) => {
        try {                                        
            const cid = req.session.user.cart[0]                           
            const pid = req.body    
            const user = req.session.user                                                                                  
            const process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)})                                 
            if(!process) return "Carrito no encontrado"            
            const product = await productModel.findOne({'_id': new mongoose.Types.ObjectId(pid)});                                   
            if(!product) return "Producto no encontrado"
            const validarProd = process.products.find(prod => prod.prods[0]._id == pid.id)
            if(product.owner != user.user){
                if (validarProd) {
                    validarProd.quantity +=1               
                }else{                
                    process.products.push({prods: product})                                        
                }                     
                const result = await cartModel.findOneAndUpdate(
                    { _id: cid,},
                    { $set: process},
                    { new: true }
                )                
                res.redirect(`/api/carts`)            
            }else{
                res.redirect(`/api/errAddOwner`)
            }                         
        
        } catch (error) {
            console.error("No se pudo agregar producto al carrito " + error);
            res.status(500).send({error: "No se pudo agregar producto al carrito", message: error});
        } 
    }

    productsInCart = async (req, res) => {
        try {           
                let cartUser = await (req.session.user.cart[0])                                          
                let process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartUser)}).populate(`products.prods`)                                                  
                let products = process.products                                         
                const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`) 
                const avatar= userObjet.avatar               
                const name = userObjet.name
                const pass = userObjet.pass
                const existPass = pass === undefined ? false : true
                const rol = userObjet.rol[0].name  
                const isAdmin = rol === "Admin" ? true : false
                const isPremium = rol === "Premium" ? true : false;
                const isUsuario = rol === "Usuario" ? true : false;
                const Total = products.reduce(function Total(accumulator, item){
                    const toNumber = parseFloat(item.prods[0].price * item.quantity);                                                         
                    return accumulator + toNumber;                             
                  },0);                         
                                                     
                res.render(`carrito`, {
                    products: products,
                    quantity: products.quantity,                                     
                    name:name, 
                    rol: rol, 
                    cart: cartUser,  
                    total: Total,
                    avatar: avatar,
                    pass: existPass,
                    isAdmin: isAdmin,
                    isPremium: isPremium,
                    isUsuario: isUsuario                   
                })
            } catch (err) {
                res.status(500).send({ status: 'ERR', error: err });            
        }}
    

    updateProductQty = async (id, pid, new_product_quantity) => {
        try {
            const carts = await cartModel.findOneAndUpdate(
                { _id: id, 'products.pid': pid },
                { $set: { 'products.$.qty': new_product_quantity }},
                { new: true }
            );

            this.status = 1;
            this.statusMsg = 'Cantidad de producto actualizada en carrito';
            return process;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateProductQty: ${err}`;
        }
    }

    updateCart = async (id, new_product) => {
        try {
            const cart_updated = await cartModel.findOneAndUpdate(
                { _id: id },
                { $push: { products: new_product }},
                { new: true }
            );
            
            this.status = 1;
            this.statusMsg = 'Carrito actualizado';
            return cart_updated;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateCart: ${err}`;
        }
    }

    getCartPopulated = async (id) => {
        try {
            // Se realiza el populate del array products en el carrito, en base al productModel
            // Atención, recordar importar el productModel arriba!
            const cart = await cartModel.find({ _id: new mongoose.Types.ObjectId(id) }).populate({ path: 'products.prods', model: productModel });
            // Alternativamente se puede mantener acá la consulta base y utilizar el middleware pre en el archivo carts.model.js
            // const cart = await cartModel.find({ _id: new mongoose.Types.ObjectId(id) });
            this.status = 1;
            this.statusMsg = 'Carrito recuperado';
            return cart;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    }

    emptyCart = async (req, res) => {
        try {
            const cid = await (req.session.user.cart[0])
            const process = await cartModel.findOneAndUpdate(
                new mongoose.Types.ObjectId(cid),
                { $set: { products: [] }
            });
            // Agregar lógica para verificar process y chequear si realmente hubo rows afectados
            this.status = 1;
            this.statusMsg = 'Carrito vaciado';
            return process;
        } catch (err) {
            return false;
        }
    }
    
    deleteCartProduct = async (req, res) => {   
        try {                       
            const cid = await (req.session.user.cart[0]) 
            const pid = req.body                    
            const process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)})           
            if(!process) return "Carrito no encontrado"          
            const validarProd = process.products.find(prod => prod.prods[0]._id == pid.id)                                   
            if (validarProd) {
                const result = await cartModel.findOneAndUpdate(
                    { _id: cid,},
                    { $pull: { products: { prods: new mongoose.Types.ObjectId(pid.id)}}},
                    { new: true }
                )           
                console.log(result)               
            }else{               
                console.log(process)                        
            }                
            
            res.redirect(`/api/carts`)           
            //res.send(this.statusMsg = 'Producto quitado del carrito')                        
            this.status = 1;
            this.statusMsg = 'Producto quitado del carrito';
            return process;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteCartProduct: ${err}`;
        }
    } 
    
}
    


