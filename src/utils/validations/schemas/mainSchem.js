import { z} from "zod";

//Esquema para Registro de usuarios
export const registerSchema = z.object({
  dni: z.string()
    .max(8,"Cedula inválida")
    .regex(/^\d+$/, "Solo se permiten números"),
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

// Esquema para login
export const loginSchema = z.object({
  email: z.string()
    .email('Debe ser un email válido')
    .toLowerCase(),
  pass: z.string()
    .min(1, 'La contraseña es requerida'),
});