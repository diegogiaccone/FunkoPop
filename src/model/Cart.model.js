import mongoose from 'mongoose';

mongoose.pluralize(null); // Importante! para no tener problemas con Mongoose

const collection = 'carts';

const schema = ({    
    products: {
        type: [
            {
                prods:[{
                    ref: 'products',
                    type: mongoose.Schema.Types.ObjectId
                }],
                quantity: {
                type: Number,
                default: 1
                }
            }
        ],
        default: []
    }
});

const cartModel = mongoose.model(collection, schema);

export default cartModel;