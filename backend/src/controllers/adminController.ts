import { Request, Response } from 'express';
import { query } from '../config/db';

// ==================== ARCHIVAGE ANNUEL ====================

/**
 * POST /api/admin/archivage
 * Lance l'archivage annuel (non implémenté pour le moment)
 */
export const lancerArchivageAnnuel = async (_req: Request, res: Response) => {
    // TODO: Implémenter l'archivage annuel via v_action_archivage_annuel
    return res.status(200).json({
        ok: true,
        message: 'Fonctionnalité d\'archivage non implémentée pour le moment',
        details: {
            offres_archivees: 0,
            candidatures_archivees: 0,
            attestations_archivees: 0,
            utilisateurs_desactives: 0
        }
    });
};

// ==================== GESTION DES GROUPES ====================

/**
 * GET /api/admin/groupes
 * Récupère la liste des groupes via une vue
 */
export const getGroupes = async (_req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT * FROM v_admin_groupes
            ORDER BY annee_scolaire DESC, nom_groupe
        `);

        return res.status(200).json({
            ok: true,
            groupes: result.rows
        });
    } catch (error: any) {
        console.error('Erreur lors de la récupération des groupes:', error);
        return res.status(500).json({
            ok: false,
            error: 'Erreur lors de la récupération des groupes'
        });
    }
};

/**
 * GET /api/admin/enseignants
 * Récupère la liste des enseignants via une vue
 */
export const getEnseignants = async (_req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT * FROM v_admin_enseignants
            ORDER BY nom, email
        `);

        return res.status(200).json({
            ok: true,
            enseignants: result.rows
        });
    } catch (error: any) {
        console.error('Erreur lors de la récupération des enseignants:', error);
        return res.status(500).json({
            ok: false,
            error: 'Erreur lors de la récupération des enseignants'
        });
    }
};

/**
 * GET /api/admin/secretaires
 * Récupère la liste des secrétaires via une vue
 */
export const getSecretaires = async (_req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT * FROM v_admin_secretaires
            ORDER BY nom, email
        `);

        return res.status(200).json({
            ok: true,
            secretaires: result.rows
        });
    } catch (error: any) {
        console.error('Erreur lors de la récupération des secrétaires:', error);
        return res.status(500).json({
            ok: false,
            error: 'Erreur lors de la récupération des secrétaires'
        });
    }
};

/**
 * POST /api/admin/groupes
 * Créer un nouveau groupe via une vue action
 */
export const createGroupe = async (req: Request, res: Response) => {
    const { nom_groupe, annee_scolaire, enseignant_id, secretaire_id } = req.body;

    if (!nom_groupe || !annee_scolaire || !enseignant_id || !secretaire_id) {
        return res.status(400).json({
            ok: false,
            error: 'Tous les champs sont requis (nom_groupe, annee_scolaire, enseignant_id, secretaire_id)'
        });
    }

    try {
        const result = await query(`
            INSERT INTO v_action_creer_groupe (nom_groupe, annee_scolaire, enseignant_id, secretaire_id)
            VALUES ($1, $2, $3, $4)
            RETURNING groupe_id_created
        `, [nom_groupe, parseInt(annee_scolaire, 10), parseInt(enseignant_id, 10), parseInt(secretaire_id, 10)]);

        return res.status(201).json({
            ok: true,
            message: 'Groupe créé avec succès',
            groupe_id: result.rows[0].groupe_id_created
        });
    } catch (error: any) {
        console.error('Erreur lors de la création du groupe:', error);

        if (error.message?.includes('Enseignant') || error.message?.includes('Secrétaire')) {
            return res.status(400).json({
                ok: false,
                error: error.message
            });
        }

        return res.status(500).json({
            ok: false,
            error: 'Erreur lors de la création du groupe'
        });
    }
};

/**
 * PUT /api/admin/groupes/:id
 * Modifier un groupe existant via une vue action
 */
export const updateGroupe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom_groupe, annee_scolaire, enseignant_id, secretaire_id } = req.body;

    if (!nom_groupe || !annee_scolaire || !enseignant_id || !secretaire_id) {
        return res.status(400).json({
            ok: false,
            error: 'Tous les champs sont requis'
        });
    }

    try {
        const result = await query(`
            UPDATE v_action_modifier_groupe
            SET nom_groupe = $1, annee_scolaire = $2, enseignant_id = $3, secretaire_id = $4
            WHERE groupe_id = $5
            RETURNING groupe_id
        `, [nom_groupe, parseInt(annee_scolaire, 10), parseInt(enseignant_id, 10), parseInt(secretaire_id, 10), parseInt(id as string, 10)]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: 'Groupe non trouvé'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Groupe mis à jour avec succès'
        });
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour du groupe:', error);
        return res.status(500).json({
            ok: false,
            error: error.message || 'Erreur lors de la mise à jour du groupe'
        });
    }
};

/**
 * DELETE /api/admin/groupes/:id
 * Supprimer un groupe via une vue action
 */
export const deleteGroupe = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await query(`
            DELETE FROM v_action_supprimer_groupe
            WHERE groupe_id = $1
            RETURNING groupe_id
        `, [parseInt(id as string, 10)]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: 'Groupe non trouvé'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Groupe supprimé avec succès'
        });
    } catch (error: any) {
        console.error('Erreur lors de la suppression du groupe:', error);

        if (error.message?.includes('étudiants')) {
            return res.status(400).json({
                ok: false,
                error: error.message
            });
        }

        return res.status(500).json({
            ok: false,
            error: 'Erreur lors de la suppression du groupe'
        });
    }
};

// ==================== STATISTIQUES ADMIN ====================

/**
 * GET /api/admin/stats
 * Récupère les statistiques globales via une vue
 */
export const getAdminStats = async (_req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM v_admin_stats');

        return res.status(200).json({
            ok: true,
            stats: result.rows[0]
        });
    } catch (error: any) {
        console.error('Erreur lors de la récupération des stats admin:', error);
        return res.status(500).json({
            ok: false,
            error: 'Erreur lors de la récupération des statistiques'
        });
    }
};

// ==================== CRÉATION DE COMPTES ====================

/**
 * POST /api/admin/enseignants
 * Créer un nouveau compte enseignant via une vue action
 */
export const createEnseignant = async (req: Request, res: Response) => {
    const { email, password, nom } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            error: 'Email et mot de passe sont requis'
        });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            ok: false,
            error: 'Format d\'email invalide'
        });
    }

    // Validation mot de passe (minimum 6 caractères)
    if (password.length < 6) {
        return res.status(400).json({
            ok: false,
            error: 'Le mot de passe doit contenir au moins 6 caractères'
        });
    }

    try {
        // Hacher le mot de passe
        const bcryptModule: any = await import('bcrypt');
        const bcrypt = bcryptModule.default || bcryptModule;
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await query(`
            INSERT INTO v_action_creer_enseignant (email, password_hash, nom)
            VALUES ($1, $2, $3)
            RETURNING utilisateur_id_created, enseignant_id_created
        `, [email, passwordHash, nom || null]);

        return res.status(201).json({
            ok: true,
            message: 'Enseignant créé avec succès',
            utilisateur_id: result.rows[0].utilisateur_id_created,
            enseignant_id: result.rows[0].enseignant_id_created
        });
    } catch (error: any) {
        console.error('Erreur lors de la création de l\'enseignant:', error);

        if (error.message?.includes('Email déjà utilisé')) {
            return res.status(409).json({
                ok: false,
                error: 'Cet email est déjà utilisé'
            });
        }

        return res.status(500).json({
            ok: false,
            error: error.message || 'Erreur lors de la création de l\'enseignant'
        });
    }
};

/**
 * POST /api/admin/secretaires
 * Créer un nouveau compte secrétaire via une vue action
 */
export const createSecretaire = async (req: Request, res: Response) => {
    const { email, password, nom } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            error: 'Email et mot de passe sont requis'
        });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            ok: false,
            error: 'Format d\'email invalide'
        });
    }

    // Validation mot de passe (minimum 6 caractères)
    if (password.length < 6) {
        return res.status(400).json({
            ok: false,
            error: 'Le mot de passe doit contenir au moins 6 caractères'
        });
    }

    try {
        // Hacher le mot de passe
        const bcryptModule: any = await import('bcrypt');
        const bcrypt = bcryptModule.default || bcryptModule;
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await query(`
            INSERT INTO v_action_creer_secretaire (email, password_hash, nom)
            VALUES ($1, $2, $3)
            RETURNING utilisateur_id_created, secretaire_id_created
        `, [email, passwordHash, nom || null]);

        return res.status(201).json({
            ok: true,
            message: 'Secrétaire créé(e) avec succès',
            utilisateur_id: result.rows[0].utilisateur_id_created,
            secretaire_id: result.rows[0].secretaire_id_created
        });
    } catch (error: any) {
        console.error('Erreur lors de la création de la secrétaire:', error);

        if (error.message?.includes('Email déjà utilisé')) {
            return res.status(409).json({
                ok: false,
                error: 'Cet email est déjà utilisé'
            });
        }

        return res.status(500).json({
            ok: false,
            error: error.message || 'Erreur lors de la création de la secrétaire'
        });
    }
};

