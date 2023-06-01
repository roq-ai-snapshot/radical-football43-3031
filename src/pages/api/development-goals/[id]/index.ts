import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { developmentGoalValidationSchema } from 'validationSchema/development-goals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.development_goal
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDevelopmentGoalById();
    case 'PUT':
      return updateDevelopmentGoalById();
    case 'DELETE':
      return deleteDevelopmentGoalById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDevelopmentGoalById() {
    const data = await prisma.development_goal.findFirst(convertQueryToPrismaUtil(req.query, 'development_goal'));
    return res.status(200).json(data);
  }

  async function updateDevelopmentGoalById() {
    await developmentGoalValidationSchema.validate(req.body);
    const data = await prisma.development_goal.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteDevelopmentGoalById() {
    const data = await prisma.development_goal.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
