import config from '../config/config.env.js';
import MongoSingleton from './mongo.dbclass.js';
import Products from "../services/products.dbclass.js"
import FsProducts from '../services/products.fsclass.js'; 


let factoryProduct 
    
    switch (config.PERSISTENCE) {
        case 'MONGO':
            MongoSingleton.getInstance();
            factoryProduct = Products;
            break;
            case 'MEMORY':
            MongoSingleton.getInstance();
            factoryProduct = FsProducts;
            break;
        default:
    } 



export default factoryProduct;