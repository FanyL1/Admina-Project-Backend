// utils/validations/schemas/requestSchem.js
import { z } from 'zod';

export const requestSchema = z.object({
  user_id: z.string().uuid("Debe ser un UUID valido"),
  createByname: z.string()
    .min(3, "El nombre del creador debe tener al menos 3 caracteres")
    .max(100, "El nombre del creador no puede superar los 100 caracteres")
    .optional(),
  createByDNI: z.string()
    .regex(/^\d{1,8}$/, "Cedula inválida")
    .optional(),
  type_id: z.string().uuid("Debe ser un UUID valido"),
  carrera_id: z.string().uuid("Debe ser un UUID valido"),
  observation: z.string().max(500, "La observacion no puede superar los 500 caracteres").optional().nullable(),
  additionalData: z.object({})
  .catchall(z.any())
  .nullable()
  .optional()
});

export const observationSchema = z.object({
  observation: z.string().max(500, "La observacion no puede superar los 500 caracteres").optional().nullable(),
  status: z.enum(['Enviado', 'Revisando', 'Pendiente', 'Observado', 'Aprobado', 'Rechazado']).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Enviado', 'Revisando', 'Pendiente', 'Observado', 'Aprobado', 'Rechazado']),
});
