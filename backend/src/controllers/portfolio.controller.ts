import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where = category ? { category: String(category) } : {};
    const items = await prisma.portfolio.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const item = await prisma.portfolio.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const item = await prisma.portfolio.create({ data });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const item = await prisma.portfolio.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await prisma.portfolio.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
