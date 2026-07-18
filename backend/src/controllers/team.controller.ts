import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeam = async (req: Request, res: Response) => {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined || req.query.q !== undefined;
    const search = String(req.query.q || '').trim();
    const where: any = search ? { OR: [{ nameAr: { contains: search } }, { nameEn: { contains: search } }, { titleAr: { contains: search } }, { titleEn: { contains: search } }] } : {};
    const orderBy = [{ ring: 'asc' as const }, { order: 'asc' as const }];
    if (!hasPagination) return res.json(await prisma.teamMember.findMany({ where, orderBy }));
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const [items, total] = await Promise.all([
      prisma.teamMember.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.teamMember.count({ where }),
    ]);
    res.json({ items, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await prisma.teamMember.create({
      data: req.body,
    });
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await prisma.teamMember.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    await prisma.teamMember.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
