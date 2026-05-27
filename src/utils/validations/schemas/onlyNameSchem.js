import { z} from "zod";

export const onlyNameSchem = z.object({
   name: z.string()
       .min(3,"El nombre debe tener al menos 3 caracteres")
       .max(100, 'El nombre no puede superar los 100 caracteres')
       .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
})

export const UpdateSchem = z.object({
   name: z.string()
       .min(3,"El nombre debe tener al menos 3 caracteres")
       .max(100, 'El nombre no puede superar los 100 caracteres')
       .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
       .optional(),
   status: z.string()
        .regex(/^(active|inactive)$/, 'El estado debe ser "active" o "inactive"')
        .optional()
        .default('active') 
        .optional(),  
})