import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StudentsController {
    /**
     * Get all students with their user data
     */
    async getAllStudents(req: Request, res: Response) {
        try {
            const students = await prisma.student.findMany({
                include: {
                    user: true
                }
            });
            return res.status(200).json({ success: true, data: students });
        } catch (error) {
            console.error('Error fetching students:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch students' });
        }
    }

    /**
     * Get student by ID
     */
    async getStudentById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const student = await prisma.student.findUnique({
                where: { id },
                include: {
                    user: true
                }
            });

            if (!student) {
                return res.status(404).json({ success: false, error: 'Student not found' });
            }

            return res.status(200).json({ success: true, data: student });
        } catch (error) {
            console.error('Error fetching student:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch student' });
        }
    }

    /**
     * Get multiple students by their IDs (query param: ids=1,2,3)
     */
    async getStudentsByIds(req: Request, res: Response) {
        try {
            const idsParam = req.query.ids as string;
            if (!idsParam) {
                return res.status(400).json({ success: false, error: 'ids query parameter is required' });
            }

            const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            
            const students = await prisma.student.findMany({
                where: {
                    id: { in: ids }
                },
                include: {
                    user: true
                }
            });

            return res.status(200).json({ success: true, data: students });
        } catch (error) {
            console.error('Error fetching students by IDs:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch students' });
        }
    }
}
