import { prisma } from "../lib/prisma";
import { Prisma, User } from "../generated/prisma/client.js";

export const userRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({
      data,
    });
  },
};
