import { z } from 'zod';

/**
 * Middleware de validación con Zod
 * @param {z.ZodSchema} schema - Esquema de Zod a validar
 * @param {string} data - Propiedad del request a validar ('body', 'params', 'query')
 * @returns {Function} Middleware de Express
 */

export const validate = async (schema, data) => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData, errors: null };

  } catch (error) {
      console.log('Mensaje:', error.message);

    //si hay un error mapea el campo
    if (error instanceof z.ZodError) {
      const errorList = error.issues || [];
  
      const errors = errorList.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      // Solo retorna el error, no envía respuesta
      return { success: false, data: null, errors };
    }
  }
};