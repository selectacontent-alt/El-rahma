import { Router } from 'express';
import {
  getNewsArticleBySlug,
  getNewsCategoryArticles,
  getNewsHome,
  subscribeNewsletter,
} from '../controllers/news.public.controller';

const router = Router();

router.get('/home', getNewsHome);
router.get('/articles/:slug', getNewsArticleBySlug);
router.get('/categories/:slug/articles', getNewsCategoryArticles);
router.post('/newsletter', subscribeNewsletter);

export default router;
