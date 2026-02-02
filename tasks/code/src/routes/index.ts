import Express, { Router } from 'express';
import cors from 'cors';
import * as tasksController from '../controllers/tasksController.js'; // Remove .ts extension

const router: Router = Express.Router();

router.get('/', cors(), tasksController.getAllTasks);
router.get('/:id', cors(), tasksController.getTaskById);
router.post('/', cors(), tasksController.createTask);
router.put('/:id', cors(), tasksController.updateTask);
router.delete('/:id', cors(), tasksController.deleteTask);
router.patch('/:taskId/steps/:stepId/toggle', cors(), tasksController.toggleTaskStep);
router.post('/:id/complete', cors(), tasksController.completeTask);
router.post('/:id/assign', cors(), tasksController.assignStudentsToTask);
router.delete('/:taskId/students/:studentId', cors(), tasksController.removeStudentFromTask);

export default router;