import { Router } from 'express';
import userControllers from '../controllers/user-controllers';

const router = Router();

// GET user info
router.get('/', userControllers.getUser);

// PUT for modifying users
router.put('/', userControllers.updateUser);

// DELETE for deleting a user
router.delete('/', userControllers.deleteUser);

// GET for showing the best boards of a user
router.get('/bestScores', userControllers.getBestScores);

// PUT for modifying the best boards of a user
router.put('/bestScores', userControllers.updateBestScores);

// GET to get the saved games of a user
router.get('/saveGames', userControllers.getSaveBoards);

// PUT to save a game of a user
router.put('/saveGames', userControllers.saveBoard);

// GET to get the top 5 leaders
router.get('/leaders', userControllers.getLeaders);

export default router;
