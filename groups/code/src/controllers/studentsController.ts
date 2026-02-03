import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Sync a student from auth service to groups service
 * Called by auth service after student registration
 */
export const syncStudent = async (req: Request, res: Response) => {
    try {
        const { userId, name, id } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ 
                success: false, 
                error: 'userId and name are required' 
            });
        }

        // Check if student already exists
        const existingStudent = await prisma.student.findFirst({
            where: { userId: userId }
        });

        if (existingStudent) {
            // Update existing student
            const student = await prisma.student.update({
                where: { id: existingStudent.id },
                data: { name }
            });
            return res.status(200).json({ 
                success: true, 
                message: 'Student updated',
                data: student 
            });
        } else {
            // Create new student
            const student = await prisma.student.create({
                data: {
                    userId: userId,
                    name: name
                }
            });
            return res.status(201).json({ 
                success: true, 
                message: 'Student synced',
                data: student 
            });
        }
    } catch (error) {
        console.error('Error syncing student:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to sync student' 
        });
    }
};

/**
 * Sync a teacher from auth service to groups service
 */
export const syncTeacher = async (req: Request, res: Response) => {
    try {
        const { userId, name, id } = req.body;

        console.log('📥 Received teacher sync request:', { userId, name, id });

        if (!userId || !name) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false, 
                error: 'userId and name are required' 
            });
        }

        // Check if teacher already exists
        const existingTeacher = await prisma.teacher.findFirst({
            where: { userId: userId }
        });

        if (existingTeacher) {
            // Update existing teacher
            const teacher = await prisma.teacher.update({
                where: { id: existingTeacher.id },
                data: { name }
            });
            return res.status(200).json({ 
                success: true, 
                message: 'Teacher updated',
                data: teacher 
            });
        } else {
            // Create new teacher
            const teacher = await prisma.teacher.create({
                data: {
                    userId: userId,
                    name: name
                }
            });
            return res.status(201).json({ 
                success: true, 
                message: 'Teacher synced',
                data: teacher 
            });
        }
    } catch (error) {
        console.error('Error syncing teacher:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to sync teacher' 
        });
    }
};

/**
 * Get all students in groups service
 */
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                group: true
            }
        });
        return res.status(200).json({ 
            success: true, 
            data: students 
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch students' 
        });
    }
};

/**
 * Get student by userId (from auth service)
 */
export const getStudentByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const student = await prisma.student.findFirst({
            where: { userId: userId },
            include: {
                group: true
            }
        });

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                error: 'Student not found' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: student 
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch student' 
        });
    }
};

/**
 * Get teacher by userId (from auth service)
 */
export const getTeacherByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const teacher = await prisma.teacher.findFirst({
            where: { userId: userId },
            include: {
                groups: true
            }
        });

        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                error: 'Teacher not found',
                hint: 'Teacher may not be synced yet. Register or re-login.'
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: teacher 
        });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch teacher' 
        });
    }
};
