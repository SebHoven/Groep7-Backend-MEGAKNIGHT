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
 * Get all groups
 */
export const getAllGroups = async (req: Request, res: Response) => {
    try {
        const groups = await prisma.group.findMany({
            include: {
                teacher: true,
                students: true
            }
        });
        const groupResponse: GroupResponse = {
            meta: {
                count: groups.length,
                title: 'All groups',
                url: req.url
            },
            data: groups
        };
        res.json(groupResponse);
    } catch (errors) {
        res.status(500).json({ error: 'kan geen groepen vinden' });
    }
};

/**
 * Get group by ID
 */
export const getGroupById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const group = await prisma.group.findUnique({
            where: { id: Number(id) },
            include: {
                teacher: true,
                students: true,
                groupstudent: {
                    include: {
                        student: true
                    }
                }
            }
        });
        
        if (!group) {
            return res.status(404).json({ error: 'groep niet gevonden' });
        }
        
        return res.status(200).json(group);
    } catch (errors) {
        return res.status(500).json({ error: 'kan je groep niet vinden' });
    }
};

/**
 * Get all students in a specific group
 */
export const getGroupStudents = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const group = await prisma.group.findUnique({
            where: { id: Number(id) },
            include: {
                students: {
                    include: {
                        avatar: true,
                        progress: true
                    }
                }
            }
        });
        
        if (!group) {
            return res.status(404).json({ error: 'groep niet gevonden' });
        }
        
        return res.status(200).json({
            groupId: group.id,
            groupName: group.name,
            studentCount: group.students.length,
            students: group.students
        });
    } catch (errors) {
        return res.status(500).json({ error: 'kan studenten niet vinden' });
    }
};

/**
 * Get all unassigned students (students without a group)
 */
export const getUnassignedStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            where: { groupId: null }
        });
        
        res.status(200).json({
            count: students.length,
            students: students
        });
    } catch (errors) {
        res.status(500).json({ error: 'kan ongegroepeerde studenten niet vinden' });
    }
};

/**
 * Get groups by teacher ID
 */
export const getGroupsByTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.teacherId;
        const groups = await prisma.group.findMany({
            where: { teacherId: Number(teacherId) },
            include: {
                students: true,
                teacher: true
            }
        });
        
        res.status(200).json({
            teacherId: Number(teacherId),
            groupCount: groups.length,
            groups: groups
        });
    } catch (errors) {
        res.status(500).json({ error: 'kan groepen voor deze leraar niet vinden' });
    }
};

/**
 * Create a new group
 */
export const createGroup = async (req: Request, res: Response) => {
    try {
        const group = await prisma.group.create({
            data: {
                name: req.body.name,
                teacherId: Number(req.body.teacherId)
            },
            include: {
                teacher: true,
                students: true
            }
        });
        
        res.status(201).json(group);
    } catch (errors) {
        res.status(500).json({ error: 'kan geen groep aanmaken' });
    }
};

/**
 * Update a group
 */
export const updateGroup = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const group = await prisma.group.update({
            where: { id: Number(id) },
            data: {
                name: req.body.name,
                teacherId: req.body.teacherId !== undefined ? Number(req.body.teacherId) : undefined
            },
            include: {
                teacher: true,
                students: true
            }
        });
        
        res.status(200).json(group);
    } catch (errors) {
        res.status(500).json({ error: 'kan groep niet updaten' });
    }
};

/**
 * Delete a group
 */
export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        // Set all students in this group to unassigned (groupId = null)
        await prisma.student.updateMany({
            where: { groupId: Number(id) },
            data: { groupId: null }
        });
        
        // Delete GroupStudent junction records (will be done automatically with onDelete: Cascade)
        // But we can do it explicitly for clarity
        await prisma.groupStudent.deleteMany({
            where: { groupId: Number(id) }
        });
        
        // Now delete the group
        const group = await prisma.group.delete({
            where: { id: Number(id) }
        });
        
        res.status(200).json(group);
    } catch (errors) {
        res.status(500).json({ error: 'kan groep niet verwijderen' });
    }
};

/**
 * Add a student to a group
 */
export const addStudentToGroup = async (req: Request, res: Response) => {
    try {
        const groupId = parseInt(req.params.groupId);  // Changed from req.params.id
        const studentId = parseInt(req.params.studentId);  // Changed from req.body.studentId
        
        // Update the student's groupId
        const student = await prisma.student.update({
            where: { id: studentId },
            data: { groupId: groupId }
        });
        
        // Create GroupStudent relationship
        await prisma.groupStudent.create({
            data: {
                groupId: groupId,
                studentId: studentId
            }
        });
        
        res.status(200).json({ 
            message: 'student toegevoegd aan groep',
            data: student
        });
    } catch (errors) {
        console.error('Error adding student to group:', errors);
        res.status(500).json({ error: 'kan student niet toevoegen aan groep' });
    }
};

/**
 * Remove a student from a group (sets student to unassigned)
 */
export const removeStudentFromGroup = async (req: Request, res: Response) => {
    try {
        const groupId = parseInt(req.params.groupId);
        const studentId = parseInt(req.params.studentId);
        
        // Remove the student's groupId
        const student = await prisma.student.update({
            where: { id: studentId },
            data: { groupId: null }
        });
        
        // Delete GroupStudent relationship
        await prisma.groupStudent.deleteMany({
            where: {
                groupId: groupId,
                studentId: studentId
            }
        });
        
        res.status(200).json({ 
            message: 'student verwijderd uit groep',
            data: student
        });
    } catch (errors) {
        console.error('Error removing student from group:', errors);
        res.status(500).json({ error: 'kan student niet verwijderen uit groep' });
    }
};