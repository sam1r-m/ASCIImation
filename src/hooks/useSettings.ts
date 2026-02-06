// convenience re-export for consuming settings in components

'use client'

import { useEditorStore } from '@/store/settings'

export { useEditorStore } from '@/store/settings'

// shallow selector for a single setting
export function useSetting<K extends keyof ReturnType<typeof useEditorStore.getState>>(key: K) {
  return useEditorStore((s) => s[key])
}
