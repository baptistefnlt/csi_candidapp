import express from 'express';
import {
    postulerHandler,
    getMesCandidaturesHandler,
    annulerCandidatureHandler
} from '../controllers/candidatureController';

const router = express.Router();

// POST /api/candidatures
router.post('/', postulerHandler);

// POST /api/candidatures/me
router.post('/me', getMesCandidaturesHandler);

// PATCH /api/candidatures/:id/annuler
router.patch('/:id/annuler', annulerCandidatureHandler);

export default router;