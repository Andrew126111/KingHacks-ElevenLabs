import { useMemo } from "react";

interface HighlightTextProps {
  text: string;
  snippets: string[];
}

export function HighlightText({ text, snippets }: HighlightTextProps) {
  const parts = useMemo(() => {
    if (!snippets || snippets.length === 0) return [text];

    // Create a regex to match any of the snippets
    // Escape snippets to be used in regex
    const escapedSnippets = snippets
      .filter(s => s && s.trim().length > 0)
      .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    if (escapedSnippets.length === 0) return [text];

    const regex = new RegExp(`(${escapedSnippets.join('|')})`, 'gi');
    return text.split(regex);
  }, [text, snippets]);

  if (!snippets || snippets.length === 0) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => {
        const isHighlight = snippets.some(s => s.toLowerCase() === part.toLowerCase());
        return isHighlight ? (
          <mark key={i} className="bg-yellow-200/60 rounded px-0.5 text-slate-900 font-medium">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}
