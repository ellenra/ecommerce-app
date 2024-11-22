import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

//if deploying to serverless env, use this:
//let prisma;

//if (!global.prisma) {
//  global.prisma = new PrismaClient();
//}

//prisma = global.prisma;

//export default prisma;
