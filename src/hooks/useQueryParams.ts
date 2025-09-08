"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Stable hook: depends only on two primitives:
 *  - `search`  -> string from searchParams.toString()
 *  - `keysJson` -> JSON.stringify(keys)
 *
 * This avoids referencing the unstable searchParams object or an inline array.
 */
export function useQueryParams<T extends string>(keys: T[]): Partial<Record<T, string>> {
  const searchParams = useSearchParams();

  // primitives for the dependency array
  const search = searchParams?.toString() ?? "";
  const keysJson = JSON.stringify(keys);

  return useMemo(() => {
    const sp = new URLSearchParams(search);
    const values: Partial<Record<T, string>> = {};

    const keysArr = (keysJson ? JSON.parse(keysJson) : []) as T[];
    for (const key of keysArr) {
      const v = sp.get(key);
      if (v !== null) values[key] = v;
    }

    return values;
  }, [search, keysJson]);
}
