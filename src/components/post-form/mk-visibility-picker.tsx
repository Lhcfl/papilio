/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DraftData } from '@/hooks/use-draft';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LabelAndDescription, MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { GlobeIcon, HomeIcon, LockIcon, MailIcon, WifiIcon, WifiOffIcon } from 'lucide-react';

export const MkVisibilityPicker = (
  props: {
    visibility: DraftData['visibility'];
    localOnly: boolean;
    forceLocalOnly?: boolean;
    setLocalOnly: (v: boolean) => void;
    setVisibility: (v: DraftData['visibility']) => void;
    disabled?: boolean;
    visibilityRestrict?: DraftData['visibility'][];
  } & ComponentProps<typeof Button>,
) => {
  const { t } = useTranslation();

  const { visibility, setVisibility, localOnly, setLocalOnly, disabled, visibilityRestrict, ...btnProps } = props;

  const forceDisabled = props.visibilityRestrict?.length === 0;

  const visibilities = {
    public: {
      icon: <GlobeIcon />,
      label: t('_visibility.public'),
      description: t('_visibility.publicDescription'),
    },
    home: {
      icon: <HomeIcon />,
      label: t('_visibility.home'),
      description: t('_visibility.homeDescription'),
    },
    followers: {
      icon: <LockIcon />,
      label: t('_visibility.followers'),
      description: t('_visibility.followersDescription'),
    },
    specified: {
      icon: <MailIcon />,
      label: t('_visibility.specified'),
      description: t('_visibility.specifiedDescription'),
    },
  };

  const menu: Menu = [
    {
      type: 'group',
      id: 'visibility-group',
      items: [
        {
          type: 'label',
          id: 'visibility-label',
          label: t('visibility'),
        },
        ...Object.entries(visibilities).map(([key, val]) => ({
          type: 'item' as const,
          id: `v-${key}`,
          icon: val.icon,
          label: <LabelAndDescription label={val.label} description={val.description} />,
          onClick: () => {
            setVisibility(key as DraftData['visibility']);
          },
          disabled:
            (key === 'specified' && localOnly) ||
            (visibilityRestrict && !visibilityRestrict.includes(key as DraftData['visibility'])),
          active: visibility === key,
        })),
      ],
    },
    {
      type: 'group',
      id: 'localonly-group',
      items: [
        null, // Separator
        {
          type: 'label',
          id: 'localonly-label',
          label: t('federation'),
        },
        {
          type: 'item',
          id: 'v-localonly',
          icon: localOnly ? <WifiOffIcon /> : <WifiIcon />,
          label: <LabelAndDescription label={t('localOnly')} description={t('disableFederationConfirmWarn')} />,
          active: localOnly,
          onClick: () => {
            setLocalOnly(!localOnly);
          },
          preventCloseOnClick: true,
          disabled: visibility == 'specified' || props.forceLocalOnly === true,
        },
      ],
    },
  ];

  return (
    <MenuOrDrawer menu={menu}>
      <Button variant="ghost" disabled={forceDisabled || disabled} {...btnProps}>
        {visibilities[visibility].icon}
        {visibilities[visibility].label}
        {localOnly ? <WifiOffIcon className="text-destructive" /> : <WifiIcon />}
      </Button>
    </MenuOrDrawer>
  );
};
