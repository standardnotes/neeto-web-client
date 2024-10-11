import { WebApplication } from '@/Application/WebApplication'
import { KeyboardKey } from '@standardnotes/ui-services'
import { observer } from 'mobx-react-lite'
import { FunctionComponent, KeyboardEventHandler, UIEventHandler, useCallback } from 'react'
import { FOCUSABLE_BUT_NOT_TABBABLE, NOTES_LIST_SCROLL_THRESHOLD } from '@/Constants/Constants'
import { ListableContentItem } from './Types/ListableContentItem'
import ContentListItem from './ContentListItem'
import { ElementIds } from '@/Constants/ElementIDs'
import { classNames } from '@standardnotes/utils'
import { SNTag } from '@standardnotes/snjs'
import { ItemListController } from '@/Controllers/ItemList/ItemListController'

type Props = {
  application: WebApplication
  items: ListableContentItem[]
  selectedUuids: ItemListController['selectedUuids']
  paginate: () => void
}

const ContentList: FunctionComponent<Props> = ({ application, items, selectedUuids, paginate }) => {
  const { filesController, itemListController, navigationController, notesController } = application

  const { selectPreviousItem, selectNextItem } = itemListController
  const { hideTags, hideDate, hideNotePreview, hideEditorIcon } = itemListController.webDisplayOptions
  const { sortBy } = itemListController.displayOptions
  const selectedTag = navigationController.selected

  const onScroll: UIEventHandler = useCallback(
    (e) => {
      const offset = NOTES_LIST_SCROLL_THRESHOLD
      const element = e.target as HTMLElement
      if (element.scrollTop + element.offsetHeight >= element.scrollHeight - offset) {
        paginate()
      }
    },
    [paginate],
  )

  const onKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === KeyboardKey.Up) {
        e.preventDefault()
        selectPreviousItem()
      } else if (e.key === KeyboardKey.Down) {
        e.preventDefault()
        selectNextItem()
      }
    },
    [selectNextItem, selectPreviousItem],
  )

  const selectItem = useCallback(
    (item: ListableContentItem, userTriggered?: boolean) => {
      return itemListController.selectItem(item.uuid, userTriggered)
    },
    [itemListController],
  )

  const getTagsForItem = useCallback(
    (item: ListableContentItem) => {
      if (hideTags) {
        return []
      }

      if (!selectedTag) {
        return []
      }

      const tags = application.getItemTags(item)

      const isNavigatingOnlyTag = selectedTag instanceof SNTag && tags.length === 1
      if (isNavigatingOnlyTag) {
        return []
      }

      return tags
    },
    [hideTags, selectedTag, application],
  )

  return (
    <div
      className={classNames(
        'infinite-scroll overflow-y-auto overflow-x-hidden focus:shadow-none focus:outline-none',
        'md:max-h-full pointer-coarse:md:overflow-y-auto',
        'flex-grow pb-2',
      )}
      id={ElementIds.ContentList}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      tabIndex={FOCUSABLE_BUT_NOT_TABBABLE}
    >
      {items.map((item) => {
        return (
          <ContentListItem
            key={item.uuid}
            application={application}
            item={item}
            selected={selectedUuids.has(item.uuid)}
            hideDate={hideDate}
            hidePreview={hideNotePreview}
            hideTags={hideTags}
            hideIcon={hideEditorIcon}
            sortBy={sortBy}
            filesController={filesController}
            onSelect={selectItem}
            tags={getTagsForItem(item)}
            notesController={notesController}
          />
        )
      })}
    </div>
  )
}

export default observer(ContentList)
