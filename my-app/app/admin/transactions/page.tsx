// pages/admin/transactions.tsx
"use client"
import React, { useEffect, useState } from 'react';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  created: number; // timestamp
  status: string;
}

const TransactionsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/transactions');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
        setPayments(data.data); // Stripe lists are returned with data in the 'data' field
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>${(payment.amount / 100).toFixed(2)}</td>
                <td>{payment.currency.toUpperCase()}</td>
                <td>{new Date(payment.created * 1000).toLocaleDateString()}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsPage;
