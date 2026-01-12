import { OffreType } from "../enums/OffreType";

// Corresponds à la vue v_referentiel_legal
export interface RegleLegale {
    regle_id: number;
    pays: string;
    type_contrat: OffreType;
    remuneration_min: number;
    unite: string;
    duree_min_mois?: number;
    duree_max_mois?: number;
    date_effet: Date;
}
