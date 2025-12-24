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
        url: 'https://proxmox.local:8006'
      },
      uptime: 'placeholder'
    }
  },
  smallTiles: [
    { title: 'OpenWRT', status: 'online', icon: '/icons/openwrt.svg'},
    { title: 'Pi-hole', status: 'online', icon: '/icons/pi-hole.svg'},
    { title: 'Immich', status: 'online', icon: '/icons/immich.svg'},
    { title: 'Wireguard', status: 'online', icon: '/icons/wireguard.svg'}
  ],
  servicesCard: {
    title: 'Services',
    logos: [
      { name: 'Docker', icon: '/icons/services/docker.svg' },
      { name: 'Service 2', icon: '/icons/services/' },
      { name: 'Service 3', icon: '/icons/services/' },
      { name: 'Service 4', icon: '/icons/services/' },
      { name: 'Service 5', icon: '/icons/services/' },
      { name: 'Service 6', icon: '/icons/services/' },
      { name: 'Service 7', icon: '/icons/services/' },
      { name: 'Service 8', icon: '/icons/services/' },
      { name: 'Service 9', icon: '/icons/services/' }
    ]
  }
};
