import { z } from 'zod';

export const procedureTypeSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  requirements: z.record(z.any(), z.any())
    .refine(value => typeof value === 'object' && value !== null, {
      message: 'Los requisitos deben enviarse como un objeto JSON válido',
    }),
  category_id: z.string().uuid('La categoria no es valida'),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateProcedureTypeSchema = procedureTypeSchema.partial();
