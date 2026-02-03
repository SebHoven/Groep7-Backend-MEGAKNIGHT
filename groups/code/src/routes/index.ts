import Express, { Router } from 'express';
import { getUnassignedStudents, getAllGroups, getGroupById, getGroupStudents, getGroupsByTeacher, createGroup, updateGroup, deleteGroup, addStudentToGroup, removeStudentFromGroup} from '../controllers/groupsController.js';
import cors from 'cors';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import mapRoutes from './maps.js';

const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/groups', cors(), getAllGroups);
router.get('/groups/:id', cors(), getGroupById);
router.get('/studentsUa', cors(), getUnassignedStudents);
router.get('/groups/:id/students', cors(), getGroupStudents);
router.get('/groups/teacher/:teacherId', cors(), getGroupsByTeacher);
router.post('/groups', cors(), createGroup);
router.put('/groups/:id', cors(), updateGroup);
router.delete('/groups/:id', cors(), deleteGroup);  
router.post('/groups/:groupId/students/:studentId', cors(), addStudentToGroup);
router.delete('/groups/:groupId/students/:studentId', cors(), removeStudentFromGroup);

router.get('/leaderboard', cors(), getLeaderboard);

router.post('/login', cors(), loginController.login);
router.post('/logout', cors(), loginController.logout);
router.get('/verify', cors(), loginController.verifyToken);
router.post('/register', cors(), registerController.register);

router.use('/maps', mapRoutes);

export default router;