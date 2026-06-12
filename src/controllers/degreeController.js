import prisma from '../config/prisma.js';
import { validate } from '../utils/validations/validate.js';
import { onlyNameSchem, UpdateSchem } from '../utils/validations/schemas/onlyNameSchem.js';
import { createAuditLog } from '../utils/auditLog.js';

// Crear carrera
const addDegree = async (req, res) => {
    try {
        const validation = await validate(onlyNameSchem, req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.errors,
            });
        }

        const { name } = validation.data;

        const existingDegree = await prisma.carrera.findUnique({
            where: { name }
        });

        if(existingDegree){
            return res.status(400).json({
                error: "Carrera ya registrada"
            })
        }

        const Degree = await prisma.carrera.create({
            data: {
                name
            }
        })

        await createAuditLog({
          user: req.user,
          action: 'CREO Carrera',
          description: `"${Degree.name}"`,
          resourceType: 'Carrera',
          resourceId: Degree.id
        });
        
        res.status(201).json({message: 'Carrera creada', Degree})
    } catch (error) {

        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Esta carrera ya está registrada" });
        }
        res.status(500).json({ error: error.message });
        
    }
}

//Obtener carrera
const allDegree = async(req,res)=>{

    try{
        const getDegree = await prisma.carrera.findMany({
            select: {
                id: true,
                name: true,
                status: true,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Carreras obtenidas exitosamente",
            data: getDegree 
        });
    }catch(error){
        return res.status(500).json({error: error.message })
    }

}

// Este endpoint es para modificar la carrera
const updateDegree = async (req, res) => {
    try {
        const validation = await validate(UpdateSchem, req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.errors,
            });
        }

        const { id } = req.params;
        const { name, status } = validation.data;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (status !== undefined) updateData.status = status;

        const updatedDegree = await prisma.carrera.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                status: true,
            }
        });

        await createAuditLog({
          user: req.user,
          action: 'MODIFICO Carrera',
          description: `"${updatedDegree.name}"`,
          resourceType: 'Carrera',
          resourceId: updatedDegree.id
        });

        res.status(200).json({
            message: 'Carrera actualizada',
            carrera: updatedDegree,
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Carrera no encontrada' });
        }
        res.status(500).json({ error: error.message });
    }
}

export default {
    addDegree,
    allDegree,
    updateDegree
}