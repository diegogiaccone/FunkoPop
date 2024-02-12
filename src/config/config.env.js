import { Command } from 'commander'
import dotenv from 'dotenv';

const program = new Command();

program
.version ("2.0.1")
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 3030)
    .option('-wsp <wsport>', 'Puerto ws', 9090)
    .option('-m <mode>', 'Execution mode (PRODUCTION / DEVELOPMENT)', 'DEVELOPMENT')
    .parse(process.argv);
const args = program.opts()
console.log(args.m)

dotenv.config({path: args.m == 'PROD' ? './.env.production' : './.env.development'})

const config = {
MODE: args.m,
PORT: args.p,
WSPORT: args.Wsp,
MONGOOSE_URL: process.env.MONGOOSE_URL,
SECRET: process.env.SECRET,
AVATAR: process.env.AVATAR,
JWT_TIEMPO_EXPIRA: process.env.JWT_TIEMPO_EXPIRA,
JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES,
GITHUB_SECRET: process.env.GITHUB_SECRET,
CLIENT_ID: process.env.CLIENT_ID,
PRODUCTS_PER_PAGE: parseInt(process.env.PRODUCTS_PER_PAGE),
BASE_URL: `http://localhost:${args.p}`,
PERSISTENCE: process.env.PERSISTENCE,
GOOGLE_ID: process.env.GOOGLE_ID,
GOOGLE_SECRET: process.env.GOOGLE_SECRET,
FACEBOOK_ID: process.env.FACEBOOK_ID,
FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
PASS_GMAIL: process.env.PASS_GMAIL,
UPLOAD_DIR: process.env.UPLOAD_DIR,
PUPPETEER: process.env.PUPPETEER_EXECUTABLE_PATH,
MERCADOPAGO: process.env.MERCADOPAGO
}


export default config