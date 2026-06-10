import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';

// Obtener todos los documentos de una solicitud
export const getDocumentsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const documents = await prisma.document.findMany({
      where: { request_id: requestId }
    });

    return res.json({
      success: true,
      message: "Documentos obtenidos exitosamente",
      data: documents
    });
  } catch (error) {
    console.error('Error en getDocumentsByRequest:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener los documentos' 
    });
  }
};

// Subir múltiples documentos a una solicitud
export const uploadDocuments = async (req, res) => {
  try {
    const { requestId } = req.params;
    const files = req.files; // Array de archivos

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Debe subir al menos un archivo PDF'
      });
    }

    // Verificar que la solicitud existe
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId }
    });

    if (!existingRequest) {
      // Si no existe la solicitud, eliminar los archivos subidos
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    const documents = [];
    for (const file of files) {
      const document = await prisma.document.create({
        data: {
          request_id: requestId,
          name_requeriments: file.originalname, // Nombre original del archivo
          router_file: `/uploads/documents/${file.filename}`, // Ruta del archivo
          size_byte: file.size // Tamaño en bytes
        }
      });
      documents.push(document);
    }

    return res.status(201).json({
      success: true,
      message: `${documents.length} documento(s) subido(s) exitosamente`,
      data: documents
    });

  } catch (error) {
    console.error('Error en uploadDocuments:', error);
    // Limpiar archivos subidos en caso de error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Error al subir los documentos' 
    });
  }
};

// Actualizar el archivo PDF de un documento (reemplazar el documento existente)
export const updateDocumentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const newFile = req.file;

    if (!newFile) {
      return res.status(400).json({
        success: false,
        error: 'Debe subir un archivo PDF'
      });
    }

    const existingDocument = await prisma.document.findUnique({
      where: { id }
    });

    if (!existingDocument) {
      // Si no existe el documento, eliminar el archivo subido
      if (fs.existsSync(newFile.path)) {
        fs.unlinkSync(newFile.path);
      }
      return res.status(404).json({
        success: false,
        error: 'Documento no encontrado'
      });
    }

    // Eliminar el archivo antiguo
    const oldFilePath = path.join(process.cwd(), 'uploads', 'documents', path.basename(existingDocument.router_file));
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    // Actualizar el documento con la nueva información del archivo
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        name_file: newFile.filename,
        router_file: `/uploads/documents/${newFile.filename}`,
        size_byte: newFile.size
      }
    });

    return res.json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: updatedDocument
    });

  } catch (error) {
    console.error('Error en updateDocumentFile:', error);
    // Limpiar archivo subido en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el documento' 
    });
  }
};

// Agregar un nuevo requisito (documento) a una solicitud existente
export const addDocumentToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { name_requeriments } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'Debe subir un archivo PDF'
      });
    }

    if (!name_requeriments) {
      // Limpiar archivo subido
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'El nombre del requerimiento es requerido'
      });
    }

    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId }
    });

    if (!existingRequest) {
      // Limpiar archivo subido
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    // Crear el nuevo documento
    const newDocument = await prisma.document.create({
      data: {
        request_id: requestId,
        name_requeriments: name_requeriments,
        name_file: file.filename,
        router_file: `/uploads/documents/${file.filename}`,
        size_byte: file.size
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Requisito agregado exitosamente',
      data: newDocument
    });

  } catch (error) {
    console.error('Error en addDocumentToRequest:', error);
    // Limpiar archivo subido en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false,
      error: 'Error al agregar el requisito' 
    });
  }
};