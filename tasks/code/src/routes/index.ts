import Express, { Router } from 'express';
import cors from 'cors';
import * as tasksController from '../controllers/tasksController.js'; // Remove .ts extension

const router: Router = Express.Router();

router.get('/tasks', cors(), tasksController.getAllTasks);
router.get('/tasks/:id', cors(), tasksController.getTaskById);
router.post('/tasks', cors(), tasksController.createTask);
router.put('/tasks/:id', cors(), tasksController.updateTask);
router.delete('/tasks/:id', cors(), tasksController.deleteTask);
router.patch('/tasks/:taskId/steps/:stepId/toggle', cors(), tasksController.toggleTaskStep);
router.post('/tasks/:id/complete', cors(), tasksController.completeTask);
router.post('/tasks/:id/assign', cors(), tasksController.assignStudentsToTask);
router.delete('/tasks/:taskId/students/:studentId', cors(), tasksController.removeStudentFromTask);

export default router;