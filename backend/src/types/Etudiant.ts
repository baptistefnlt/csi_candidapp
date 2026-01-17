export interface Etudiant {
    etudiant_id: number;
    utilisateur_id: number;
    nom: string;
    prenom: string;
    formation: string;
    promo: number;
    cv_url?: string;
    en_recherche: boolean;
    profil_visible: boolean;
}
