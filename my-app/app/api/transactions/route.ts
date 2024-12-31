// pages/api/transactions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51PMqS2GhvT5slJMQNAszBQF17cNHYnzWv1mmUWyVAQ2dEGlj7R541NWX27QiIwHuhLPNan0lGMdI9qwfN6jSKVw900OdOYnKDC", {
  apiVersion: "2022-11-15" as any,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const payments = await stripe.paymentIntents.list({
        limit: 10, // You can customize this limit
      });
      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Failed to fetch payments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
