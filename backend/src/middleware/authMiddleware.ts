import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Assure-toi d'avoir installé: npm install jsonwebtoken @types/jsonwebtoken

// Clé secrète (devrait être dans ton .env idéalement)
const JWT_SECRET = process.env.JWT_SECRET || 'TON_SECRET_TEMPORAIRE';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    // Le format est souvent "Bearer LE_TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Format de token invalide." });
    }

    try {
        // 2. Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Ajouter l'info utilisateur à la requête pour que les controllers puissent l'utiliser
        (req as any).user = decoded; 
        
        next(); // On passe à la suite (le controller)
    } catch (error) {
        res.status(403).json({ error: "Token invalide ou expiré." });
    }
};