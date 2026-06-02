import { z } from 'zod';

/**
 * Valida datos con un esquema Zod
 * @param {z.ZodSchema} schema - Esquema de Zod a validar
 * @param {any} data - Datos a validar (req.body, req.params, req.query)
 * @returns {{ success: boolean, data: any, errors: Array<{field:string,message:string}> | null }}
 */

export const validate = async (schema, data) => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return { success: false, data: null, errors };
    }

    return {
      success: false,
      data: null,
      errors: [{ field: '', message: error.message || 'Error de validación' }],
    };
  }
};