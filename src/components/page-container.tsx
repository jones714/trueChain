import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps extends PropsWithChildren {
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('flex-1 space-y-4 p-4 pt-6 md:p-8 md:pt-6', className)}>
      {children}
    </div>
  );
}
