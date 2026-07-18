import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    const result: Record<string, string> = {};
    settings.forEach((s) => { result[s.key] = s.value; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
    if (!setting) return res.status(404).json({ message: 'Not found' });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value: req.body.value },
      create: { key: req.params.key, value: req.body.value },
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
