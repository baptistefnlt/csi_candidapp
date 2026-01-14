import { Router } from 'express';
import * as secCtrl from '../controllers/secretaireController';
import * as congeCtrl from '../controllers/congeSecretaireController';

const router = Router();

// ==================== DASHBOARD SECRÉTAIRE ====================
router.get('/stats', secCtrl.getDashboardStats);

// ==================== ATTESTATIONS RC (100% via vues) ====================
// Liste (EN_ATTENTE)
router.get('/attestations', secCtrl.getAttestationsAValider);

// Valider / Refuser (action via vue + trigger)
router.post('/attestations/:etudiantId/valider', secCtrl.validerAttestationRC);
router.post('/attestations/:etudiantId/refuser', secCtrl.refuserAttestationRC);

// ==================== GESTION DES ÉTUDIANTS ====================
router.get('/etudiants', secCtrl.listerEtudiants);
router.post('/etudiants', secCtrl.creerEtudiant);

// ==================== CONGÉS (NOUVEAU) ====================
router.get('/conges/remplacants', congeCtrl.listRemplacants);
router.get('/conges', congeCtrl.getMesConges);
router.post('/conges', congeCtrl.declarerConge);

// ==================== PROFIL SECRÉTAIRE ====================
router.get('/profil', secCtrl.getProfilSecretaire);


export default router;
