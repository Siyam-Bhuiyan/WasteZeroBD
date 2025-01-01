// pages/api/certificates/[userId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserCertificateStats, createCertificate } from '@/utils/db/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = parseInt(req.query.userId as string);
      const stats = await getUserCertificateStats(userId);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch certificate stats' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}