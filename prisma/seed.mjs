import "dotenv/config";
import bcryptjs from "bcryptjs";
import prisma from "../src/config/prisma.js";

const SALT_ROUNDS = 10;

const ROLES = ["Estudiante", "Administrativo", "Superusuario"];

const CATEGORY_NAME = "Tratamientos Especiales";

// El pensum lo carga el administrador desde el inicio; el solicitante solo
// adjunta la constancia y el plan, que además son parseados por el validador.
const ACADEMIC_DOCUMENTS = [
  "Constancia de notas",
  "Plan de estudio",
];

const academicRequirements = (tratamiento, { UC = 0, liso = "No aplica" } = {}) => ({
  documents: [...ACADEMIC_DOCUMENTS],
  promedio: 0,
  UC,
  cohorte: false,
  liso,
  materia: true,
  tratamiento,
});

const PROCEDURES = [
  {
    name: "Extracréditos",
    requirements: academicRequirements("EXTRACREDITOS", { UC: 80 }),
  },
  {
    name: "Paralelo",
    requirements: academicRequirements("PARALELO", { UC: 120, liso: "Liso" }),
  },
  {
    name: "Proyecto de Grado I",
    requirements: academicRequirements("PROYECTO DE GRADO I", { UC: 143 }),
  },
  {
    name: "Examen Extraordinario",
    requirements: academicRequirements("EXAMEN EXTRAORDINARIO", { liso: "Liso" }),
  },
  {
    name: "Inscripción Especial",
    requirements: academicRequirements("INSCRIPCION ESPECIAL", { UC: 9 }),
  },
  {
    name: "Último Semestre",
    requirements: academicRequirements("ULTIMO SEMESTRE"),
  },
];

const ACCOUNTS = [
  {
    name: "Super",
    lastname: "Usuario",
    dni: "00000001",
    email: "superusuario@admina.local",
    pass: "Admina2026!",
    role: "Superusuario",
  },
  {
    name: "Administrativo",
    lastname: "Admina",
    dni: "00000002",
    email: "administrativo@admina.local",
    pass: "Admina2026!",
    role: "Administrativo",
  },
];

async function main() {
  const roles = {};

  for (const name of ROLES) {
    roles[name] = await prisma.role.upsert({
      where: { name },
      update: { status: "active" },
      create: { name, status: "active" },
    });
  }

  for (const account of ACCOUNTS) {
    const pass = await bcryptjs.hash(account.pass, SALT_ROUNDS);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        lastname: account.lastname,
        dni: account.dni,
        pass,
        rol_id: roles[account.role].id,
        status: "active",
      },
      create: {
        name: account.name,
        lastname: account.lastname,
        dni: account.dni,
        email: account.email,
        pass,
        rol_id: roles[account.role].id,
        status: "active",
      },
    });
  }

  const category = await prisma.category.upsert({
    where: { name: CATEGORY_NAME },
    update: { status: "active" },
    create: { name: CATEGORY_NAME, status: "active" },
  });

  for (const procedure of PROCEDURES) {
    await prisma.typeProcedure.upsert({
      where: { name: procedure.name },
      update: {
        requirements: procedure.requirements,
        category_id: category.id,
        status: "active",
      },
      create: {
        name: procedure.name,
        requirements: procedure.requirements,
        category_id: category.id,
        status: "active",
      },
    });
  }

  console.log("Roles y usuarios administrativos listos.");
  for (const account of ACCOUNTS) {
    console.log(`  ${account.role}: ${account.email}`);
  }
  console.log(`Trámites listos en la categoría "${CATEGORY_NAME}":`);
  for (const procedure of PROCEDURES) {
    console.log(`  ${procedure.name} -> ${procedure.requirements.tratamiento}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
