import Express, { Router } from 'express';
import { getTeachers} from '../controllers/groupsController.js';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/tasksController.ts';
const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/teachers', getTeachers);

router.get('/tasks/:id', getTaskById);
router.get('/tasks', getAllTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;