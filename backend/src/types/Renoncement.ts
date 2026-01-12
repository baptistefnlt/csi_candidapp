import { RenoncementType } from "../enums/RenoncementType";

export interface Renoncement {
    id: number;
    candidature_id: number;
    type: RenoncementType;
    date_renoncement: Date;
    justification?: string;
    date_validation?: Date;
}
