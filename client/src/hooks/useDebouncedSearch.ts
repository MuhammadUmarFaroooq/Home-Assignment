import { useState, useEffect, useRef } from "react";

const useDebouncedSearch = (delay: number = 500) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [delayedSearch, setDelayedSearch] = useState<string>("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string): void => {
    setSearchValue(value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setDelayedSearch(value);
    }, delay);
  };

  useEffect(() => {
    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return { 
    searchValue, 
    delayedSearch, 
    handleSearchChange 
  };
};

export default useDebouncedSearch;