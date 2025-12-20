"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nukleo/ui";
import { unifiedSearchAction } from "../app/commercial/search/actions";

interface UnifiedSearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (results: { contacts: any[]; companies: any[] }) => void;
}

export function UnifiedSearchBar({
  placeholder = "Rechercher dans les contacts et entreprises...",
  className = "",
  onSearch,
}: UnifiedSearchBarProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const router = useRouter();
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = React.useCallback(
    async (term: string) => {
      if (!term || term.trim().length === 0) {
        if (onSearch) {
          onSearch({ contacts: [], companies: [] });
        }
        return;
      }

      setIsSearching(true);
      try {
        const result = await unifiedSearchAction(term);
        if (result.success && result.data) {
          if (onSearch) {
            onSearch(result.data);
          } else {
            // Navigate to search results page if no callback provided
            router.push(`/commercial/search?q=${encodeURIComponent(term)}`);
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch, router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      handleSearch(searchTerm);
    }
  };

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}
    </div>
  );
}


