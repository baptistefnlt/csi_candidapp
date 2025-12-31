import express from 'express';
import path from 'path';
import { query } from './config/db';
import utilisateurRoutes from './routes/utilisateur';
import authRoutes from './routes/auth';
import offreRoutes from './routes/offre';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// API mount
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/offres', offreRoutes);

// Route POST /api/candidatures - Postuler à une offre
app.post('/api/candidatures', async (req, res) => {
    const { offre_id } = req.body;

    if (!offre_id) {
        return res.status(400).json({ ok: false, error: 'offre_id est requis' });
    }

    try {
        // Insertion "write-only" - SANS clause RETURNING
        await query(
            'INSERT INTO v_action_postuler (offre_id, etudiant_id, source) VALUES ($1, $2, $3)',
            [offre_id, 1, 'Plateforme Web']
        );

        // Si aucune erreur, c'est un succès
        return res.status(200).json({ ok: true, message: 'Candidature envoyée avec succès' });

    } catch (error: any) {
        console.error('Erreur lors de la candidature:', error);

        // Détection d'erreur de duplicata (déjà postulé)
        if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
            return res.status(409).json({ ok: false, error: 'Vous avez déjà postulé à cette offre' });
        }

        // Autres erreurs
        return res.status(500).json({ ok: false, error: 'Erreur lors de la candidature' });
    }
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'accueil.html'));
});

app.get('/login', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'login.html'));
});

app.get('/profile', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'profile.html'));
});

app.get('/offres', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'offres.html'));
});

app.get('/offres/:id', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'offre-details.html'));
});

// Serve frontend static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '..', '..', 'frontend'), { index: false }));

async function start() {
    try {
        const result = await query('SELECT NOW() AS now');
        console.log('DB OK:', result.rows[0]);
    } catch (err) {
        console.error('DB ERROR:', err);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

start();
