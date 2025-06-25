"use client";

import { useSearchParams } from "next/navigation";

export function useQueryParams<T extends string>(keys: T[]): Partial<Record<T, string>> {
  const searchParams = useSearchParams();
  const values = keys.reduce((acc, key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Partial<Record<T, string>>);

  return values;
}
