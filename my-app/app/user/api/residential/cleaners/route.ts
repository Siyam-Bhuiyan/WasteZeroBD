import { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableCleaners } from '@/utils/db/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { location } = req.query;

      const cleaners = await getAvailableCleaners(location as string);
      res.status(200).json(cleaners);
    } catch (error) {
      console.error('Error fetching cleaners:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
