import mongoose from 'mongoose';

const collection = 'messages';

const schema = new mongoose.Schema({        
    name: String,
    message: String 
});

const chatModel = mongoose.model(collection, schema);

export default chatModel;