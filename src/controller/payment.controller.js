/* import { MercadoPagoConfig, Payment } from 'mercadopago';
import config from '../config/config.env.js';


export const creatOrder = async (req, res) => {
    
    const client = new MercadoPagoConfig({ accessToken: config.MERCADOPAGO, options: { timeout: 5000 }});
    const payment = new Payment(client);
    
    const body = {
        transaction_amount: 100,
        description: 'batman',
        payment_method_id: 'account_money',        
        payer: {
            email: 'test_user_432179499@testuser.com'
        },
        token: "4509 9535 6623 3704"      
    };

    payment.create({ body }).then(console.log).catch(console.log);
   


    res.send ("creando orden")
} */


import { MercadoPagoConfig, Payment } from 'mercadopago';
import config from '../config/config.env.js';

export const createOrder = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: config.MERCADOPAGO, options: { timeout: 5000 } });
        const payment = new Payment(client);

        const body = {
            transaction_amount: 100,
            description: 'batman',
            payment_method_id: 'visa',
            payer: {
                email: 'test_user_432179499@testuser.com',
            },
            token: "4509 9535 6623 3704"
        };

        const result = await payment.create({ body });
        console.log(result);

        res.send("creando orden");
    } catch (error) {
        console.error('Error al crear la orden:', error.message, error.cause);
        res.status(500).send("Error al crear la orden");
    }
};