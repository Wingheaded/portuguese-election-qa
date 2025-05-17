// src/lib/utils.ts

// Slugify function to create valid ID attributes from header text (for future citation links)
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

// Function to highlight keywords in text using <mark>
// This simple version is case-insensitive and wraps whole words.
// For use with ReactMarkdown, this would ideally be a rehype plugin or used with rehype-raw.
export function highlightKeywords(text: string, keywords: string): string {
  if (!text || !keywords || !keywords.trim()) {
    return text;
  }
  const queryWords = keywords
    .toLowerCase()
    .split(/\s+/) // Split by any whitespace
    .filter(Boolean) // Remove empty strings
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Escape regex special chars

  if (queryWords.length === 0) {
      return text;
  }
  
  // Create a regex that matches any of the keywords, as whole words, case-insensitively
  // \b ensures word boundaries.
  const regex = new RegExp(`\\b(${queryWords.join('|')})\\b`, 'gi');
  
  return text.replace(regex, (match) => 
    `<mark class="bg-sky-200 dark:bg-sky-700 px-1 rounded">${match}</mark>`
  );
}