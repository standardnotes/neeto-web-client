import Button from '@/Components/Button/Button'
import DecoratedInput from '@/Components/Input/DecoratedInput'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ConfirmCustomPlugin from './ConfirmCustomPlugin'
import PreferencesSegment from '../../../PreferencesComponents/PreferencesSegment'
import { useApplication } from '@/Components/ApplicationProvider'
import { ThirdPartyFeatureDescription } from '@standardnotes/snjs'

type Props = {
  className?: string
}

const InstallCustomPlugin: FunctionComponent<Props> = ({ className = '' }) => {
  const application = useApplication()

  const [customUrl, setCustomUrl] = useState('')
  const [confirmablePlugin, setConfirmablePlugin] = useState<ThirdPartyFeatureDescription | undefined>(undefined)

  const confirmableEnd = useRef<HTMLDivElement>(null)

  const isWebApp = useState(application.isWebApp());

  useEffect(() => {
    if (confirmablePlugin) {
      confirmableEnd.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [confirmablePlugin, confirmableEnd])

  const submitPluginUrl = async (url: string) => {
    const plugin = await application.pluginsService.getPluginDetailsFromUrl(url)
    if (plugin) {
      setConfirmablePlugin(plugin)
    }
  }

  const confirmPlugin = async (confirm: boolean) => {
    if (confirm && confirmablePlugin) {
      await application.pluginsService.installExternalPlugin(confirmablePlugin)
    }
    setConfirmablePlugin(undefined)
    setCustomUrl('')
  }

  return (
    <div className={className}>
      <div>
        {!confirmablePlugin && (
          <PreferencesSegment>
            <div>
              <DecoratedInput
                disabled = {isWebApp}
                placeholder={(isWebApp) ? 'Web App External Plugin Downloads Not Supported' : 'Enter Plugin URL'}
                value={customUrl}
                onChange={(value) => {
                  setCustomUrl(value)
                }}
              />
            </div>
            <Button
              hidden={customUrl.length === 0}
              disabled={customUrl.length === 0 || isWebApp}
              className="mt-4 min-w-20"
              primary
              label="Install"
              onClick={() => submitPluginUrl(customUrl)}
            />
          </PreferencesSegment>
        )}
        {confirmablePlugin && (
          <PreferencesSegment>
            <ConfirmCustomPlugin plugin={confirmablePlugin} callback={confirmPlugin} />
            <div ref={confirmableEnd} />
          </PreferencesSegment>
        )}
      </div>
    </div>
  )
}

export default observer(InstallCustomPlugin)
