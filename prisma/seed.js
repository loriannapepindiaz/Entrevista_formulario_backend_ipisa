// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const users = [
  { username: "Carmen.alvarez",      password: "Dsales11", full_name: "Carmen Alvarez",      role: "supervisor" },
  { username: "Rud.pena",            password: "Dsales12", full_name: "Rud Peña",            role: "supervisor" },
  { username: "William.batista",     password: "Dsales21", full_name: "William Batista",     role: "supervisor" },
  { username: "Esther.estevez",      password: "Dsales22", full_name: "Esther Estevez",      role: "supervisor" },
  { username: "Glenys.estevez",      password: "Dsales23", full_name: "Glenys Estevez",      role: "supervisor" },
  { username: "Luis.reyes",          password: "Dsales31", full_name: "Luis Reyes",          role: "entrevistador" },
  { username: "Luis.quezada",        password: "Dsales32", full_name: "Luis Quezada",        role: "entrevistador" },
  { username: "Julia.paulino",       password: "Dsales33", full_name: "Julia Paulino",       role: "entrevistador" },
  { username: "Kelvin.torres",       password: "Dsales35", full_name: "Kelvin Torres",       role: "entrevistador" },
  { username: "Radelqui.santos",     password: "Dsales36", full_name: "Radelqui Santos",     role: "entrevistador" },
  { username: "Valentina.rodriguez", password: "Dsales37", full_name: "Valentina Rodriguez", role: "entrevistador" },
  { username: "Jesenia.pichardo",    password: "Dsales38", full_name: "Jesenia Pichardo",    role: "entrevistador" },
  { username: "Daniela.vicente",     password: "Dsales39", full_name: "Daniela Vicente",     role: "entrevistador" },
  { username: "Yariel.pichardo",     password: "Dsales40", full_name: "Yariel Pichardo",     role: "entrevistador" },
  { username: "Laura.rodriguez",     password: "Dsales41", full_name: "Laura Rodriguez",     role: "entrevistador" },
  { username: "Adelin.delarosa",     password: "Dsales42", full_name: "Adelin De La Rosa",   role: "entrevistador" },
  { username: "Lori.anna",           password: "donboscolapara", full_name: "Lori Anna",     role: "entrevistador" },   // cambiado a entrevistador para que pase
];

async function main() {
  console.log("🌱 Actualizando usuarios con contraseñas seguras...\n");

  for (const u of users) {
    try {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(u.password, salt);

      await prisma.users.upsert({
        where: { username: u.username },
        update: {
          password_hash,
          full_name: u.full_name,
          role: u.role,
          activo: true
        },
        create: {
          username: u.username,
          password_hash,
          full_name: u.full_name,
          role: u.role,
          activo: true,
        },
      });

      console.log(`✅ ${u.username} (${u.role}) → actualizado correctamente`);
    } catch (error) {
      console.error(`❌ Error con ${u.username}:`, error.message);
    }
  }

  console.log("\n🎉 Proceso de actualización de usuarios finalizado.");
}

main()
  .catch((e) => console.error("❌ Error general:", e))
  .finally(async () => await prisma.$disconnect());