/**
 * Every Claude model ID the app uses lives here. Routes import from this file
 * rather than hardcoding a model string, so a model upgrade is one edit.
 *
 * Model IDs are exact and carry no date suffix.
 */

/** Reasoning-heavy work: KSG solves, teaching content, answer verification. */
export const MODEL_REASONING = "claude-sonnet-5";

/** Vision: transcribing a photographed or screenshotted problem into LaTeX. */
export const MODEL_VISION = "claude-sonnet-5";

/** High-volume, low-difficulty drafting where a smaller model is enough. */
export const MODEL_FAST = "claude-haiku-4-5";
