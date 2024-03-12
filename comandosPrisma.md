# Para instalar prisma
npm install prisma --save-dev
# Para inicializar prisma, crear la variable de entorno y el directorio prisma
npx prisma init

# Migracion de prisma
npx prisma migrate dev --name init

# Prisma client
npm install @prisma/client