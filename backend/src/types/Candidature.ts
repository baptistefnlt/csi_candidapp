import { StatutCandidature } from "../enums/StatutCandidature";

export interface Candidature {
    id: number;
    offre_id: number;
    etudiant_id: number;
    date_candidature: Date;
    source?: string;
    statut: StatutCandidature;
}

// Corresponds à la vue v_mes_candidatures_etudiant
export interface MesCandidatures {
    candidature_id: number;
    date_candidature: string;
    statut_candidature: string;
    offre_titre: string;
    entreprise_nom: string;
    entreprise_ville: string;
    statut_actuel_offre: string;
}
