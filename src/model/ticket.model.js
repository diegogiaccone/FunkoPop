import mongoose , { Schema } from 'mongoose';

mongoose.pluralize(null);

const collection = 'tickets';

const schema = ({    
    purchase: {
        type: [
            {   
                tickets:{                    
                     type : Array , default : [] 
                },            
                code: String,             
                purchaser: String,
                purchase_datetime: String,
                amount: Number,               
                total: Number 
            }
       ],
       default: []
    }   
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;


