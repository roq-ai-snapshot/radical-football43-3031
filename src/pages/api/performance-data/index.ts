import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { performanceDataValidationSchema } from 'validationSchema/performance-data';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPerformanceData();
    case 'POST':
      return createPerformanceData();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPerformanceData() {
    const data = await prisma.performance_data
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'performance_data'));
    return res.status(200).json(data);
  }

  async function createPerformanceData() {
    await performanceDataValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.performance_data.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
