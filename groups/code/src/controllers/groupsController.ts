import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Teacher} from '../prisma/types.js';
const prisma: PrismaClient = new PrismaClient();

/**
 * Interface for the response object
 */
interface TeacherResponse {
  meta: {
    count: number
    title: string
    url: string
  },
  data: Teacher[]
}

/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getTeachers(req: Request, res: Response): Promise<void> {
  try {
    const teachers: Teacher[] = await prisma.teacher.findMany();
    const teacherResponse: TeacherResponse = {
      meta: {
        count: teachers.length,
        title: 'All teachers',
        url: req.url
      },
      data: teachers
    };
    res.status(200).send(teacherResponse);
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Failed to retrieve owners',
        code: 'SERVER_ERROR',
        url: req.url
      }
    });
  }
}
