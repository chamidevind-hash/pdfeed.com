"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { BookOpen, FolderOpen, Search, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { groupSearchResults, searchSite, searchTypeLabels, type SearchResult } from "@/lib/search";

type SearchBoxProps = {
  id?: string;
  placeholder?: string;
  className?: string;
  initialQuery?: string;
  variant?: "header" | "hero" | "page" | "mobile";
};

const resultIcons = {
  tool: Wrench,
  category: FolderOpen,
  guide: BookOpen,
};

export function SearchBox({
  id = "site-search",
  placeholder = "Search PDF, Word, JPG, merge...",
  className = "",
  initialQuery = "",
  variant = "header",
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 140);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const results = useMemo(
    () => searchSite(debouncedQuery, 8),
    [debouncedQuery],
  );
  const groups = useMemo(() => groupSearchResults(results), [results]);
  const displayedResults = useMemo(
    () => [...groups.tool, ...groups.category, ...groups.guide],
    [groups],
  );
  const hasQuery = query.trim().length > 0;
  const panelId = `${id}-results`;

  useEffect(() => {
    setActiveIndex(0);
    setIsOpen(hasQuery);
  }, [debouncedQuery, hasQuery]);

  function openResult(result?: SearchResult) {
    const target = result?.href || `/search?q=${encodeURIComponent(query.trim())}`;
    if (!query.trim() && !result) return;
    setIsOpen(false);
    inputRef.current?.blur();
    router.push(target);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!hasQuery) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        Math.min(index + 1, Math.max(displayedResults.length - 1, 0)),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openResult(displayedResults[activeIndex]);
    }
  }

  let renderedIndex = -1;

  return (
    <div
      ref={wrapperRef}
      className={`search-box search-box-${variant} ${className}`}
      role="search"
    >
      <label className="sr-only" htmlFor={id}>
        Search PDFeed converters, categories, and guides
      </label>
      <div className="search-input-wrap">
        <Search size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={panelId}
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && displayedResults.length > 0
              ? `${panelId}-option-${activeIndex}`
              : undefined
          }
          onFocus={() => setIsOpen(hasQuery)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <div className="search-results-panel" id={panelId} role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">No results found</div>
          ) : (
            <>
              {(["tool", "category", "guide"] as const).map((type) => {
                const group = groups[type];
                if (group.length === 0) return null;

                return (
                  <div className="search-result-group" key={type}>
                    <strong>{searchTypeLabels[type]}</strong>
                    {group.map((result) => {
                      renderedIndex += 1;
                      const currentIndex = renderedIndex;
                      const Icon = resultIcons[type];
                      const isActive = currentIndex === activeIndex;

                      return (
                        <button
                          id={`${panelId}-option-${currentIndex}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          className={`search-result-item ${isActive ? "is-active" : ""}`}
                          key={`${result.type}-${result.id}`}
                          onMouseEnter={() => setActiveIndex(currentIndex)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => openResult(result)}
                        >
                          <span className="search-result-icon">
                            <Icon size={17} aria-hidden="true" />
                          </span>
                          <span className="search-result-copy">
                            <span>
                              {result.title}
                              <small>{result.type}</small>
                            </span>
                            <em>{result.description}</em>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              <button
                type="button"
                className="search-all-button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openResult()}
              >
                View all results for "{query.trim()}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
