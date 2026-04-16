require('dotenv').config();
const prisma = require('./src/config/prisma');

async function main() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT prosrc 
    FROM pg_proc 
    WHERE proname = 'fn_audit_trigger'
  `);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());