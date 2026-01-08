export interface JournalEvenement {
    id: number;
    utilisateur_id?: number;
    type: string;
    payload: any;
    date_evenement: Date;
}
