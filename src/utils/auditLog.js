import prisma from '../config/prisma.js';

const pad2 = (value) => String(value).padStart(2, '0');

const formatAuditDate = (date) => {
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const year = String(date.getFullYear()).slice(-2);
  let hour = date.getHours();
  const minutes = pad2(date.getMinutes());
  const isPm = hour >= 12;
  const meridiem = isPm ? 'pm' : 'am';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${month}/${day}/${year} ${hour}:${minutes}${meridiem}`;
};

const getRoleName = (user) => {
  return user?.role?.name || user?.rol?.name || 'Desconocido';
};

export const createAuditLog = async ({ user, action, description, resourceType = null, resourceId = null }) => {
  try {
    return await prisma.log.create({
      data: {
        user_id: user.id,
        action: action.toUpperCase(),
        resourceType,
        resourceId,
        description,
      },
    });
  } catch (error) {
    console.error('Error guardando log de auditoría:', error);
    return null;
  }
};

export const isPrivilegedRole = (user) => {
  const roleName = getRoleName(user);
  return ['Administrativo', 'Superusuario'].includes(roleName);
};

export const generatorDescription = (oldData, newData) => {
  const update = [];

  // Lista de campos que te interesa auditar  
  const fields = {
    name: 'Nombre',
    lastname: 'Apellido',
    email: 'Correo Electrónico',
    dni: 'Cédula',
    role: 'Rol',
    status: 'Estado',
    observation: 'Observación', 
    type_id: 'Tipo de Solicitud',
    carrera_id: 'Carrera',
    createByname: 'Creado por (Nombre)',
    createByDNI: 'Creado por (Cédula)'
  };
  const fieldsAudit = Object.keys(fields).filter(key => key in oldData);
fieldsAudit.forEach((field) => {
    let rawBefore = oldData[field];
    let rawAfter = newData[field];

    // 3. TRATAMIENTO PARA EL ROL (Solo si el campo evaluado es 'role' y existe en el objeto)
    if (field === 'role' && (oldData.role || newData.role)) {
      const roleNameBefore = oldData.role?.name || (typeof oldData.role === 'string' ? oldData.role : null);
      const roleNameAfter = newData.role?.name || (typeof newData.role === 'string' && !newData.role.includes('-') ? newData.role : null);
      
      const roleIdBefore = oldData.roleId || oldData.role?.id || null;
      const roleIdAfter = newData.roleId || (typeof newData.role === 'string' && newData.role.includes('-') ? newData.role : null) || newData.role?.id;

      if (newData.role === undefined && newData.roleId === undefined) return;
      if (roleIdBefore && roleIdAfter && roleIdBefore === roleIdAfter) return;
      if (roleNameBefore && roleIdAfter && !roleNameAfter && !roleIdBefore) return;

      if (roleNameBefore && roleNameAfter) {
        rawBefore = roleNameBefore;
        rawAfter = roleNameAfter;
      } else {
        rawBefore = roleIdBefore;
        rawAfter = roleIdAfter;
      }
    }

    // 4. EVITAR FALSOS POSITIVOS PARA CAMPOS AUSENTES
    // Si el campo no viene en el update de Prisma (es undefined), no asumimos que cambió a vacío.
    if (field !== 'role' && rawAfter === undefined) {
      return;
    }

    // 5. COMPARACIÓN REAL (Trata los nulos como vacíos de forma amigable)
    if (rawBefore !== rawAfter) {
      const valueBefore = rawBefore !== undefined && rawBefore !== null && rawBefore !== '' ? rawBefore : 'Vacío';
      const valueAfter = rawAfter !== undefined && rawAfter !== null && rawAfter !== '' ? rawAfter : 'Vacío';
      
      // Si después de limpiar los nulos/vacíos siguen siendo iguales (ej: null vs ""), no lo agrega
      if (valueBefore === valueAfter) return;

      const traductor = fields[field] || field;
      update.push(`${traductor}: [${valueBefore}] -> [${valueAfter}]`);
    }
  });

  // Retorno del string final para tu log
  return update.length > 0 
    ? `Campos modificados: ${update.join(', ')}` 
    : 'Se guardó el registro sin cambios aparentes.';
};