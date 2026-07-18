import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import teamRoutes from './routes/team.routes';
import servicesRoutes from './routes/services.routes';
import portfolioRoutes from './routes/portfolio.routes';
import testimonialsRoutes from './routes/testimonials.routes';
import contactsRoutes from './routes/contacts.routes';
import settingsRoutes from './routes/settings.routes';
import translationsRoutes from './routes/translations.routes';
import partnersRoutes from './routes/partners.routes';
import adminRoutes from './routes/admin.routes';
import siteRoutes from './routes/site.routes';
import newsPublicRoutes from './routes/news.public.routes';
import { authenticate, adminOnly } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/translations', translationsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/news', newsPublicRoutes);
app.use('/api/admin/team', authenticate, adminOnly, teamRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
