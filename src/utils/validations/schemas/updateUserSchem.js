import { z} from "zod";

//Esquema para actualización de usuarios
export const updateUserSchema = z.object({
  name: z.string()
    .min(3,"El nombre debe tener al menos 3 caracteres")
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  lastname: z.string()
    .min(3,"El nombre debe tener al menos 3 caracteres")
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z.string()
    .email("Correo electrónico inválido")
    .min(5, 'El email es demasiado corto')
    .max(100, 'El email es demasiado largo')
    .toLowerCase(),
  pass: z.string()
    .max(50, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, 'La contraseña debe incluir una mayúscula, un número y un caracter especial.')
})

export const updateSuperUserSchema = z.object({
   name: z.string()
    .min(3,"El nombre debe tener al menos 3 caracteres")
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  lastname: z.string()
    .min(3,"El nombre debe tener al menos 3 caracteres")
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z.string()
    .email("Correo electrónico inválido")
    .min(5, 'El email es demasiado corto')
    .max(100, 'El email es demasiado largo')
    .toLowerCase(),
  pass: z.string()
    .max(50, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, 'La contraseña debe incluir una mayúscula, un número y un caracter especial.'),
  dni: z.string()
    .min(8, 'El DNI debe tener al menos 8 caracteres')
    .max(15, 'El DNI no puede superar los 15 caracteres')
    .regex(/^[0-9]+$/, 'El DNI solo puede contener números'),
  role: z.string()
    .uuid("Rol inválido")
});
