import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Task } from '../prisma/types.js';
const prisma: PrismaClient = new PrismaClient();

interface TaskResponse {
    meta: {
        count: number
        title: string
        url: string
    },
    data: Task[]
}

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                tasksteps: true,
                taskstudent: true // Remove the nested student include
            }
        });
        const taskResponse: TaskResponse = {
            meta: {
                count: tasks.length,
                title: 'All tasks',
                url: req.url
            },
            data: tasks
        };
        res.json(taskResponse);
    } catch (errors) {
        res.status(500).json({ error: 'kan geen taken vinden' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const tasks = await prisma.task.findUnique({
            where: { id: Number(id) },
            include: {
                tasksteps: true,
                taskstudent: true // Remove the nested student include
            }
        });
        res.status(200).json(tasks);
    } catch (errors) {
        res.status(500).json({ error: 'kan je taak niet vinden' })
    }
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = await prisma.task.create({
            data: { 
                name: req.body.name,
                description: req.body.description,
                date: req.body.date ? new Date(req.body.date) : undefined,
                icon: req.body.icon,
                xp: req.body.xp !== undefined ? Number(req.body.xp) : undefined,
                teacherId: req.body.teacherId !== undefined ? Number(req.body.teacherId) : undefined,
                tasksteps: req.body.steps && req.body.steps.length > 0 ? {
                    create: req.body.steps
                            .filter((step: any) => step.description && step.description.trim() !== '')
                            .map((step: any) => ({
                                text: step.description,
                                completed: false
                            }))
                    }
                    : undefined,
                x: req.body.x !== undefined ? Number(req.body.x) : undefined,
                y: req.body.y !== undefined ? Number(req.body.y) : undefined,
                taskstudent: req.body.assignees && req.body.assignees.length > 0 ? {
                    create: req.body.assignees.map((studentId: number) => ({
                        studentId: Number(studentId)
                    }))
                } : undefined
            },
            include: {
                tasksteps: true,
                taskstudent: true
            }
        })
        res.status(200).json(task);
    } catch (errors) {
        console.error('Error creating task:', errors);
        res.status(500).json({ error: 'kan geen taak aanmaken' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        if (req.body.assignees !== undefined) {
            await prisma.taskStudent.deleteMany({
                where: { taskId: Number(id) }
            });
            
            if (req.body.assignees.length > 0) {
                await prisma.taskStudent.createMany({
                    data: req.body.assignees.map((studentId: number) => ({
                        taskId: Number(id),
                        studentId: Number(studentId)
                    }))
                });
            }
        }
        
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                name: req.body.name,
                description: req.body.description,
                date: req.body.date ? new Date(req.body.date) : undefined,
                icon: req.body.icon,
                xp: req.body.xp !== undefined ? Number(req.body.xp) : undefined,
                teacherId: req.body.teacherId !== undefined? Number(req.body.teacherId) : undefined,
                x: req.body.x !== undefined ? Number(req.body.x) : undefined,
                y: req.body.y !== undefined ? Number(req.body.y) : undefined
            },
            include: {
                tasksteps: true,
                taskstudent: true
            }
        })
       res.status(200).json(task);
    } catch (errors) {
        console.error('Error updating task:', errors);
        res.status(500).json({ error: 'kan geen taak updaten' });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
     try {
        const id = req.params.id;
        
        await prisma.taskStudent.deleteMany({
            where: { taskId: Number(id) }
        });
        
        const task = await prisma.task.delete({
            where: { id: Number(id) },
        })
       res.status(200).json(task);
    } catch (errors) {
        console.error('Error deleting task:', errors);
        res.status(500).json({ error: 'kan geen taak verwijderen' });
    }
}

export const toggleTaskStep = async (req: Request, res: Response): Promise<void> => {
    try {
        const taskStepId = req.params.id;
        const taskStep = await prisma.taskStep.findUnique({
            where: { id: Number(taskStepId) }
        });
        if (!taskStep) {
            res.status(404).json({ error: 'taskstep niet gevonden' });
            return;
        }
        const updatedStep = await prisma.taskStep.update({
            where: { id: Number(taskStepId) },
            data: { completed: !taskStep.completed }
        });
        res.status(200).json(updatedStep);
    } catch (error) {
        res.status(500).json({ error: 'kan taskstep niet updaten' });
    }
}

// REMOVE completeTask - battlepass logic should be in groups service
export const completeTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: { completed: true },
            include: {
                taskstudent: true
            }
        });
        
        // Return task with student IDs - let groups service handle XP
        res.status(200).json(task);
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'kan taak niet voltooien' });
    }
}

export const assignStudentsToTask = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.id);
        const { studentIds } = req.body;
        
        if (!studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ error: 'studentIds array is required' });
        }
        
        await prisma.taskStudent.createMany({
            data: studentIds.map((studentId: number) => ({
                taskId: taskId,
                studentId: Number(studentId)
            })),
            skipDuplicates: true
        });
        
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                taskstudent: true
            }
        });
        
        res.status(200).json({
            message: 'studenten toegewezen aan taak',
            data: task
        });
    } catch (error) {
        console.error('Error assigning students to task:', error);
        res.status(500).json({ error: 'kan studenten niet toewijzen aan taak' });
    }
}

export const removeStudentFromTask = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId); // Fix: parse to number
        const studentId = parseInt(req.params.studentId); // Fix: parse to number
        
        await prisma.taskStudent.deleteMany({
            where: {
                taskId: taskId,
                studentId: studentId
            }
        });
        
        res.status(200).json({
            message: 'student verwijderd van taak'
        });
    } catch (error) {
        console.error('Error removing student from task:', error);
        res.status(500).json({ error: 'kan student niet verwijderen van taak' });
    }
}