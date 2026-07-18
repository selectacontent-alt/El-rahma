import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const partnerSchema = z.object({
  name: z.string().trim().min(1, 'Partner name is required'),
  logoUrl: z.string().trim().min(1, 'Partner logo is required'),
  order: z.coerce.number().int().default(0),
});

export const getAll = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.partner.findMany({ orderBy: { order: 'asc' } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const input = { ...req.body };
    if (req.file) input.logoUrl = `/uploads/${req.file.filename}`;
    const data = partnerSchema.parse(input);
    const item = await prisma.partner.create({ data });
    res.status(201).json(item);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: 'Invalid partner data', issues: error.issues });
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const input = { ...req.body };
    if (req.file) input.logoUrl = `/uploads/${req.file.filename}`;
    const data = partnerSchema.parse(input);
    const item = await prisma.partner.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(item);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: 'Invalid partner data', issues: error.issues });
    res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await prisma.partner.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
