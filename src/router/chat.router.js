import express from 'express'

const chatRouter = express.Router()


const chatRoutes = (io) => {   

chatRouter.get('/', async (req, res) => {
    res.render(`chat`, {
        
    })
});



return chatRouter;
}

export default chatRoutes