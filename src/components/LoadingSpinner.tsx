// src/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: number; 
  spinnerColorClass?: string; // e.g., "border-sky-500"
  trackColorClass?: string; // e.g., "border-slate-200 dark:border-slate-700"
  borderWidthClass?: string; // e.g., "border-4"
}

export function LoadingSpinner({ 
  size = 24, 
  spinnerColorClass = "border-sky-500", 
  trackColorClass = "border-slate-200 dark:border-slate-700",
  borderWidthClass = "border-4" // default to 4px border
}: LoadingSpinnerProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`${borderWidthClass} ${trackColorClass} ${spinnerColorClass} border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="A carregar..." // Translated
    >
      <span className="sr-only">A carregar...</span> {/* Translated */}
    </div>
  );
}