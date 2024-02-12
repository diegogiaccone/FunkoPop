import nodemailer from 'nodemailer'
import config from './config.env.js'

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'diegogiaccone35@gmail.com',
        pass: config.PASS_GMAIL
    }
})