import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StudentsController {
  // Get student by ID
  async getStudentById(req: Request, res: Response): Promise<Response> {
    try {
      const studentId = parseInt(req.params.id as string);
      
      if (isNaN(studentId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student ID'
        });
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          }
        }
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error('Get student by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching student'
      });
    }
  }

  // Get multiple students by IDs (for task assignments)
  async getStudentsByIds(req: Request, res: Response): Promise<Response> {
    try {
      const idsParam = req.query.ids as string;
      
      if (!idsParam) {
        return res.status(400).json({
          success: false,
          message: 'ids query parameter is required'
        });
      }

      const studentIds = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

      if (studentIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid student IDs provided'
        });
      }

      const students = await prisma.student.findMany({
        where: {
          id: { in: studentIds }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: students
      });
    } catch (error) {
      console.error('Get students by IDs error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching students'
      });
    }
  }

  // Get all students
  async getAllStudents(req: Request, res: Response): Promise<Response> {
    try {
      const students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: students
      });
    } catch (error) {
      console.error('Get all students error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching students'
      });
    }
  }
}

export default new StudentsController();
