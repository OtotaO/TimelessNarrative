import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchFilter() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback(
    async (query: string) => {
      if (query.trim()) {
        await queryClient.prefetchQuery({
          queryKey: [`/api/events/search?query=${encodeURIComponent(query)}`],
        });
      } else {
        await queryClient.prefetchQuery({
          queryKey: ["/api/events"],
        });
      }
    },
    300
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <Input
        type="search"
        placeholder="Search historical events..."
        value={search}
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
}