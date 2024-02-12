import { Router } from "express";
import { __dirname } from '../utils.js';
import { authentication } from "../auth/passport.jwt.js";
import { addUser, deleteUser, getRegister, getUserById, updateUser, validate, getUpdate, getAvatarUpdate, getUsers, fakeUser, getRecovery, getRecoveryPass, mailPassRecovery, passRecovery, getRol, updateRol, getMessages, getErrMessages, getEqual, getSuccess, getPassEqual, uploadAvatar, getUploadDocument, uploadDocuments, getPremium, updatePremium, getloadDocument, deleteInactiveUser, getUserDelete} from "../controller/user.controller.js";
import Rol from "../services/isAdmin.dbclass.js";
import { upload } from "../app.js";

const rol = new Rol();
const router = Router();
const userRoutes = (io) => {
       
    router.get(`/api/users`, getUsers,[validate, authentication('jwtAuth')])

    router.get('/users/:id?',getUserById, [validate, authentication('jwtAuth')]);

    router.get(`/updatepass`, getUpdate,[validate, authentication('jwtAuth')])

    router.get(`/messages`, getMessages)

    router.get(`/errmessages`, getErrMessages)

    router.get(`/recovery`, getRecovery)     

    router.get(`/api/users/premium/:uid`, getPremium, [validate, authentication('jwtAuth')])
    
    router.get(`/uploadDocuments`, getUploadDocument)

    router.get(`/loadDocuments`, getloadDocument)

    router.get(`/recoverypass/mailequal`, getEqual)

    router.get(`/recoverypass/passequal`, getPassEqual)

    router.get(`/recoverypass/success`, getSuccess)

    router.get('/recoverypass/:token', getRecoveryPass)

    router.get(`/fakeuser`, fakeUser, [validate, authentication('jwtAuth')])

    router.get(`/updateavatar`, getAvatarUpdate,[validate, authentication('jwtAuth')])

    router.get('/registrar', getRegister); 

    router.get('/userDelete', getUserDelete); 
    
    router.get('/rol', getRol, [validate, authentication('jwtAuth')], rol.isAdmin);

    router.post('/api/users/:uid/documents', upload.array('documents'),[validate, authentication('jwtAuth')], uploadDocuments);

    router.post('/:uid/uploadAvatar', upload.single('avatarFile'),[validate, authentication('jwtAuth')], uploadAvatar);

    router.post('/recovery', mailPassRecovery)

    router.post('/rol', updateRol, [validate, authentication('jwtAuth')], rol.isAdmin);

    router.post('/api/users/premium/:uid', updatePremium, [validate, authentication('jwtAuth')]);
    
    router.post('/recoverypass/:token', passRecovery )

    router.post(`/updatepass`, updateUser, [validate, authentication('jwtAuth')])
    
    router.post(`/registrar`, addUser);

    router.put('/users/:id', updateUser, [validate, authentication('jwtAuth')]);
    
    router.delete('/api/users/delete', deleteInactiveUser, [validate, authentication('jwtAuth')]);

    router.delete('/api/users/delete/user', deleteUser, [validate, authentication('jwtAuth')], rol.isAdmin);

    return router;
}

export default userRoutes;

