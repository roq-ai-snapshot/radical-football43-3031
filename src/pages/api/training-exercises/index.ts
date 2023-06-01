import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { trainingExerciseValidationSchema } from 'validationSchema/training-exercises';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTrainingExercises();
    case 'POST':
      return createTrainingExercise();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTrainingExercises() {
    const data = await prisma.training_exercise
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'training_exercise'));
    return res.status(200).json(data);
  }

  async function createTrainingExercise() {
    await trainingExerciseValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.training_exercise.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
