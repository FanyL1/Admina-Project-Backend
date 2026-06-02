import { z } from 'zod';

// Esquema para actualización parcial de usuarios
export const updateUserSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  lastname: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  email: z.string()
    .email('Correo electrónico inválido')
    .min(5, 'El email es demasiado corto')
    .max(100, 'El email es demasiado largo')
    .toLowerCase()
    .optional(),
  pass: z.string()
    .max(50, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, 'La contraseña debe incluir una mayúscula, un número y un caracter especial.')
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar',
});

export const updateUserAdminSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  lastname: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  email: z.string()
    .email('Correo electrónico inválido')
    .min(5, 'El email es demasiado corto')
    .max(100, 'El email es demasiado largo')
    .toLowerCase()
    .optional(),
  pass: z.string()
    .max(50, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, 'La contraseña debe incluir una mayúscula, un número y un caracter especial.')
    .optional(),
  dni: z.string()
    .min(8, 'El DNI debe tener al menos 8 caracteres')
    .max(15, 'El DNI no puede superar los 15 caracteres')
    .regex(/^[0-9]+$/, 'El DNI solo puede contener números')
    .optional(),
  role: z.string()
    .uuid('ID de rol inválido')
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar',
});
