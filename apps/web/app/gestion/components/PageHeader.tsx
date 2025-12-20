import { Button } from "@nukleo/ui";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, description, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="w-full sm:w-auto">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

