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

export const createAuditLog = async ({ user, action, description, resourceType = null, resourceId = null, requestId = null }) => {
  try {
    const roleName = getRoleName(user);
    const message = `${user.name} ${user.lastname} : ${roleName} - ${formatAuditDate(new Date())} - ${action.toUpperCase()} ${description}`;
    return await prisma.log.create({
      data: {
        user_id: user.id,
        action: action.toUpperCase(),
        resource_type: resourceType,
        resource_id: resourceId,
        description,
        message,
        request_id: requestId,
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
