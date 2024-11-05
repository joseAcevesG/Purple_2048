import { Router } from 'express';

const router = Router();

//GET para obtener todos los usuarios
router.get('/', (req, res) => {});

//GET para mostrat los mejores
router.get('/bestScores', (req, res) => {});
router.get('saveGames', (req, res) => {});
router.get('leaders', (req, res) => {});

//PUT para modificar usuarios
router.put('/', (req, res) => {});
//DELETE para borrar un usuario
router.delete('/', (req, res) => {});

export default router;
