import { Request, Response } from 'express';
import { query } from '../config/db';

// Helper pour trouver l'ID Entreprise via l'ID User (Token)
async function getEntrepriseIdFromUser(userId: number): Promise<number | null> {
    const res = await query(
        'SELECT entreprise_id FROM "Entreprise" WHERE utilisateur_id = $1',
        [userId]
    );
    return res.rows.length > 0 ? res.rows[0].entreprise_id : null;
}

// 1. STATS (Celle qui manquait)
export const getStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const entrepriseId = await getEntrepriseIdFromUser(userId);
        if (!entrepriseId) return res.status(403).json({ error: "Profil introuvable" });

        // Calcul des stats SQL
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM "Offre" WHERE entreprise_id = $1 AND (statut_validation = 'VALIDE' OR statut_validation = 'VALIDEE')) as active,
                (SELECT COUNT(*) FROM "Offre" WHERE entreprise_id = $1 AND statut_validation = 'EN_ATTENTE') as pending,
                (SELECT COUNT(*) FROM "Candidature" c JOIN "Offre" o ON c.offre_id = o.id WHERE o.entreprise_id = $1) as candidatures
        `;
        const result = await query(sql, [entrepriseId]);
        
        // Conversion en nombres pour le JSON
        const row = result.rows[0];
        const stats = {
            active: parseInt(row.active),
            pending: parseInt(row.pending),
            candidatures: parseInt(row.candidatures)
        };

        res.json({ ok: true, stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur stats" });
    }
};

// 2. MES OFFRES
export const getMesOffres = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const entrepriseId = await getEntrepriseIdFromUser(userId);
        if (!entrepriseId) return res.status(403).json({ error: "Profil introuvable" });

        // Récupère les offres + nb candidats
        const sql = `
            SELECT o.*, COUNT(c.id) as nb_candidats
            FROM "Offre" o
            LEFT JOIN "Candidature" c ON c.offre_id = o.id
            WHERE o.entreprise_id = $1
            GROUP BY o.id
            ORDER BY o.date_soumission DESC
        `;
        const result = await query(sql, [entrepriseId]);
        res.status(200).json({ ok: true, offres: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur offres" });
    }
};

// 3. CANDIDATURES
export const getCandidaturesRecues = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const entrepriseId = await getEntrepriseIdFromUser(userId);
        if (!entrepriseId) return res.status(403).json({ error: "Profil introuvable" });

        const sql = `
            SELECT c.id as candidature_id, c.statut, c.date_candidature,
                   o.titre as offre_titre, 
                   e.nom, e.prenom, e.cv_url, e.formation
            FROM "Candidature" c
            JOIN "Offre" o ON c.offre_id = o.id
            JOIN "Etudiant" e ON c.etudiant_id = e.etudiant_id
            WHERE o.entreprise_id = $1
            ORDER BY c.date_candidature DESC
        `;
        const result = await query(sql, [entrepriseId]);
        res.status(200).json({ ok: true, candidatures: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur candidatures" });
    }
};

// 4. DECISION
export const deciderCandidature = async (req: Request, res: Response) => {
    try {
        const { candidatureId, decision } = req.body; 
        const sql = `UPDATE "Candidature" SET statut = $1 WHERE id = $2 RETURNING *`;
        const result = await query(sql, [decision, candidatureId]);

        if (result.rowCount === 0) return res.status(404).json({ error: "Introuvable" });

        res.status(200).json({ ok: true, message: `Candidature ${decision}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur décision" });
    }
};