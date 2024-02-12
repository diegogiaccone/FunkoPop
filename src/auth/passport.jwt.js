import passport from 'passport';
import jwt from 'passport-jwt';
import {} from 'dotenv/config'

const PRIVATE_KEY = process.env.SECRET;

// Estrategia JWT
const JWTStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    if (req && req.cookies) { // hay cookies
        return req.cookies['token'];
    }

    return null;
}

const jwtData = {
    // El token se recupera desde las cookies
    jwtFromRequest: JWTExtractor.fromExtractors([cookieExtractor]),
    secretOrKey: PRIVATE_KEY // misma que en app.js
}

const verify = async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch(err) {
        return done(err.message);
    }
};

const initPassport = () => {
    passport.use('jwtAuth', new JWTStrategy(jwtData, verify));
}

// Middleware de autenticación detallada
// En lugar de llamar directamente a passport.authenticate en el endpoint, llamamos a este
const authentication = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

// Middleware de autorización
const authorization = (rol) => {
    return async(req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
        console.log(req.user)        
        if (req.user.rol[0].name !== "Admin" && req.user.rol[0].name !== rol) return res.status(403).send({ error: 'No permissions' });
        next();       
    }
}

export { initPassport, authentication, authorization};