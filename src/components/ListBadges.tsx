import { pluralize } from "@/lib/utils";

export function ListBadges({ badges, className }: { badges: Record<string, number>; className?: string }) {
  const entries = Object.entries(badges);
  return (
    <div className={className}>
      {entries.map(([key, value], index) => (
        <span key={key}>
          {value} {pluralize(value, key.slice(0, -1), key)} {index + 1 !== entries.length && "· "}
        </span>
      ))}
    </div>
  );
}
