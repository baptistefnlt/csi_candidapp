import { Request, Response } from 'express';
import { query } from '../config/db';

// même logique que dans secretaireController
function getUserIdFromReq(req: Request): number | null {
  const q = req.query.userId;
  if (q && !Array.isArray(q) && !isNaN(Number(q))) return Number(q);

  const b = (req.body as any)?.userId;
  if (b !== undefined && !isNaN(Number(b))) return Number(b);

  return null;
}

// STRICT : seul un VRAI secrétaire peut déclarer son congé
async function getSecretaireIdStrict(userId: number): Promise<number | null> {
  const r = await query(
    'SELECT secretaire_id FROM public.v_secretaire_by_user WHERE utilisateur_id = $1 LIMIT 1',
    [userId]
  );
  return r.rows[0]?.secretaire_id ?? null;
}

// GET /api/dashboard/secretaire/conges/remplacants?userId=...
export async function listRemplacants(req: Request, res: Response) {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ ok: false, error: 'userId manquant' });

    const secretaireId = await getSecretaireIdStrict(userId);
    if (!secretaireId) return res.status(403).json({ ok: false, error: 'Accès réservé secrétaire' });

    const r = await query(
      `SELECT utilisateur_id, nom, email
       FROM public.v_liste_enseignants
       ORDER BY nom`
    );

    return res.json({ ok: true, remplacants: r.rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Erreur liste remplacants' });
  }
}

// GET /api/dashboard/secretaire/conges?userId=...
export async function getMesConges(req: Request, res: Response) {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ ok: false, error: 'userId manquant' });

    const secretaireId = await getSecretaireIdStrict(userId);
    if (!secretaireId) return res.status(403).json({ ok: false, error: 'Accès réservé secrétaire' });

    const r = await query(
      `SELECT conge_id, date_debut, date_fin, motif, annule, created_at,
              remplacant_utilisateur_id, remplacant_nom, remplacant_email
       FROM public.v_mes_conges_secretaire
       WHERE utilisateur_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json({ ok: true, conges: r.rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Erreur mes congés' });
  }
}

// POST /api/dashboard/secretaire/conges?userId=...
export async function declarerConge(req: Request, res: Response) {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ ok: false, error: 'userId manquant' });

    const secretaireId = await getSecretaireIdStrict(userId);
    if (!secretaireId) return res.status(403).json({ ok: false, error: 'Accès réservé secrétaire' });

    const { dateDebut, dateFin, remplacantUtilisateurId, motif } = req.body || {};
    if (!dateDebut || !dateFin) {
      return res.status(400).json({ ok: false, error: 'dateDebut et dateFin requis' });
    }

    const r = await query(
      `INSERT INTO public.v_action_declarer_conge_secretaire
         (secretaire_id, date_debut, date_fin, remplacant_utilisateur_id, motif)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING conge_id`,
      [secretaireId, dateDebut, dateFin, remplacantUtilisateurId ?? null, motif ?? null]
    );

    return res.status(201).json({ ok: true, congeId: r.rows[0]?.conge_id });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ ok: false, error: e?.message || 'Erreur déclaration congé' });
  }
}
