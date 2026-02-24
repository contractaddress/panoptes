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
        url: 'http://proxmox.local:8006'
      },
      uptime: 'placeholder'
    }
  },

  smallTiles: [
    { title: 'OpenWRT', status: 'online', icon: '/icons/openwrt.svg', location: { text: 'OpenWRT', url: 'http://openwrt.lan' } },
    { title: 'Gitea', status: 'online', icon: '/icons/gitea.svg', location: { text: 'gitea', url: 'http://gitea.lan:3000' } },
    { title: 'TrueNas', status: 'online', icon: '/icons/truenas.svg', location: { text: 'TrueNas', url: 'http://truenas.lan/ui/signin' } },
    { title: 'Tailscale', status: 'online', icon: '/icons/tailscale.svg', location: { text: 'Tailscale', url: 'http://tailscale.local' } }
  ],

  servicesCard: {
    title: 'Services',
    status: 'online',
    logos: [
      { name: 'komga', status: 'online', icon: '/icons/services/punpun.svg', location: { text: 'komga', url: 'http://komga.lan:25600' } },
      { name: 'Immich', status: 'online', icon: '/icons/services/immich.svg', location: { text: 'immich', url: 'http://immich.lan:2283/auth/login' } },
      { name: 'NextCloud', status: 'online', icon: '/icons/services/nextcloud.svg', location: { text: 'NextCloud', url: 'http://nextcloud.lan:8080' } },
      { name: 'kiwix', status: 'online', icon: '/icons/services/kiwix.svg', location: { text: 'kiwix', url: 'https://service4.local' } },
      { name: 'Docker', status: 'online', icon: '/icons/services/docker.svg', location: { text: 'Docker', url: 'https://docker.local' } },
      { name: 'Suwayomi', status: 'online', icon: '/icons/services/suwayomi.svg', location: { text: 'Service 8', url: 'https://service8.local' } },
      { name: 'Pi-hole', status: 'online', icon: '/icons/services/pi-hole.svg', location: { text: 'pi-hole', url: 'https://service7.local' } },
      { name: 'Nginx', status: 'online', icon: '/icons/services/nginx.svg', location: { text: 'Nginx Proxy manager', url: 'https://service3.local' } },
      { name: '', status: 'online', icon: '/icons/services/authentik.svg', location: { text: 'Authentik', url: 'https://service9.local' } }
    ]
  }
};
