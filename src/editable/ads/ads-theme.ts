// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Rose palette — matches the site-wide token system.
export const adSkin: AdSkin = {
  radius: '12px',
  border: '1px solid #E4D0D0',
  shadow: 'none',
  background: '#F5EBEB',
  labelClassName: 'bg-[#3d2e2e] text-[#F5EBEB]',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '12px', shadow: 'none', border: '1px solid #E4D0D0' },
  popup: { radius: '16px' },
  header: { radius: '12px', background: '#E4D0D0', border: '1px solid #D5B4B4' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
