import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// upload map + create Map + MapState
export const uploadMap = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Geen bestand geüpload' });
    }

    const map = await prisma.map.create({
      data: {
        name: req.body.name ?? 'Schoolplein',
        imageUrl: `/uploads/${req.file.filename}`,
        states: {
          create: {
            zoom: 1,
            positionX: 0,
            positionY: 0
          }
        }
      },
      include: {
        states: true
      }
    });

    res.status(200).json(map);
  } catch (err) {
    res.status(500).json({ error: 'Kan map niet opslaan', details: err });
  }
};

// get latest map (reload support)
export const getLatestMap = async (_req: Request, res: Response) => {
  try {
    const map = await prisma.map.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { states: true }
    });

    res.json(map);
  } catch {
    res.status(500).json({ error: 'Kan map niet ophalen' });
  }
};

// update map state
export const updateMapState = async (req: Request, res: Response) => {
  const { mapId, zoom, positionX, positionY } = req.body;

  try {
    const state = await prisma.mapState.upsert({
      where: { mapId: Number(mapId) },
      update: { zoom, positionX, positionY },
      create: {
        mapId: Number(mapId),
        zoom,
        positionX,
        positionY
      }
    });

    res.json(state);
  } catch {
    res.status(500).json({ error: 'Kan map state niet opslaan' });
  }
};
