import { redirect } from 'next/navigation';

// This page can serve as a general sales dashboard or redirect to the POS.
// For now, let's redirect to the POS as it's a primary sales interface.
export default function SalesPage() {
  redirect('/sales/pos');
}
