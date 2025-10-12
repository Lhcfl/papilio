import {
  BellIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
  UserPlusIcon,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';

export const AppSidebarMain = () => {
  const { t } = useTranslation();

  const data = [
    { key: 'home', title: t('home'), icon: HomeIcon, to: '/' },
    { key: 'notifications', title: t('notifications'), icon: BellIcon, to: '/notifications' },
    { key: 'favorites', title: t('favorites'), icon: StarIcon, to: '/favorites' },
    { key: 'followRequests', title: t('followRequests'), icon: UserPlusIcon, to: '/follow-requests' },
    { key: 'announcements', title: t('announcements'), icon: MegaphoneIcon, to: '/announcements' },
    { key: 'chat', title: t('chat'), icon: MessageSquareIcon, to: '/chat' },
    { key: 'search', title: t('search'), icon: SearchIcon, to: '/search' },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton size="lg" asChild>
                <Link to={item.to}>
                  <item.icon />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <MoreHorizontalIcon />
              {t('other')}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
