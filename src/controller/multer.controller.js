// userRoutes.js
import multer from 'multer';
import path from 'path';

// Configurar Multer para almacenar archivos en carpetas diferentes según su tipo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'profileImage' ? 'profiles' : 'documents';
    cb(null, path.join(__dirname, '..', 'uploads', folder));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), userController.uploadDocuments);