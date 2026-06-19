import express from 'express';
import { restrictTo} from "../Middleware/auth.js";
import {getRequests, getOneRequest, getRequestsByUser, createRequest, getAdminRequests, updateRequestStatus, AddObservationRequest} from '../controllers/Request.Controller.js';
import {getDocumentsByRequest, uploadDocuments, updateDocumentFile, addDocumentToRequest} from '../controllers/documents.Controller.js';
import { uploadMultipleFiles, uploadSingleFile, handleMulterError } from '../Middleware/upload.js';

const router = express.Router();

// Rutas de solicitudes

router.get('/', getRequests, restrictTo('Estudiante','Administrativo','Superusuario'));
router.get('/admin/:revisorId', getAdminRequests, restrictTo('Administrativo','Superusuario'));
router.get('/user/:userId', getRequestsByUser, restrictTo('Estudiante') ); 
router.get('/:id', getOneRequest, restrictTo('Estudiante','Administrativo','Superusuario'));
router.post('/', createRequest,  restrictTo('Administrativo','Superusuario'));
router.patch('/:id/admin/:revisorId', AddObservationRequest,  restrictTo('Administrativo','Superusuario'));
router.patch('/:id/status', updateRequestStatus,  restrictTo('Administrativo','Superusuario'));


// Rutas de documentos
router.get('/:requestId/documents', getDocumentsByRequest);
router.post('/:requestId/documents', uploadMultipleFiles('documents'), handleMulterError, uploadDocuments);
router.post('/:requestId/oneDocuments', uploadSingleFile('documents'), handleMulterError, addDocumentToRequest); // Agregar un nuevo documento a una solicitud existente
router.patch('/:requestId/documents/:id', uploadSingleFile('documents'), handleMulterError, updateDocumentFile); // Actualizar archivo del documento

export default router;
