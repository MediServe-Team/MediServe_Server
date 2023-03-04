const { PrismaClient } = require('@prisma/client');

// create an Prisma instance
const prisma = new PrismaClient({
  // log: [
  //   {
  //     emit: 'event',
  //     level: 'query',
  //   },
  // ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
});

module.exports = { prisma };
