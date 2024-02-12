import mongoose from 'mongoose';
import cartModel from '../model/Cart.model.js';
import productModel from '../model/products.model.js';
import userModel from '../model/user.model.js';
import ticketModel from '../model/ticket.model.js';
import { nanoid } from 'nanoid';
import puppeteer from 'puppeteer';
import { __dirname, pdf, getMail } from '../utils.js';
import config from '../config/config.env.js';



export default class TicketManager {
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

    getTickets = async () => {
        try {
            const carts = await ticketModel.find();                  
            this.status = 1;
            this.statusMsg = 'Carritos recuperados';
            return carts;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    }

    getTicketsById = async (req, res) => {        
        const cartById = await ticketModel.findOne(req.body);
        if(!cartById) return "Carrito no encontrado"
        return cartById
    }
 

    creatTicket = async (req, res, next) => {
        try {                                        
            const cid = req.body.cid 
            const tid = req.session.user.ticket[0]            
            const tickets = await ticketModel.findOne({ '_id': new mongoose.Types.ObjectId(tid)})
            if(!tickets) return "Ticket no encontrado"                                                                           
            const process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}).populate(`products.prods`)
            if(!process) return "Carrito no encontrado"                          
            let products = []                    
            if(process.products.length >= 1){           
                process.products.forEach(element => {                 
                    element.prods.forEach(async (e) => {
                        const itemUpdate = await productModel.findById({_id: e._id})                        
                        if(itemUpdate.stock >= element.quantity){                            
                            products.push({title: itemUpdate.title, quantity: element.quantity, description: itemUpdate.description, price: itemUpdate.price, total: itemUpdate.price * element.quantity}) 

                            await productModel.findOneAndUpdate(                            
                                { _id: e._id },
                                { $set: {stock: itemUpdate.stock - element.quantity}},
                                { new: true }
                                )                                
                            }else{                               
                                console.log("no se pudo realizar la compra devido a falta de stock en uno de tus productos")
                            }
                        })                       
                    });                   
                    const Total = process.products.reduce(function Total(accumulator, item){
                        const toNumber = parseFloat(item.prods[0].price * item.quantity);                                                         
                        return accumulator + toNumber;                             
                      },0);                       
                                            
                       const date = new Date()
                       const date2 = new Intl.DateTimeFormat('es', { dateStyle: 'full', timeStyle: 'long'}).format(date);
                       const name = req.session.user.name
                       const code = nanoid()                       
                       const browser = await puppeteer.launch({headless: 'new', 
                        ignoreDefaultArgs: ['--disable-extensions'],                        
                       executablePath: config.PUPPETEER});
                       const page = await browser.newPage();                       
                       const htmlContent = pdf(name, req.session.user.user, code, date2, products, Total)                      
                       await page.setContent(htmlContent)
                       await page.emulateMediaFeatures(`screen`);        
                       await page.pdf({
                        path: `src/public/tickets/${code}.pdf`,
                        format: `A4`,
                        printBackground: true
                       });                   
                       await browser.close();  
                       getMail(code, req.session.user.user)   
                       console.log(req.session.user)              
                    
                        setTimeout(async ()=>{
                            const newTicket = { 
                                tickets: products,                                                                             
                                code: code,
                                purchase_datetime: date2,
                                purchaser: req.session.user.user,                              
                                total: Total
                            }
                                                
                            tickets.purchase.push(newTicket)                            
                            await ticketModel.findOneAndUpdate({_id: tid},{$set: tickets},{ new: true })                               
                            this.emptyCart(cid);
                        },1500)                                                                      
                    }     
        
        } catch (error) {
            console.error("No se pudo generar el ticket" + error);           
        } 
    }

    ticketsInCart = async (req, res) => {
        
        try {           
                const ticketUser = await (req.session.user.ticket)                                                
                const process = await ticketModel.findOne({ '_id': new mongoose.Types.ObjectId(ticketUser[0])})                           
                const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`) 
                const cid = req.session.user.cart[0]
                const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}) 
                const cartElements = cart.products.length
                const cartExist = cartElements > 0 ? true : false;               
                const avatar= userObjet.avatar               
                const name = userObjet.name
                const pass = userObjet.pass
                const existPass = pass === undefined ? false : true
                const rol = userObjet.rol[0].name 
                const isAdmin = rol === "Admin" ? true : false  
                const isPremium = rol === "Premium" ? true : false;
                const isUsuario = rol === "Usuario" ? true : false;                                 
                                                    
                res.render(`tickets`, {
                    ticket: process.purchase,                                                       
                    name: name, 
                    rol: rol, 
                    cart: req.session.user.cart[0],                   
                    avatar: avatar,
                    pass: existPass,
                    isAdmin: isAdmin,
                    isPremium: isPremium,
                    isUsuario: isUsuario,
                    cart: cartExist, 
                    cartQty: cartElements 
                })
            } catch (err) {
                res.status(500).send({ status: 'ERR', error: err });            
        }}

    downloadTicket = async (req, res) => {
        const code = req.body.code        
        res.download(`${__dirname}/public/tickets/${code}.pdf`)
    }

    
    emptyCart = async (cid) => {
        try {
            const cid2 = await (cid)           
            const process = await cartModel.findOneAndUpdate( 
                { _id: cid2 },               
                { $set: { products: [] }});            
            this.status = 1;
            this.statusMsg = 'Carrito vaciado';
            return process;
        } catch (err) {
            return false;
        }
    }    
}
    


