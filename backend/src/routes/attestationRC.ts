import express from 'express';
import {
    getMyAttestationRCHandler,
    deposerAttestationRCHandler
} from '../controllers/attestationRCController';

const router = express.Router();

// POST /api/attestation-rc/me
router.post('/me', getMyAttestationRCHandler);

// POST /api/attestation-rc/deposer
router.post('/deposer', deposerAttestationRCHandler);

export default router;