import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BattlepassProgress, Student } from '../../prisma/types.ts';
const prisma: PrismaClient = new PrismaClient();

interface LeaderboardResponse {
  meta: {
    count: number
    title: string
    url: string
  },
  data: [
    {
      "rank": 1,
      "studentId": "uuid",
      "name": "Naam",
      "level": 1,
      "xp": 0
    }
  ]
}

/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  try {
    const leaderboard = await prisma.battlepassProgress.findMany({
      orderBy: [
        { level: 'desc' },
        { xp: 'desc' }
      ],
      include: {
        student: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: 50
    });

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      studentId: entry.student.id,
      name: entry.student.name,
      level: entry.level,
      xp: entry.xp
    }));

    res.status(200).send({
      meta: {
        count: rankedLeaderboard.length,
        title: 'Battlepass leaderboard',
        url: req.url
      },
      data: rankedLeaderboard
    });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Failed to retrieve loaderboard',
        code: 'SERVER_ERROR',
        url: req.url
      }
    });
  }
}
