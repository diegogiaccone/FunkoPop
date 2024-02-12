import mongoose from "mongoose";
import Products from "../services/products.dbclass.js";
import chai from "chai";
import config from '../config/config.env.js';
import supertest from "supertest";
import Users from "../services/user.dbclass.js";

const expect = chai.expect
const requester = supertest(`http://localhost:3030`)
const testProducts = {title:"Iron Man", description:"Figura de Acción", price:4500, thumbnail:"https://i.postimg.cc/fRQsmDMR/imagen1.png", stock: 15, category:"Marvel"}
const testUser = {name: "diego", apellido: "giaccone", user: "diego_fg91@hotmail.com", pass: "benjamin"}
const manager = new Products()

describe(`Testing general de FUNKO`, () => {
    before(async function(){
        try{
            await mongoose.connect(config.MONGOOSE_URL)
            await mongoose.connection.collections.users_test.drop() 
            await mongoose.connection.collections.carts_test.drop()
            await mongoose.connection.collections.products_test.drop()
        } catch (err) {
            console.log(err)
        }

    })
    
    beforeEach(function () {       
        this.timeout(5000);
    })
    describe(`Testing de user.dbclass.js`, () => {          
        it('GET users debería obtener la lista de usuarios', async () => {      
            const response = await requester.get('/users');                     
            expect(response.status).to.equal(200); // Verificar código de estado
            expect(response.body.payload).to.be.an('array'); // Verificar que la respuesta sea un array           
        });

        it('POST /registrar debería crear un nuevo usuario y redirigir a /', async () => {
            const response = await requester
              .post('/registrar')
              .send(testUser);   
            expect(response.status).to.equal(302); // Verificar código de estado       
            expect(response.header.location).to.equal('/');// Verificar destino de la redirección          
        });

        it('GET users/:id debería obtener el usuario indicado por id', async () => {           
            const user = await requester.get(`/users`)
            const id = user.body.payload[0]._id             
            const response = (await requester.get(`/users/${id}`));                       
            expect(response.status).to.equal(200); // Verificar código de estado
            expect(response.body.data).to.be.an('object'); // Verificar que la respuesta sea un array           
        });
    })
    describe(`Testing de products.dbclass.js`, () => {          
        it('GET api/products debería obtener la lista de productos', async () => {      
            const response = await requester.get('/api/products'); 
            //console.log(response.body)          
            expect(response.status).to.equal(200); // Verificar código de estado
            expect(response.body.payload).to.be.an('array'); // Verificar que la respuesta sea un array           
          });

        it('POST api/products_index debería crear un nuevo producto y redirigir a products_index', async () => {
            const response = await requester
              .post('/api/products_index')
              .send(testProducts);                     
            expect(response.status).to.equal(302); // Verificar redirección
            expect(response.header.location).to.equal('products_index');// Verificar destino de la redirección          
        });
        
        it('PUT api/products_index:pid debería actualizar un producto y redirigir a products_index', async () => {
            const getProd = await requester.get('/api/products'); 
            const currentProd = await getProd.body.payload[0]
            const req = {
                params: {
                  pid: currentProd._id // El ID del producto que deseas obtener
                },
                body:{price: 3200},
                session:{
                    user: { rol: [{ name: 'Admin' }] }
                },
                json: function(data){
                    expect(data).to.be.equal(true)
                }
              };            
              manager.updateProduct(req)
        }); 
    })
    describe(`Testing de cart.dbclass.js`, () => {
        it('GET api/carts/all debería obtener todos los carritos', async () => {                       
            const response = await requester.get(`/api/carts/all`);                          
            expect(response.status).to.equal(200); // Verificar código de estado
            expect(response.body.payload).to.be.an('object'); // Verificar que la respuesta sea un array           
        });


        it('GET api/carts/:id debería obtener el carrito indicado por ID', async () => {
            const user = await requester.get(`/users`)           
            const id = user.body.payload[0].cart[0]           
            const response = await requester.get(`/api/carts/${id}`);                    
            expect(response.status).to.equal(200); // Verificar código de estado
            expect(response.body.data[0].products).to.be.an('array'); // Verificar que la respuesta sea un array           
        });

        it('DELETE api/carts/:id debería vaciar la lista de productos del carrito indicado', async () => {
            const user = await requester.get(`/users`)           
            const cid = user.body.payload[0].cart[0]
            const response = (await requester.delete(`/api/carts/${cid}`))           
            expect(response.status).to.equal(200); // Verificar código de estado
            expect(response.body.msg).to.be.eql("Carrito Vaciado"); // Verificar que la respuesta sea un array           
        });           
    })

    after(async function () {
        try{
            await mongoose.disconnect()
        }catch(err){
            console.log(err)
        }
    })
})