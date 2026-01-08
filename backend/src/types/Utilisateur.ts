import { Role } from "../enums/Role";

export interface Utilisateur {
    id: number;
    email: string;
    password_hash: string;
    role: Role;
    actif: boolean;
    created_at: Date;
}
