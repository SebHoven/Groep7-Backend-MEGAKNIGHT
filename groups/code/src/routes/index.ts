import Express, { Router } from 'express';
import { getTeachers} from '../controllers/groupsController.js';
import cors from 'cors';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/tasksController.ts';

const router: Router = Express.Router();


// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/teachers', cors(), getTeachers);

router.get('/tasks/:id', cors(), getTaskById);
router.get('/tasks', cors(), getAllTasks);
router.post('/tasks', cors(), createTask);
router.put('/tasks/:id', cors(), updateTask);
router.delete('/tasks/:id', cors(), deleteTask);

export default router;