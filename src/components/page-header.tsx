import type { PropsWithChildren } from 'react';

interface PageHeaderProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
}
