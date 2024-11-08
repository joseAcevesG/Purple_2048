import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.send('UWU');
});

export default router;
