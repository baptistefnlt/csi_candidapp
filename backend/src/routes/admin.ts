import { Router } from 'express';
import {
    lancerArchivageAnnuel,
    getGroupes,
    getEnseignants,
    getSecretaires,
    createGroupe,
    updateGroupe,
    deleteGroupe,
    getAdminStats,
    createEnseignant,
    createSecretaire
} from '../controllers/adminController';

const router = Router();

// Statistiques admin
router.get('/stats', getAdminStats);

// Archivage annuel
router.post('/archivage', lancerArchivageAnnuel);

// Gestion des groupes
router.get('/groupes', getGroupes);
router.post('/groupes', createGroupe);
router.put('/groupes/:id', updateGroupe);
router.delete('/groupes/:id', deleteGroupe);

// Gestion des enseignants
router.get('/enseignants', getEnseignants);
router.post('/enseignants', createEnseignant);

// Gestion des secrétaires
router.get('/secretaires', getSecretaires);
router.post('/secretaires', createSecretaire);

export default router;

