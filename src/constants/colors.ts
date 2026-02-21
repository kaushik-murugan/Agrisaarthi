/**
 * colors.ts
 * Green-themed color palette for Agrisaarthi — an agriculture-focused app.
 * All colors are earthy, natural tones suitable for a farming companion.
 */

const Colors = {
  // ── Primary greens ──────────────────────────────────────────────
  primary: '#2E7D32',        // Deep green — main brand color
  primaryLight: '#60AD5E',   // Lighter green for highlights
  primaryDark: '#005005',    // Dark green for contrast elements

  // ── Secondary / accent ─────────────────────────────────────────
  secondary: '#8D6E63',      // Warm brown — earthy accent
  secondaryLight: '#BE9C91', // Light brown
  accent: '#FFC107',         // Golden yellow — wheat / harvest tone

  // ── Backgrounds ─────────────────────────────────────────────────
  background: '#F1F8E9',     // Very light green tint
  surface: '#FFFFFF',        // Card / surface white
  card: '#FFFFFF',           // Card background

  // ── Text ────────────────────────────────────────────────────────
  textPrimary: '#1B1B1B',    // Near-black for body text
  textSecondary: '#555555',  // Medium gray for subtitles
  textLight: '#FFFFFF',      // White text on dark backgrounds
  textMuted: '#9E9E9E',     // Muted / placeholder text

  // ── Status ──────────────────────────────────────────────────────
  success: '#43A047',        // Green — success states
  warning: '#FB8C00',        // Orange — warning states
  error: '#E53935',          // Red — error states
  info: '#1E88E5',           // Blue — informational states

  // ── Borders & dividers ──────────────────────────────────────────
  border: '#C8E6C9',         // Soft green border
  divider: '#E0E0E0',        // Neutral divider
} as const;

export default Colors;
