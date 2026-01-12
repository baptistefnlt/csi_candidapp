export interface Entreprise {
    entreprise_id: number;
    utilisateur_id: number;
    raison_sociale: string;
    siret?: string;
    pays: string;
    ville?: string;
    adresse?: string;
    site_web?: string;
    contact_nom?: string;
    contact_email?: string;
}
