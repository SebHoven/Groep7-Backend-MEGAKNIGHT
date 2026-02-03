import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get avatar for a student
 */
export const getAvatarByStudentId = async (req: Request, res: Response) => {
    try {
        const studentId = parseInt(req.params.studentId as string);
        
        const avatar = await prisma.avatar.findUnique({
            where: { studentId: studentId }
        });
        
        if (!avatar) {
            return res.status(404).json({ success: false, error: 'avatar niet gevonden' });
        }
        
        return res.status(200).json({ success: true, data: avatar });
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return res.status(500).json({ success: false, error: 'kan avatar niet ophalen' });
    }
};

/**
 * Create or update avatar for a student
 */
export const saveAvatar = async (req: Request, res: Response) => {
    try {
        const studentId = parseInt(req.params.studentId as string);
        const { hairColor, skinColor, shirtColor, pantsColor, shoeColor } = req.body;
        
        // Check if avatar exists
        const existingAvatar = await prisma.avatar.findUnique({
            where: { studentId: studentId }
        });
        
        if (existingAvatar) {
            // Update existing avatar
            const avatar = await prisma.avatar.update({
                where: { studentId: studentId },
                data: {
                    hairColor,
                    skinColor,
                    shirtColor,
                    pantsColor,
                    shoeColor
                }
            });
            return res.status(200).json({ success: true, data: avatar });
        } else {
            // Create new avatar
            const avatar = await prisma.avatar.create({
                data: {
                    studentId,
                    hairColor,
                    skinColor,
                    shirtColor,
                    pantsColor,
                    shoeColor
                }
            });
            return res.status(201).json({ success: true, data: avatar });
        }
    } catch (error) {
        console.error('Error saving avatar:', error);
        return res.status(500).json({ success: false, error: 'kan avatar niet opslaan' });
    }
};
