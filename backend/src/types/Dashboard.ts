// Types pour les dashboards

export interface DashboardEnseignantStats {
    offres_a_valider: number;
    affectations_en_attente: number;
    alertes_conformite: number;
}

export interface DashboardSecretaireStats {
    nb_etudiants_total: number;
    nb_etudiants_en_recherche: number;
    nb_attestations_a_valider: number;
    nb_stages_actes: number;
    nb_entreprises_partenaires: number;
}
