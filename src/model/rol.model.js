import mongoose from 'mongoose';

mongoose.pluralize(null); // Importante! para no tener problemas con Mongoose

const collection = 'rol';

const schema = new mongoose.Schema({        
    name: String, 
});

const rolModel = mongoose.model(collection, schema);

export default rolModel;