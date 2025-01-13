import { NextApiRequest, NextApiResponse } from 'next';
import { updateServiceStatus } from '@/utils/db/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { serviceId, status } = req.body;

      const updatedService = await updateServiceStatus(serviceId, status);
      res.status(200).json({ message: 'Service status updated', updatedService });
    } catch (error) {
      console.error('Error updating service status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
