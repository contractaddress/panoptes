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
      uptime: 'infinite years'
    }
  },

  smallTiles: [
    { title: 'OpenWRT', status: 'online', icon: '/icons/openwrt.svg', location: { text: 'OpenWRT', url: 'https://openwrt.homelab.lan' } },
    { title: 'Gitea', status: 'online', icon: '/icons/gitea.svg', location: { text: 'gitea', url: 'https://gitea.homelab.lan' } },
    { title: 'TrueNas', status: 'online', icon: '/icons/truenas.svg', location: { text: 'TrueNas', url: 'https://truenas.homelab.lan/ui/signin' } },
    { title: 'Tailscale', status: 'online', icon: '/icons/tailscale.svg', location: { text: 'Tailscale', url: 'https://tailscale.homelab.lan' } }
  ],

  servicesCard: {
    title: 'Services',
    status: 'online',
    logos: [
      { name: 'komga', status: 'online', icon: '/icons/services/punpun.svg', location: { text: 'komga', url: 'https://komga.homelab.lan' } },
      { name: 'Immich', status: 'online', icon: '/icons/services/immich.svg', location: { text: 'immich', url: 'https://immich.homelab.lan/auth/login' } },
      { name: 'NextCloud', status: 'online', icon: '/icons/services/nextcloud.svg', location: { text: 'NextCloud', url: 'https://nextcloud.homelab.lan' } },
      { name: 'kiwix', status: 'online', icon: '/icons/services/kiwix.svg', location: { text: 'kiwix', url: 'https://kiwix.homelab.lan' } },
      { name: 'Docker', status: 'online', icon: '/icons/services/docker.svg', location: { text: 'Docker', url: 'https://docker.homelab.lan' } },
      { name: 'Suwayomi', status: 'online', icon: '/icons/services/suwayomi.svg', location: { text: 'Service 8', url: 'https://suwayomi.homelab.lan' } },
      { name: 'Pi-hole', status: 'online', icon: '/icons/services/pi-hole.svg', location: { text: 'pi-hole', url: 'https://pi-hole.homelab.lan' } },
      { name: 'Nginx', status: 'online', icon: '/icons/services/nginx.svg', location: { text: 'Nginx Proxy manager', url: 'https://nginx.homelab.lan' } },
      { name: '', status: 'online', icon: '/icons/services/authentik.svg', location: { text: 'Authentik', url: 'https://authentik.homelab.lan' } }
    ]
  }
};
