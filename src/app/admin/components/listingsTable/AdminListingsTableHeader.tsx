import React from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import type { SortDirection, SortField } from "./AdminListingsTable";

const TH = ({
  field,
  sort,
  onSort,
  children,
}: {
  field?: SortField;
  sort: { field: SortField | null; direction: SortDirection };
  onSort?: (f: SortField) => void;
  children: React.ReactNode;
}) => {
  const isSortable = !!field;
  const handleClick = () => {
    if (field && onSort) onSort(field);
  };

  const getIcon = () => {
    if (!field || sort.field !== field) {
      return <FaSort className="w-4 h-4 text-gray-400" />;
    }
    if (sort.direction === "asc") {
      return <FaSortUp className="w-4 h-4 text-myGreenSemiBold" />;
    }
    if (sort.direction === "desc") {
      return <FaSortDown className="w-4 h-4 text-myGreenSemiBold" />;
    }
    return <FaSort className="w-4 h-4 text-gray-400" />;
  };

  return (
    <th
      onClick={handleClick}
      className={`w-full px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
        isSortable ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""
      }`}
    >
      <div className="flex justify-center items-center gap-2">
        {children} {isSortable && getIcon()}
      </div>
    </th>
  );
};

export default function AdminListingsTableHeader({
  sort,
  onSort,
}: {
  sort: { field: SortField | null; direction: SortDirection };
  onSort: (f: SortField) => void;
}) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <TH field="title" sort={sort} onSort={onSort}>
          Title
        </TH>
        <TH field="location" sort={sort} onSort={onSort}>
          Location
        </TH>
        <TH field="hostName" sort={sort} onSort={onSort}>
          Host
        </TH>
        <TH field="nightPrice" sort={sort} onSort={onSort}>
          Night Price
        </TH>
        <TH field="status" sort={sort} onSort={onSort}>
          Status
        </TH>
        <TH field="createdAt" sort={sort} onSort={onSort}>
          Created
        </TH>
        <TH sort={sort}>Details</TH>
      </tr>
    </thead>
  );
}
