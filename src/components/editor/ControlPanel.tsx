'use client'

import { Accordion } from '@/components/ui/Accordion'
import { PresetsSection } from './sections/PresetsSection'
import { InputSection } from './sections/InputSection'
import { GeometrySection } from './sections/GeometrySection'
import { StyleSection } from './sections/StyleSection'
import { EdgesSection } from './sections/EdgesSection'
import { DitherColorSection } from './sections/DitherColorSection'
import { ExportSection } from './sections/ExportSection'
import type { VideoMeta } from '@/lib/ascii/types'

interface ControlPanelProps {
  meta: VideoMeta | null
  isPlaying: boolean
  currentTime: number
  onTogglePlayback: () => void
  onSeek: (time: number) => void
  onExportGif: () => void
  onExportWebm: () => void
  canWebm: boolean
}

export function ControlPanel({
  meta, isPlaying, currentTime,
  onTogglePlayback, onSeek, onExportGif, onExportWebm, canWebm,
}: ControlPanelProps) {
  return (
    <aside className="w-[300px] shrink-0 h-full overflow-y-auto custom-scrollbar glass rounded-2xl p-4">
      <Accordion title="Presets" defaultOpen>
        <PresetsSection />
      </Accordion>

      {meta && (
        <Accordion title="Playback" defaultOpen>
          <InputSection
            meta={meta}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onTogglePlayback={onTogglePlayback}
            onSeek={onSeek}
          />
        </Accordion>
      )}

      <Accordion title="Geometry" defaultOpen>
        <GeometrySection />
      </Accordion>

      <Accordion title="Style">
        <StyleSection />
      </Accordion>

      <Accordion title="Edges">
        <EdgesSection />
      </Accordion>

      <Accordion title="Dither & Color">
        <DitherColorSection />
      </Accordion>

      <Accordion title="Export" defaultOpen>
        <ExportSection
          onExportGif={onExportGif}
          onExportWebm={onExportWebm}
          canWebm={canWebm}
        />
      </Accordion>
    </aside>
  )
}
