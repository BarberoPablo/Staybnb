interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-myGrayDark">{title}</h1>
      <p className="text-myGray mt-2">{description}</p>
    </div>
  );
}
