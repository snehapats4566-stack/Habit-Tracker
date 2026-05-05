export const QUOTES = [
  "The secret of getting ahead is getting started.",
  "Small daily improvements lead to staggering long-term results.",
  "You don't rise to the level of your goals, you fall to the level of your systems.",
  "Success is the sum of small efforts repeated day in and day out.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Motivation gets you started. Habit keeps you going.",
  "Every action you take is a vote for the type of person you wish to become.",
  "Good habits are worth being fanatical about.",
  "The chains of habit are too weak to be felt until they are too strong to be broken.",
  "Consistency is the foundation of virtue.",
  "Don't watch the clock; do what it does. Keep going.",
  "It's not about perfect. It's about effort.",
  "Discipline is choosing between what you want now and what you want most.",
  "Do something today that your future self will thank you for.",
  "Build the life you want by building better habits.",
  "Fall in love with the process and the results will come.",
  "One day or day one. You decide.",
  "Progress, not perfection.",
  "Make each day your masterpiece.",
  "What you do every day matters more than what you do once in a while.",
  "Strive for progress, not perfection.",
  "The best time to start was yesterday. The next best time is now.",
  "Habits are the compound interest of self-improvement.",
  "You are one decision away from a completely different life.",
  "The difference between who you are and who you want to be is what you do.",
  "A year from now you may wish you had started today.",
  "Believe you can and you're halfway there.",
  "Energy and persistence conquer all things.",
  "It always seems impossible until it's done.",
  "Stay consistent. Success is earned daily.",
];

export const CATEGORIES = ['Health', 'Mind', 'Work', 'Social', 'Creative', 'Custom'];

export const COLORS = [
  '#22c55e', '#0d9488', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f97316', '#eab308', '#ef4444',
];

export const CATEGORY_COLORS = {
  Health: '#22c55e',
  Mind: '#8b5cf6',
  Work: '#3b82f6',
  Social: '#ec4899',
  Creative: '#f97316',
  Custom: '#64748b',
};

export function getDailyQuote() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getGreeting(name) {
  const h = new Date().getHours();
  const part = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  return `Good ${part}, ${name}`;
}

export function toYMD(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getLast90Days() {
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toYMD(d));
  }
  return days;
}

export function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toYMD(d));
  }
  return days;
}
