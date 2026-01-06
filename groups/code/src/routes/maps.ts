import { Router } from 'express';
import { upload } from '../middleware/multer.js';
import {
  uploadMap,
  getLatestMap,
  updateMapState
} from '../controllers/mapsController.js';

const router = Router();

router.post('/', upload.single('file'), uploadMap);
router.get('/latest', getLatestMap);
router.post('/state', updateMapState);

export default router;

