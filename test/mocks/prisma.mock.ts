import { jest } from '@jest/globals';
import { PrismaService } from '../../src/prisma/prisma.service.js';

export function createPrismaMock() {
  return {
    user: {
      create: jest.fn<PrismaService['user']['create']>(),
      findUniqueOrThrow: jest.fn<PrismaService['user']['findUniqueOrThrow']>(),
    },
  };
}
