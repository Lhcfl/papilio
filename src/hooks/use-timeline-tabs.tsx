import { GlobeIcon, HomeIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import type { Tab } from '@/types/page-header'
import type { TimelineTypes } from './use-timeline'

const timelineIcons = {
  home: <HomeIcon />,
  local: <MapPinIcon />,
  hybrid: <UsersIcon />,
  global: <GlobeIcon />,
}

const getTimelineTranslationKey = (type: TimelineTypes) => {
  // fuck?
  if (type === 'hybrid') return '_timelines.social'
  return '_timelines.' + type
}

const timelines: TimelineTypes[] = ['home', 'local', 'hybrid', 'global']

export const useTimelineTabs = (): Tab<TimelineTypes>[] => {
  const { t } = useTranslation()
  return timelines.map(tl => ({
    value: tl,
    label: t(getTimelineTranslationKey(tl)),
    icon: timelineIcons[tl],
  }))
}
