type ErrorStateProps = {
  error: unknown;
  fallbackMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof Error ? error.message : fallbackMessage;
}

export function ErrorState({
  error,
  fallbackMessage = "Something went wrong",
  onRetry,
  retryLabel = "Retry",
}: ErrorStateProps) {
  return (
    <div className="space-y-2" role="alert">
      <p className="text-sm text-red-600">
        {getErrorMessage(error, fallbackMessage)}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-slate-900 underline hover:no-underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
