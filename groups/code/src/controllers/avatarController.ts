import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Avatar } from '../../prisma/types.js';
const prisma: PrismaClient = new PrismaClient();

export type AvatarData = {
    studentId: number;
    hairColorId: number;
    bodyItemId: number;
    legsItemId: number;
    feetItemId: number;
    skinColorId: number;
};

export const getAvatar = async (req: Request, res: Response) => {
    const studentId = Number(req.params.studentId);
    try {
        const avatar = await prisma.avatar.findFirst({
            where: { studentId },
            include: { hairColor: true, bodyItem: true, legsItem: true, feetItem: true, skinColor: true }
        });

    } catch (errors) {
        res.status(500).json({ error: 'kan geen avatar vinden' });
    }
};

export const createAvatar = async (req: Request, res: Response) => {
    try {
         const { studentId, hairColorId, bodyItemId, legsItemId, feetItemId, skinColorId } = req.body;
        const avatar = await prisma.avatar.create({
            data: {
                studentId: studentId,
                hairColorId: hairColorId,
                bodyItemId: bodyItemId,
                legsItemId: legsItemId,
                feetItemId: feetItemId,
                skinColorId: skinColorId,
            },
            include: {
                hairColor: true,
                bodyItem: true,
                legsItem: true,
                feetItem: true,
                skinColor: true,
            },
        });

    }
    }