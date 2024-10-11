import { BlocksEditor } from '@/Components/SuperEditor/BlocksEditor'
import { BlocksEditorComposer } from '@/Components/SuperEditor/BlocksEditorComposer'
import BlockPickerMenuPlugin from '@/Components/SuperEditor/Plugins/BlockPickerPlugin/BlockPickerPlugin'
import { useLocalPreference } from '@/Hooks/usePreference'
import { useResponsiveEditorFontSize } from '@/Utils/getPlaintextFontSize'
import { EditorLineHeightValues, LocalPrefKey, classNames } from '@standardnotes/snjs'
import { CSSProperties, useRef, useState } from 'react'
import { SuperDemoInitialValue } from './SuperDemoInitialValue'
import { UpgradePrompt } from './UpgradePrompt'
import { useApplication } from '@/Components/ApplicationProvider'
import { useAutoElementRect } from '@/Hooks/useElementRect'

const SuperDemo = ({ hasSubscription, onClose }: { hasSubscription: boolean; onClose: () => void }) => {
  const application = useApplication()

  const [lineHeight] = useLocalPreference(LocalPrefKey.EditorLineHeight)
  const [fontSize] = useLocalPreference(LocalPrefKey.EditorFontSize)
  const responsiveFontSize = useResponsiveEditorFontSize(fontSize, false)

  const ctaRef = useRef<HTMLButtonElement>(null)

  const [demoContainer, setDemoContainer] = useState<HTMLDivElement | null>(null)
  const demoContainerRect = useAutoElementRect(demoContainer, {
    updateOnWindowResize: true,
  })

  return (
    <div className="flex h-full flex-col" ref={setDemoContainer}>
      <div
        className={classNames(
          'flex-shrink-0 border-b border-border p-4',
          demoContainerRect && demoContainerRect.height < 500 ? 'hidden md:block' : '',
        )}
      >
        <UpgradePrompt
          featureName="Super notes"
          ctaRef={ctaRef}
          application={application}
          hasSubscription={hasSubscription}
          inline
          preferHorizontalLayout
          onClick={onClose}
        />
      </div>
      <div
        className="relative flex h-full min-h-0 flex-col"
        style={
          {
            '--line-height': EditorLineHeightValues[lineHeight],
            '--font-size': responsiveFontSize,
          } as CSSProperties
        }
      >
        <BlocksEditorComposer initialValue={SuperDemoInitialValue()}>
          <BlocksEditor className="blocks-editor h-full bg-default">
            <BlockPickerMenuPlugin popoverZIndex="z-modal" />
          </BlocksEditor>
        </BlocksEditorComposer>
      </div>
    </div>
  )
}

export default SuperDemo
