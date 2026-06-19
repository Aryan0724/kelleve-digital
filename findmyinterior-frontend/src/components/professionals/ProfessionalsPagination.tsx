"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}

export function ProfessionalsPagination({ currentPage, lastPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => router.push("?" + createQueryString('page', (currentPage - 1).toString()))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm font-medium text-slate-700 mx-2">
        Page {currentPage} of {lastPage}
      </span>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= lastPage}
        onClick={() => router.push("?" + createQueryString('page', (currentPage + 1).toString()))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
