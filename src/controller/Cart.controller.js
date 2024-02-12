import CartManager from "../services/Cart.dbclass.js";
import TicketManager from "../services/tickets.dbclass.js";
import { __dirname } from "../utils.js";

const manager = new CartManager();
const ticket = new TicketManager();


export const productsInCart = manager.productsInCart

export const downloadTicket = ticket.downloadTicket

export const purchase = async (cid, res) => {
    await ticket.creatTicket(cid);     
    res.redirect(`/`)
    }

export const getTickets = ticket.ticketsInCart

export const getCartPopulated = async (req, res) => {
    try {
        const carts = await manager.getCartPopulated(req.params.id);
        res.status(200).send({ status: 'OK', data: carts });
    } catch (err) {
        res.status(500).send({ status: 'err', error: err.message });
    }
    }
  
export const addProductInCart = manager.addProductInCart

export const deleteCartProduct = async (cid, pid) => {
    try {        
        await manager.deleteCartProduct(cid, pid)

        if (manager.checkStatus() === 1) {
            console.log({ status: 'OK', msg: 'Producto quitado del carrito' });
        } else {
            console.log({ status: 'ERR', error: 'No se pudo quitar el producto en el carrito.' });
        }
    } catch (err) {
        console.log({ status: 'ERR', error: err.message });
    }
    };
 
export const emptyCart = async (cid, res) => {
    try {
        await manager.emptyCart(cid);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Carrito Vaciado' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo vaciar el carrito.' });
        }
    } catch (err) {
         res.status(500).send({ status: 'ERR', error: err.message });
    }
    };

export const updateCart = async (req, res) => {
    try {
        // tiene que pasarse un id y un body con el objeto del nuevo producto, verificar eso
        const product = req.body;
        await manager.updateCart(req.params.id, product);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto agregado al carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo agregar el producto al carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
    }

export const updateProductQty = async (req, res) => {
    try {
        await manager.updateProductQty(req.params.cid, req.params.pid, req.params.qty);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Cantidad de producto actualizada' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo actualizar cantidad de producto.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
    
    
    try {
        const updateProductQty = await manager.updateProductQty(req.params.cid, req.params.pid, req.body)
        res.status(200).send(updateProductQty)


    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err })
    }

    }
 
export const getCarts = async (req, res) => {
    const carts = manager.getCarts()
    res.status(200).send({status: "ok", payload: carts})
}