import Express, { Router } from 'express';
import mapRoutes from './maps.js';

const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.use('/maps', mapRoutes);

export default router;