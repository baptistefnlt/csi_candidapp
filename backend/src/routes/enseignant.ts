import { Router } from 'express';
import {
    getReferentielLegal,
    createRegleLegale,
    updateRegleLegale,
    deleteRegleLegale,
    getDashboardStats,
    getOffresConformite,
    reviewOffre,
    getArchivesStages,
    getDelegationSecretaireActive
} from '../controllers/enseignantController';

const router = Router();

// ==================== RÉFÉRENTIEL LÉGAL (CRUD) ====================
router.get('/referentiel', getReferentielLegal);
router.post('/referentiel', createRegleLegale);
router.put('/referentiel/:id', updateRegleLegale);
router.delete('/referentiel/:id', deleteRegleLegale);

// ==================== DASHBOARD ====================
router.get('/stats', getDashboardStats);
router.get('/offres-conformite', getOffresConformite);
router.post('/offres/:id/review', reviewOffre);

// ==================== ARCHIVES ====================
router.get('/archives', getArchivesStages);

// ==================== DÉLÉGATION SECRÉTAIRE ====================
router.get('/delegation/secretaire', getDelegationSecretaireActive);

export default router;
