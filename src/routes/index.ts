import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import auth from './auth';
import navigate from './navigate';
import user from './user';

const router = Router();

router.use('/auth', auth);
// router.use('/', navigate);
router.use('/user', authMiddleware, user);

router.get('/', (req, res) => {
	res.send('UWU');
});

export default router;
