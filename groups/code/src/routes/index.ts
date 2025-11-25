import Express, { Router } from 'express';
import { getTeachers} from '../controllers/groupsController.js';
const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/teachers', getTeachers);

export default router;