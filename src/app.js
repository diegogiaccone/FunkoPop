import express from 'express';
import MongoSingleton from './services/mongo.dbclass.js';
import productRoutes from './router/products.router.js';
import UserRoutes from './router/user.router.js';
import { __dirname, swaggerOptions} from './utils.js';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';
import cartRoutes from './router/Cart.router.js';
import chatRoutes from './router/chat.router.js';
import chatModel from './model/chat.model.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mainRoutes from './router/main.router.js';
import createRol from './services/rol.dbclass.js';
import passport from 'passport';
import initializePassport from './auth/passport.config.js'
import sessionRoutes from './router/session.router.js'
import { initPassport } from './auth/passport.jwt.js';
import methodOverride from 'method-override';
import config from './config/config.env.js';
import ticketRoutes from './router/ticket.router.js';
import { addLogger } from './services/logger.services.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import multer from 'multer';
import path from "path"
import cron from 'node-cron';
import fetch from 'node-fetch';
import cors from "cors"
import paymentRoutes from './router/payment.router.js';

// Programa la tarea cron para que se ejecute cada 1 minuto


const PORT = config.PORT;
const MONGOOSE_URL = config.MONGOOSE_URL;
const SECRET = config.SECRET;
const BASE_URL = config.BASE_URL;
const PRODUCTS_PER_PAGE = config.PRODUCTS_PER_PAGE;
const wspuerto = config.WSPORT;
export const store = MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl: 3600});
const specs = swaggerJsdoc(swaggerOptions);


// Configuración de Multer para guardar archivos en la carpeta 'public'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'avatarFile') {
            cb(null, path.join(__dirname, 'public/profiles'));
        } else if (file.fieldname === 'thumbnailFile') {
            cb(null, path.join(__dirname, 'public/products'));
        } else if (file.fieldname === 'documents') {
            cb(null, path.join(__dirname, 'public/documents'));            
        } else {
            cb(new Error('Tipo de archivo no válido'), null);
        }
    }, 
    
    filename: function (req, file, cb) {        
      cb(null,file.originalname);
    }
  });
  
  export const upload = multer({ storage: storage });
  
 /*  cron.schedule('0 0 * * *', async () => {
    try {
      // Realiza una solicitud HTTP a la ruta deseada
      const response = await fetch(`${BASE_URL}/api/users/delete`, {
        method: 'DELETE', // O el método HTTP que corresponda
        // Puedes agregar encabezados, cuerpo de solicitud, etc., si es necesario
      });
  
      if (response.ok) {
        console.log('Tarea cron ejecutada con éxito.');
      } else {
        console.error('Error al ejecutar la tarea cron:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al ejecutar la tarea cron:', error.message);
    }
  }); */

  const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204, 
    allowedHeaders: 'Content-Type,Authorization' 
  };
  
  
  const app = express();
    createRol();
    
    const httpServer = app.listen(wspuerto, () =>{
        console.log(`Servidor API/Socket.io iniciando en puerto ${wspuerto}`)    
    }) 
    
    
    const io = new Server(httpServer, { cors: { origin: "*", methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"], credentials: false }});
    
    // Parseo correcto de urls
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //cors
    app.use(cors(corsOptions))

    //metodo overRide
    app.use(methodOverride('_method'))
    
    //parseo de cookies
    app.use(cookieParser());
    
    //manejo de sesiones    
    app.use(session({
        store: store,
        secret: SECRET,
        resave: false,
        saveUninitialized: false
    }))

    //multer

    //sessiones de passport
    initializePassport();
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());
    
    // end points    
    app.use('/', mainRoutes(io, store, PRODUCTS_PER_PAGE));
    app.use('/', UserRoutes(io));
    app.use('/api', productRoutes(io));
    app.use(`/api`, cartRoutes(io));
    app.use(`/api`, paymentRoutes(io));
    app.use(`/chat`, chatRoutes(io))
    app.use(`/api`, ticketRoutes());
    app.use('/', sessionRoutes());
    app.use(`/`, addLogger);
    app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
    
    // Plantillas estaticas
    app.use('/public', express.static(`${__dirname}/public`));
    
    // Motor de plantillas

    app.engine('handlebars', engine({
        handlebars:Handlebars,
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        helpers:{
            math: function(lvalue, operator, rvalue) {
                lvalue = parseFloat(lvalue);
                rvalue = parseFloat(rvalue);
                return {
                    "+": lvalue + rvalue,
                    "-": lvalue - rvalue,
                    "*": lvalue * rvalue,
                    "/": lvalue / rvalue,
                    "%": lvalue % rvalue
                }[operator];
            },
            or: function (condition1, condition2, options) {
                if (condition1 || condition2) {
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
              }

        }
    }));
    app.set('view engine', 'handlebars');
    app.set('views', `${__dirname}/views`);
    
    //socket io
    // Abrimos el canal de comunicacion
    
    io.on('connection', (socket) => {
       const emitNotes = async () =>{
           const notes = await chatModel.find()  
           io.emit(`loadnotes`, notes)     
        }   
        emitNotes()
    
        socket.on(`newnote`, async data =>{
            const newNote = new chatModel(data)
            const saveNote = await newNote.save()
            socket.emit(`serverNewnote`, saveNote)
        })   
      
        socket.on("disconnect", (reason) => {
            console.log(`Cliente desconectado (${socket.id}): ${reason}`);
        }); 
    
    });
    
    io.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
        console.log(`Cliente conectado (${socket.id})`);
        
        // Emitimos el evento server_confirm
        socket.emit('server_confirm', 'Conexión recibida');
        
        socket.on('new_product_in_cart', (data) => {        
            io.emit('product_added_to_cart', data);
        });
        
        socket.on("disconnect", (reason) => {
            console.log(`Cliente desconectado (${socket.id}): ${reason}`);
        });
    });
    
    //mongodb
    try {   
        //MongoSingleton.getInstance()
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en puerto ${PORT}`);
        });
    } catch(err) {
        console.log('No se puede conectar con el servidor de bbdd');
    }



