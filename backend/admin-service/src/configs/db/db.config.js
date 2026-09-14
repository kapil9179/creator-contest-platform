import prisma from "./prisma.config.js";

const connectAdminDB = async () => {
  await prisma.$connect();
};

export default connectAdminDB;