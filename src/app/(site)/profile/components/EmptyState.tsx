interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <div>{icon}</div>
      <h3 className="text-xl font-medium text-myGrayDark mb-2">{title}</h3>
      <p className="text-myGray">{description}</p>
    </div>
  );
}
