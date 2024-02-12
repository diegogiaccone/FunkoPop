import mongoose, { Schema } from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({        
    name: String,
    apellido: String,
    user: {type: String, unique: true},
    pass: String,
    avatar: String,
    token: String,
    last_connection: String, 
    rol: [{
        ref:"rol",
        type: Schema.Types.ObjectId
    }],
    cart: [{
        ref:"carts",
        type: Schema.Types.ObjectId
    }],
    ticket: [{
        ref:"tickets",
        type: Schema.Types.ObjectId
    }],
    documents: [{   
        name: String,
        reference: String       
    }]
});

const userModel = mongoose.model(collection, schema);

export default userModel;