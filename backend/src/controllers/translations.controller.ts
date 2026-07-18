import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (_req: Request, res: Response) => {
  try {
    const translations = await prisma.translation.findMany();
    const result: Record<string, { ar: string; en: string }> = {};
    translations.forEach((t) => { result[t.key] = { ar: t.ar, en: t.en }; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const t = await prisma.translation.findUnique({ where: { key: req.params.key } });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const t = await prisma.translation.upsert({
      where: { key: req.params.key },
      update: { ar: req.body.ar, en: req.body.en },
      create: { key: req.params.key, ar: req.body.ar, en: req.body.en },
    });
    res.json(t);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
