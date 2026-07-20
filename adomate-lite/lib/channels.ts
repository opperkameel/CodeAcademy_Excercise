// Channel presets used for multi-channel reformatting. One creative concept is
// rendered at each of these sizes.

export interface Channel {
  id: string;
  label: string;
  /** Full-resolution export dimensions. */
  width: number;
  height: number;
}

export const CHANNELS: Channel[] = [
  { id: "ig-post", label: "Instagram Post", width: 1080, height: 1080 },
  { id: "ig-story", label: "Instagram / TikTok Story", width: 1080, height: 1920 },
  { id: "fb-feed", label: "Facebook Feed", width: 1200, height: 628 },
  { id: "x-post", label: "X / Twitter", width: 1200, height: 675 },
  { id: "li-post", label: "LinkedIn", width: 1200, height: 627 },
];
