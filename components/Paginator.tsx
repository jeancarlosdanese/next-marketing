// File: components/Paginator.tsx

import { Button } from "@/components/ui/button";

type PaginatorProps = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  onPageChange: (newPage: number) => void;
};

export default function Paginator({
  totalRecords,
  totalPages,
  currentPage,
  perPage,
  onPageChange,
}: PaginatorProps) {
  return (
    <div className="flex flex-col items-center mt-6">
      <p className="text-sm text-gray-600">
        Exibindo{" "}
        <span className="font-semibold">
          {totalRecords === 0 ? 0 : (currentPage - 1) * perPage + 1}
        </span>{" "}
        - <span className="font-semibold">{Math.min(currentPage * perPage, totalRecords)}</span> de{" "}
        <span className="font-semibold">{totalRecords}</span> registros
      </p>

      <div className="flex justify-center gap-4 mt-2">
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span className="mx-4 mt-2 text-sm font-semibold text-gray-600 mb-4 align-middle">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
