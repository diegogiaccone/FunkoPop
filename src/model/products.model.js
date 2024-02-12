import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null); // Importante! para no tener problemas con Mongoose

const collection = 'products';

const schema = new mongoose.Schema({
    title: String,  
    description: String,
    price: Number, 
    thumbnail: String,
    code: String,    
    stock: Number,
    owner: String, 
    category: {type: String, index: true}
}); 

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema);

export default productModel;