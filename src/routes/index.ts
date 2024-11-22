import { Router } from 'express';
import auth from './auth';
import user from './user';
import navigate from './navigate';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.use('/auth', auth);
// router.use('/', navigate);
router.use('/user', authMiddleware, user);

router.get('/', (req, res) => {
  res.send('UWU');
});

export default router;
