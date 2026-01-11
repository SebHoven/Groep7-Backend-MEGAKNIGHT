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
            include: {
                tasksteps: true,
                taskstudent: {
                    include: { student: true }
                }
            }
        });
        res.status(200).json(tasks);
    } catch (errors) {
        res.status(500).json({ error: 'kan je taak niet vinden' })
    }
}

export const createTask = async (req: Request, res: Response) => {
    const taskName = req.body.name;
    console.log(`Creating task ${req.body}`);
    
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
                // Create TaskStudent relationships for assigned students
                taskstudent: req.body.assignees && req.body.assignees.length > 0 ? {
                    create: req.body.assignees.map((studentId: number) => ({
                        studentId: Number(studentId)
                    }))
                } : undefined
            },
            include: {
                tasksteps: true,
                taskstudent: {
                    include: { student: true }
                }
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
        
        // If assignees are provided, update the TaskStudent relationships
        if (req.body.assignees !== undefined) {
            // Delete existing TaskStudent relationships
            await prisma.taskStudent.deleteMany({
                where: { taskId: Number(id) }
            });
            
            // Create new TaskStudent relationships
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
                taskstudent: {
                    include: { student: true }
                }
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
        
        // Delete TaskStudent relationships first (if cascade is not set)
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
        return;
    } catch (error) {
        res.status(500).json({ error: 'kan taskstep niet updaten' });
        return;
    }
}

export const completeTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        // Update task to completed
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: { completed: true },
            include: {
                taskstudent: {
                    include: { student: true }
                }
            }
        });
        
        // Get students assigned to the task
        const students = task.taskstudent.map(ts => ts.student);
        
        // Update battlepass progress for each assigned student
        for (const student of students) {
            // Find the student's active battlepass progress
            const progress = await prisma.battlepassProgress.findFirst({
                where: { 
                    studentId: student.id,
                    battlepassId: 1 // You may want to make this dynamic
                }
            });
            
            if (progress) {
                let newXp = progress.xp + (task.xp || 0);
                let newLevel = progress.level;
                
                // Level up logic (300 XP per level)
                while (newXp >= 300) {
                    newXp -= 300;
                    newLevel += 1;
                }
                
                await prisma.battlepassProgress.update({
                    where: { id: progress.id },
                    data: { xp: newXp, level: newLevel }
                });
            } else {
                // Create new progress if doesn't exist
                await prisma.battlepassProgress.create({
                    data: {
                        studentId: student.id,
                        battlepassId: 1, // You may want to make this dynamic
                        xp: task.xp || 0,
                        level: 1
                    }
                });
            }
        }
        
        res.status(200).json(task);
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'kan taak niet voltooien' });
    }
}

/**
 * Assign students to an existing task
 */
export const assignStudentsToTask = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const { studentIds } = req.body; // Expecting array of student IDs
        
        if (!studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ error: 'studentIds array is required' });
        }
        
        // Create TaskStudent relationships
        await prisma.taskStudent.createMany({
            data: studentIds.map((studentId: number) => ({
                taskId: taskId,
                studentId: Number(studentId)
            })),
            skipDuplicates: true // Skip if relationship already exists
        });
        
        // Return updated task with students
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                taskstudent: {
                    include: { student: true }
                }
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

/**
 * Remove a student from a task
 */
export const removeStudentFromTask = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const studentId = parseInt(req.params.studentId);
        
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