import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate word count from text
export function getWordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

// Calculate reading time (average 200 words per minute)
export function getReadingTime(text: string): string {
  const wordCount = getWordCount(text);
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

// Format date
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
