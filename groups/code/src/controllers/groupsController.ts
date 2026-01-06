import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Group } from '../../prisma/types.js';
const prisma: PrismaClient = new PrismaClient();

/**
 * Interface for the response object
 */
interface GroupResponse {
    meta: {
        count: number
        title: string
        url: string
    },
    data: any[]
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
        
        res.status(200).json(group);
    } catch (errors) {
        res.status(500).json({ error: 'kan je groep niet vinden' });
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
        
        res.status(200).json({
            groupId: group.id,
            groupName: group.name,
            studentCount: group.students.length,
            students: group.students
        });
    } catch (errors) {
        res.status(500).json({ error: 'kan studenten niet vinden' });
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
        
        // First delete related GroupStudent records
        await prisma.groupStudent.deleteMany({
            where: { groupId: Number(id) }
        });
        
        // Then delete the group
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
        const groupId = req.params.id;
        const studentId = req.body.studentId;
        
        // Update the student's groupId
        const student = await prisma.student.update({
            where: { id: Number(studentId) },
            data: { groupId: Number(groupId) }
        });
        
        // Create GroupStudent relationship
        await prisma.groupStudent.create({
            data: {
                groupId: Number(groupId),
                studentId: Number(studentId)
            }
        });
        
        res.status(200).json({ 
            message: 'student toegevoegd aan groep',
            student: student
        });
    } catch (errors) {
        res.status(500).json({ error: 'kan student niet toevoegen aan groep' });
    }
};

/**
 * Remove a student from a group
 */
export const removeStudentFromGroup = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.id;
        const studentId = req.params.studentId;
        
        // Delete GroupStudent relationship
        await prisma.groupStudent.deleteMany({
            where: {
                groupId: Number(groupId),
                studentId: Number(studentId)
            }
        });
        
        res.status(200).json({ 
            message: 'student verwijderd uit groep'
        });
    } catch (errors) {
        res.status(500).json({ error: 'kan student niet verwijderen uit groep' });
    }
};