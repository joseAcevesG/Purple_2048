import { Router } from 'express';
import userControllers from '../controllers/user-controllers';

const router = Router();

//GET user info
router.get('/', userControllers.getUser);

//GET para mostrar los mejores boards de un usuario
router.get('/bestScores', (req, res) => {});

//PUT para modificar los mejores boards de un usuario
router.put('/bestScores', (req, res) => {});

//GET para obtener los juegos guardados de un usuario
router.get('saveGames', (req, res) => {});

//PUT para modificar los juegos guardados de un usuario
router.put('saveGames', (req, res) => {});

//GET para obtener los usuarios que han jugado
router.get('leaders', (req, res) => {});

//PUT para modificar usuarios
router.put('/', (req, res) => {});
//DELETE para borrar un usuario
router.delete('/', (req, res) => {});

export default router;
