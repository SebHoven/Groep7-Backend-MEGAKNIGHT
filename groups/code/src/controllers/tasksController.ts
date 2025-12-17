import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Task } from '../../prisma/types.js';
const prisma: PrismaClient = new PrismaClient();

/**
 * Interface for the response object
 */
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
                taskstudent: {
                include: { student: true }
                }
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
        });
        res.status(200).json(tasks);
    } catch (errors) {
        res.status(500).json({ error: 'kan je taak niet vinden' })
    }
}

export const createTask = async (req: Request, res: Response) => {
    const taskName = req.body.name;
    
    try {
        const task = await prisma.task.create({
            data: { 
                name: req.body.name,
                description: req.body.description,
                date: req.body.date ? new Date(req.body.date) : undefined,
                icon: req.body.icon,
                xp: req.body.xp !== undefined ? Number(req.body.xp) : undefined,
                coordinates: req.body.coordinates !== undefined ? Number(req.body.coordinates) : undefined,
                teacherId: req.body.teacherId !== undefined ? Number(req.body.teacherId) : undefined,
                tasksteps: req.body.steps && req.body.steps.length > 0 ? {
                    create: req.body.steps
                            .filter((step: any) => step.description && step.description.trim() !== '')
                            .map((step: any) => ({
                                text: step.description,
                                completed: false
                            }))
                    }
                    : undefined
            },
            include: {
                tasksteps: true
            }
        })
        res.status(200).json(task);
    } catch (errors) {
        res.status(500).json({ error: 'kan geen taak aanmaken' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const task = await prisma.task.update({
            where:
                { id: Number(id) },
            data: {
                 name: req.body.name,
                description: req.body.description,
                date: req.body.date ? new Date(req.body.date) : undefined,
                icon: req.body.icon,
                xp: req.body.xp !== undefined ? Number(req.body.xp) : undefined,
                coordinates: req.body.coordinates !== undefined ? Number(req.body.coordinates) : undefined,
                teacherId: req.body.teacherId !== undefined? Number(req.body.teacherId) : undefined
            }
        })
       res.status(200).json(task);
    } catch (errors) {
        res.status(500).json({ error: 'kan geen taak updaten' });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
     try {
        const id = req.params.id;
        const task = await prisma.task.delete({
            where:
                { id: Number(id) },
        })
       res.status(200).json(task);
    } catch (errors) {
        res.status(500).json({ error: 'kan geen taak verwijderen' });
    }
}