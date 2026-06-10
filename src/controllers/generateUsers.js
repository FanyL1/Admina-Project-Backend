// Scripts para crear 100 usuarios por cada ejecucion
//Para ejecutar desplazarse por consola a la ruta del archivo
//Ej. Admina Project\platforms-Admina\repository\Backend\src\controllers>
// luego ejecute en consola el comando node generateUsers.js
import fs from 'fs';

const nombres = [
  'Juan Carlos', 'María Fernanda', 'José Luis', 'Ana Lucía', 'Carlos Andrés',
  'Laura Valentina', 'Diego Alejandro', 'Sofía Isabel', 'Javier Eduardo', 'Camila Alejandra',
  'Miguel Ángel', 'Paola Andrea', 'Ricardo Antonio', 'Daniela Sofía', 'Andrés Felipe',
  'Valentina Alexandra', 'Cristian David', 'Natalia Patricia', 'Fernando José', 'Juliana Marcela',
  'Oscar Iván', 'Andrea Carolina', 'Sergio Andrés', 'Diana Marcela', 'Luis Fernando',
  'Marcela Alexandra', 'Héctor Fabio', 'Viviana Patricia', 'Edwin Alexander', 'Sandra Milena',
  'William Antonio', 'Mónica Liliana', 'Jhon Jairo', 'Claudia Marcela', 'Alexander Sánchez',
  'Luz Marina', 'Rafael Enrique', 'Gloria Inés', 'Jesús David', 'Liliana María'
];

const apellidos = [
  'Rodríguez Pérez', 'González López', 'Martínez Sánchez', 'Pérez Ramírez', 'García Torres',
  'Fernández Castro', 'Ramírez Morales', 'Díaz Ortega', 'Ortega Méndez', 'Vargas Ríos',
  'Silva Domínguez', 'Reyes Jiménez', 'Castro Herrera', 'Ruiz Gómez', 'Vega Rojas',
  'Mendoza Paredes', 'Rojas Velásquez', 'Navarro Uribe', 'Guerrero Salazar', 'Pacheco Ríos',
  'Maldonado Vega', 'Franco Suárez', 'Peña Barrios', 'Molina Serrano', 'Delgado Padilla'
];

const generarUsuarios = (cantidad) => {
  const usuarios = [];
  for (let i = 1; i <= cantidad; i++) {
    usuarios.push({
      name: nombres[Math.floor(Math.random() * nombres.length)],
      lastname: apellidos[Math.floor(Math.random() * apellidos.length)],
      dni: String(Math.floor(10000000 + Math.random() * 90000000)),
      email: `usuario${i}@test.com`, //sumarle la cantidad de usuarios añadidos en cada iteracion ej. `usuario${i+100}@test.com` - en la siguiente `usuario${i+200}@test.com`
      pass: "User-123" //NO CAMBIAR LA CLAVE, debe ser igual para todo los usuarios
    });
  }
  return usuarios;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const crearUsuarios = async (usuarios, delayMs = 100) => {
  let successCount = 0;
  let errorCount = 0;
  
  console.log(`🚀 Iniciando creación de ${usuarios.length} usuarios\n`);
  
  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];
    const progress = `[${i + 1}/${usuarios.length}]`;
    
    try {
      const response = await fetch('http://localhost:2560/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      
      if (response.ok) {
        console.log(`✅ ${progress} ${usuario.email} - Creado`);
        successCount++;
      } else {
        const error = await response.json();
        console.log(`❌ ${progress} ${usuario.email} - Error: ${error.error || response.status}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ ${progress} ${usuario.email} - Error: ${error.message}`);
      errorCount++;
    }
    
    if (i < usuarios.length - 1) {
      await delay(delayMs);
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Fallidos: ${errorCount}`);
  console.log(`📦 Total: ${usuarios.length}`);
};

// Ejecutar
const usuarios = generarUsuarios(100); //Numero de usuarios a generar por cada ejecucion
fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));
console.log('💾 Backup guardado en usuarios.json\n');

crearUsuarios(usuarios, 100); // 100ms de delay entre cada usuario
