/**
 * Time utilities for generating "just posted" timestamps
 */

export function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  // For older posts, show actual date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: diffInDays > 365 ? 'numeric' : undefined
  });
}

export function generateRecentTimestamp() {
  // Generate a random time within the last 24 hours
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  const secondsAgo = Math.floor(Math.random() * 60);
  
  const now = new Date();
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  now.setSeconds(now.getSeconds() - secondsAgo);
  
  return now.toISOString();
}

export function formatReadingTime(wordCount) {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}