import { uptime } from "os";

export const dashboardConfig = {
  heroCard: {
    title: 'Proxmox',
    status: 'online',
    icon: '/icons/proxmox.svg',
    content: {
      status: 'online',
      location: {
        text: 'proxmox.local',
        url: 'http://proxmox.local:port'
      },
      uptime: 'placeholder'
    }
  },

  smallTiles: [
    { title: 'OpenWRT', status: 'online', icon: '/icons/openwrt.svg', location: { text: 'OpenWRT', url: 'http://openwrt.local' } },
    { title: 'Gitea', status: 'online', icon: '/icons/gitea.svg', location: { text: 'gitea', url: 'http://gitea.local' } },
    { title: 'TrueNas', status: 'online', icon: '/icons/truenas.svg', location: { text: 'TrueNas', url: 'http://truenas.local' } },
    { title: 'Tailscale', status: 'online', icon: '/icons/tailscale.svg', location: { text: 'Tailscale', url: 'http://tailscale.local' } }
  ],

  servicesCard: {
    title: 'Services',
    status: 'online',
    logos: [
      { name: 'komga', status: 'online', icon: '/icons/services/punpun.svg', location: { text: 'komga', url: 'https://komga.local' } },
      { name: 'Immich', status: 'online', icon: '/icons/services/immich.svg', location: { text: 'immich', url: 'https://service2.local' } },
      { name: 'Nginx', status: 'online', icon: '/icons/services/nginx.svg', location: { text: 'Nginx Proxy manager', url: 'https://service3.local' } },
      { name: 'kiwix', status: 'online', icon: '/icons/services/kiwix.svg', location: { text: 'kiwix', url: 'https://service4.local' } },
      { name: 'Docker', status: 'online', icon: '/icons/services/docker.svg', location: { text: 'Docker', url: 'https://docker.local' } },
      { name: 'NextCloud', status: 'online', icon: '/icons/services/nextcloud.svg', location: { text: 'NextCloud', url: 'https://service6.local' } },
      { name: 'Adguard', status: 'online', icon: '/icons/services/adguard.svg', location: { text: 'adguard', url: 'https://service7.local' } },
      { name: '', status: 'online', icon: '/icons/services/', location: { text: 'Service 8', url: 'https://service8.local' } },
      { name: '', status: 'online', icon: '/icons/services/', location: { text: 'Service 9', url: 'https://service9.local' } }
    ]
  }
};
