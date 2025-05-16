import React from 'react';

// This layout can be used if the admin section needs a different structure
// than the main app layout. For now, it will use the main AppLayout.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
