import Express, { Router } from 'express';
import { getAllGroups, getGroupById, getGroupStudents, getGroupsByTeacher, createGroup, updateGroup, deleteGroup} from '../controllers/groupsController.js';
import cors from 'cors';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/tasksController.ts';
import { LoginController } from '../controllers/loginController.ts';
import { RegisterController } from '../controllers/registerController.ts';

const registerController = new RegisterController();

const loginController = new LoginController();

const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/groups', cors(), getAllGroups);
router.get('/groups/:id', cors(), getGroupById);
router.get('/groups/:id/students', cors(), getGroupStudents);
router.get('/groups/teacher/:teacherId', cors(), getGroupsByTeacher);
router.post('/groups', cors(), createGroup);
router.put('/groups/:id', cors(), updateGroup);
router.delete('/groups/:id', cors(), deleteGroup);

router.get('/tasks/:id', cors(), getTaskById);
router.get('/tasks', cors(), getAllTasks);
router.post('/tasks', cors(), createTask);
router.put('/tasks/:id', cors(), updateTask);
router.delete('/tasks/:id', cors(), deleteTask);

router.post('/login', cors(), loginController.login);
router.post('/logout', cors(), loginController.logout);
router.get('/verify', cors(), loginController.verifyToken);
router.post('/register', cors(), registerController.register);


export default router;