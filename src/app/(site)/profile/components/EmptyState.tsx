interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 text-gray-300 mx-auto mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
