import { Request, Response } from 'express';
import { query } from '../config/db';

/**
 * Postuler à une offre
 * @route POST /api/candidatures
 */
export async function postulerHandler(req: Request, res: Response) {
    const { offre_id, userId } = req.body;

    if (!offre_id) {
        return res.status(400).json({ ok: false, error: 'offre_id est requis' });
    }

    if (!userId) {
        return res.status(400).json({ ok: false, error: 'userId requis' });
    }

    try {
        // ⚠️ Note : ici tu utilises userId comme etudiant_id (comme dans ton server.ts actuel)
        await query(
            'INSERT INTO v_action_postuler (offre_id, etudiant_id, source) VALUES ($1, $2, $3)',
            [offre_id, userId, 'Plateforme Web']
        );

        return res.status(200).json({ ok: true, message: 'Candidature envoyée avec succès' });
    } catch (error: any) {
        console.error('Erreur lors de la candidature:', error);

        // Détection d'erreur de duplicata / règle métier
        if (
            error.code === '23505' ||
            error.message?.includes('duplicate') ||
            error.message?.includes('unique') ||
            error.message?.includes('active') ||
            error.message?.includes('déjà')
        ) {
            return res.status(409).json({
                ok: false,
                error: 'Vous avez déjà une candidature active pour cette offre'
            });
        }

        return res.status(500).json({ ok: false, error: 'Erreur lors de la candidature' });
    }
}

/**
 * Récupérer les candidatures de l'étudiant
 * @route POST /api/candidatures/me
 */
export async function getMesCandidaturesHandler(req: Request, res: Response) {
    const userId = Number(req.body?.userId || req.query?.userId);
    const role = req.body?.role;

    if (!userId || role !== 'ETUDIANT') {
        return res.status(403).json({ ok: false });
    }

    const result = await query(
        `SELECT candidature_id, date_candidature, statut_candidature,
            offre_titre, entreprise_nom, entreprise_ville, statut_actuel_offre
     FROM v_mes_candidatures_etudiant
     WHERE utilisateur_id = $1
     ORDER BY date_candidature DESC`,
        [userId]
    );

    res.json({ ok: true, candidatures: result.rows });
}

/**
 * Annuler une candidature
 * @route POST /api/candidatures/:id/annuler
 */
export async function annulerCandidatureHandler(req: Request, res: Response) {
    const candidatureId = Number(req.params.id);
    const userId = Number(req.body.userId);

    if (!candidatureId || !userId) {
        return res.status(400).json({ ok: false });
    }

    await query(
        `UPDATE v_action_annuler_candidature
     SET statut = 'ANNULE'
     WHERE candidature_id = $1 AND etudiant_id = $2`,
        [candidatureId, userId]
    );

    res.json({ ok: true });
}