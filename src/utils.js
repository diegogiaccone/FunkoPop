import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import {Faker, en} from '@faker-js/faker'
import { transport } from "./config/mail.config.js";
import config from './config/config.env.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const faker = new Faker({locale: en})


export const generateTokenpass = () => {
  const token = randomBytes(32).toString('hex'); 
  
  const signedToken = jwt.sign(
    { token: token },
    config.SECRET, // Aquí debería ser una clave secreta más segura
    { expiresIn: '1h' }
  );
  
  return signedToken;
};

export const generateUser = () => {
    let products = [];
    const productsQty = parseInt(faker.number.int(20));
    for (let i = 0; i < productsQty; i++) { products.push(generateProduct()); }

    const role = parseInt(faker.number.int(1)) === 1 ? 'client': 'seller';

    return {
        id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(8),
        name: faker.person.firstName(),
        last_name: faker.person.lastName,
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        role: role,
        premium: faker.datatype.boolean(),
        current_job: faker.person.jobType(),
        zodiac_sign: faker.person.zodiacSign(),
        products: products
    }
}

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.number.int(50),
        image: faker.image.urlLoremFlickr(),
        description: faker.commerce.productDescription()
    }
}

export const errorsDict = {
    ROUTING_ERROR: { code: 404, msg: 'No se encuentra el end point solicitado' },
    INVALID_TYPE_ERROR: { code: 400, msg: 'No corresponde el tipo de dato' },
    DATABASE_ERROR: { code: 500, msg: 'No se puede conectar a la base de datos' },
    INTERNAL_ERROR: { code: 500, msg: 'Error interno de ejecución del servidor' }
}

export const pdf =  (name, email, code, date, array, Total) => {     
    let prods = [] 
    array.forEach((element) => {        
        const content = `<tr>
        <td class="service">Compra Aprobada</td>
        <td class="desc">${element.title}&nbsp;&nbsp;(${element.description})</td>
        <td class="unit">$ ${element.price}</td>
        <td class="qty">${element.quantity}</td>
        <td class="total">$ ${element.total}</td>
        </tr>`        
        prods.push(content)
    }) 

    return `<!DOCTYPE html>
         <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Example 1</title>
        <link rel="stylesheet" href="style.css" media="all" />
        </head>
      <body>
      <header class="clearfix">
      <div id="logo">
      <img src="https://i.postimg.cc/65D2wVCC/imagen.png">
      </div>
      <h1>FUNKO POP</h1>
      <div id="company" class="clearfix">
      <div>FunkoPops</div>
            <div>Av.Corrientes 1333 PB<br /> Bs As Argentina</div>
            <div>(+54) 116666666</div>
            <div><a href="diego_fg91@hotmail.com">diego_fg91@hotmail.com</a></div>
            </div>
            <div id="project">
            <div><span>DETALLES</span> Datos del comprador</div>
            <div><span>CLIENTE</span> ${name}</div>            
            <div><span>EMAIL</span> ${email}</div>
            <div><span>FECHA</span> ${date}</div>  
            <div><span>TICKET N°</span> ${code}</div>           
          </div>
        </header>
        <main>
        <table>
        <thead>
        <tr>
        <th class="service">ESTADO</th>
        <th class="desc">DESCRIPTION</th>
        <th>PRECIO</th>
        <th>CANTIDAD</th>
        <th>SUBTOTAL</th>
        </tr>
        </thead>
        <tbody>     
           ${prods}
        <tr>
        <td colspan="4" class="grand total">TOTAL</td>
        <td class="grand total">$ ${Total}</td>
            </tr>
        </tbody>
          </table>
          <div id="notices">          
          <div class="notice">Muchas Gracias por su compra
          <img src="https://i.postimg.cc/hPD6YcWq/favicon.png">          
          </div>
          </div>
          </main>
          <footer>
          Funko Pop 
          </footer>               
      </body>
      </html>

      <style>
      .clearfix:after {
        content: "";
        display: table;
        clear: both;
      }
      
      a {
        color: #5D6975;
        text-decoration: underline;
      }
      
      body {
        position: relative;
        width: 19.5cm;  
        height: 28.7cm; 
        margin: 0 auto; 
        color: #001028;
        background: #FFFFFF; 
        font-family: Arial, sans-serif; 
        font-size: 12px; 
        font-family: Arial;
      }
      
      header {
        padding: 10px 0;
        margin-bottom: 30px;
      }
      
      #logo {
        text-align: center;
        margin-bottom: 10px;
      }
      
      #logo img {
        width: 90px;
      }
      
      h1 {
        border-top: 1px solid  #5D6975;
        border-bottom: 1px solid  #5D6975;
        color: #5D6975;
        font-size: 2.4em;
        line-height: 1.4em;
        font-weight: normal;
        text-align: center;
        margin: 0 0 20px 0;
        background: url(dimension.png);
      }
      
      #project {
        float: left;
      }
      
      #project span {
        color: #5D6975;
        text-align: right;
        width: 52px;
        margin-right: 10px;
        display: inline-block;
        font-size: 0.8em;
      }
      
      #company {
        float: right;
        text-align: right;
      }
      
      #project div,
      #company div {
        white-space: nowrap;        
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 20px;
      }
      
      table tr:nth-child(2n-1) td {
        background: #F5F5F5;
      }
      
      table th,
      table td {
        text-align: center;
      }
      
      table th {
        padding: 5px 20px;
        color: #5D6975;
        border-bottom: 1px solid #C1CED9;
        white-space: nowrap;        
        font-weight: normal;
      }
      
      table .service,
      table .desc {
        text-align: left;
      }
      
      table td {
        padding: 20px;
        text-align: right;
      }
      
      table td.service,
      table td.desc {
        vertical-align: top;
      }
      
      table td.unit,
      table td.qty,
      table td.total {
        font-size: 1.2em;
      }
      
      table td.grand {
        border-top: 1px solid #5D6975;;
      }
      
      #notices .notice {
        color: #5D6975;
        font-size: 1.2em;
      }
      
      footer {
        color: #5D6975;
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0;
        border-top: 1px solid #C1CED9;
        padding: 8px 0;
        text-align: center;
      }
     
    </style>`   
}              
                
export const getMail = (code, date4) => {
    return transport.sendMail({
        from: 'FunkoPops <diegogiaccone35@gmail.com>',
        to: date4,
        subject: 'Ticket de Compra',
        html: `
            <h1><b>Muchas Gracias por su compra</b></h1>
            <p style="color: #f00;">
                <b>Funko Pops</b><br>
                <img src="https://i.postimg.cc/sDGCFRXQ/favicon.png" />
            </p>
        `,
        attachments: [
            { filename: 'ticket.pdf', path: `${__dirname}/public/tickets/${code}.pdf`, cid: 'ticket.pdf' },            
        ]
    })}

export const InactiveMail = (mail) => {
    return transport.sendMail({
        from: 'FunkoPops <diegogiaccone35@gmail.com>',
        to: mail,
        subject: 'Usuario inactivo',
        html: `
            <h1><b>Le informamos que su usuario ah sido eliminado de la base de datos por Inactividad, puede volver a crearse un nuevo usuario cuando lo desee, lo esperamos</b></h1>
            <p style="color: #f00;">
                <b>Funko Pops</b><br>
                <img src="https://i.postimg.cc/sDGCFRXQ/favicon.png" />
            </p>
        `,        
    })}

export const deleteProdMail = (mail, admin) => {
    return transport.sendMail({
        from: 'FunkoPops <diegogiaccone35@gmail.com>',
        to: mail,
        subject: 'Producto Eliminado',
        html: `
            <h1><b>Su producto ah sido eliminado por el Administrador ${admin}</b></h1>
            <p style="color: #f00;">
                <b>Funko Pops</b><br>
                <img src="https://i.postimg.cc/sDGCFRXQ/favicon.png" />
            </p>
        `,        
    })}

export const recoverPass = (date, code) => {
    return transport.sendMail({
        from: 'FunkoPops <diegogiaccone35@gmail.com>',
        to: date,
        subject: 'Reestablece tu contraseña',
        html: `
            <h1><b>Si ud no ha solicitado el reestablecimiento de su contraseña ignore este mail</b></h1>
            <h1><b>Click en el siguiente enlace para reestablecer la contraseña</b></h1>
            <a href="http://localhost:3030/recoverypass/${code}" class="btn btn-primary git">http://localhost:3030/recoverypass/${code}</a>
            <p style="color: #f00;">
                <b>Funko Pops</b><br>
                <img src="https://i.postimg.cc/sDGCFRXQ/favicon.png" />
            </p>
        `        
    })}

export const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación de la API Funko',
          description: 'Esta documentación cubre toda la API'
      }
  },
  apis: ['./src/docs/**/*.yaml']
}

const createHash = (pass) => {
    return bcrypt.hash(pass, bcrypt.genSaltSync(10));
}

const isValidPassword = (passInDb, passToCompare) => {
    return bcrypt.compare(passToCompare, passInDb);
}

export { __filename, __dirname, createHash, isValidPassword };