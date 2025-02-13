import { Router } from 'express';
import userControllers from '../controllers/user-controllers';

const router = Router();

//POST para login
router.post('/login', userControllers.logIn);
//POST para Register
router.post('/register', userControllers.signUp);

export default router;
