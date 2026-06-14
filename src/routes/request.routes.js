import express from 'express';
import {getRequests, getOneRequest, getRequestsByUser, createRequest, getAdminRequests, updateRequestStatus, AddObservationRequest} from '../controllers/Request.Controller.js';
import {getDocumentsByRequest, uploadDocuments, updateDocumentFile, addDocumentToRequest} from '../controllers/documents.Controller.js';
import { uploadMultipleFiles, uploadSingleFile, handleMulterError } from '../Middleware/upload.js';

const router = express.Router();

// Rutas de solicitudes

router.get('/', getRequests);
router.get('/admin/:revisorId', getAdminRequests);
router.get('/user/:userId', getRequestsByUser); 
router.get('/:id', getOneRequest);
router.post('/', createRequest);
router.patch('/:id', AddObservationRequest);
router.patch('/:id/status', updateRequestStatus);


// Rutas de documentos
router.get('/:requestId/documents', getDocumentsByRequest);
router.post('/:requestId/documents', uploadMultipleFiles('documents'), handleMulterError, uploadDocuments);
router.post('/:requestId/oneDocuments', uploadSingleFile('documents'), handleMulterError, addDocumentToRequest); // Agregar un nuevo documento a una solicitud existente
router.patch('/:requestId/documents/:id', uploadSingleFile('documents'), handleMulterError, updateDocumentFile); // Actualizar archivo del documento

export default router;
