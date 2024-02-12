import fs from "fs";
import { nanoid } from "nanoid";

export default class fsProducts {          
    constructor (){
        this.path = `./src/config/products.json`;            
    }

    readProducts = async () => {
        let products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
    }

    writeProducts = async (products) => {
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }


    addProduct = async (products) => {
        let productOld = await this.readProducts();
        products.status = true         
        products.id = nanoid(5) 
        let productAll = [...productOld, products];
        await this.writeProducts(productAll) 
        return console.log(`producto agregado`)          
    }
    
    getProducts = async ()  => {
        return await this.readProducts();         
    }

    getProductsById = async (id) => {        
        let productById = await this.exist(id)
        if(!productById) return "Producto No encontrado"
        return productById
    }

    getProductsPaginated = async (offset, itemsPerPage, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage) => {
        try {
            const queryOptions = {
                offset: offset,
                limit: itemsPerPage, 
                page: 1,                    
                pagingCounter: offset + 1,         
                hasPrevPage : false,        
                hasNextPage : false,
                prevPage : 1,      
                nextPage : 2,            
                lean: true // habilitamos esta opción para evitar problemas con Handlebars
            }           
            const getProd = await this.getProducts()
            const totalDocs = getProd.length 
            const totalPages = Math.ceil(totalDocs/itemsPerPage)                                   
            const products = await getProd.slice(offset, itemsPerPage + offset)
            const pagination = {docs: products, totalDocs: totalDocs, offset: queryOptions.offset, limit: queryOptions.itemsPerPage, lean:true, totalPages: totalPages , page: queryOptions.page, pagingCounter: queryOptions.pagingCounter, hasPrevPage: queryOptions.hasPrevPage, hasNextPage: queryOptions.hasNextPage, prevPage: queryOptions.prevPage, nextPage: queryOptions.nextPage}                    
            
            this.status = 1;
            this.statusMsg = 'Productos recuperados';
            return pagination;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }
    }

    
    deleteProduct = async (id) => {
        let products = await this.readProducts();
        let existProducts = products.filter(prod => prod.id === id)
        if(existProducts) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "producto eliminado"
        }
        return "el producto no existe"        
    }

             
    updateProduct = async (id, products) => {
        let productById = await this.exist(id);
        if(!productById) return "Not found product"
        await this.deleteProduct(id);
        let productOld = await this.readProducts();
        let actualizacion = [{...products, id : id}, ...productOld
        ];
        await this.writeProducts(actualizacion);
        return "Producto Actualizado"
    }

}