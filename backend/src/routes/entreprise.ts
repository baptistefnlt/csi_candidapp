import { Router } from 'express';
// ATTENTION : On change l'import ici !
// On n'importe plus 'authenticate' depuis authService, mais 'authMiddleware' depuis middleware
import { authMiddleware } from '../middleware/authMiddleware'; 
import * as entCtrl from '../controllers/entrepriseController';

const router = Router();

// Middleware : On protège toutes les routes avec notre nouveau middleware
// C'est lui qui a la bonne signature (req, res, next)
router.use(authMiddleware);

// 1. Dashboard KPIs
router.get('/stats', entCtrl.getStats);

// 2. Liste des offres de l'entreprise
router.get('/mes-offres', entCtrl.getMesOffres);

// 3. Liste des candidatures
router.get('/candidatures', entCtrl.getCandidaturesRecues);

// 4. Action de décision (Accepter/Refuser)
router.post('/candidature/decision', entCtrl.deciderCandidature);

export default router;