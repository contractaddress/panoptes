import { uptime } from "os";

export const dashboardConfig = {
  heroCard: {
    title: 'Proxmox',
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
    { title: 'OpenWRT', icon: '/icons/openwrt.svg', location: { text: 'OpenWRT', url: 'https://openwrt.local' } },
    { title: 'Pi-hole', icon: '/icons/pi-hole.svg', location: { text: 'Pi-hole', url: 'https://pihole.local' } },
    { title: 'Immich', icon: '/icons/immich.svg', location: { text: 'Immich', url: 'https://immich.local' } },
    { title: 'Wireguard', icon: '/icons/wireguard.svg', location: { text: 'Wireguard', url: 'https://wireguard.local' } }
  ],

  servicesCard: {
    title: 'Services',
    logos: [
      { name: 'Docker', icon: '/icons/services/docker.svg', location: { text: 'Docker', url: 'https://docker.local' } },
      { name: 'Service 2', icon: '/icons/services/', location: { text: 'Service 2', url: 'https://service2.local' } },
      { name: 'Service 3', icon: '/icons/services/', location: { text: 'Service 3', url: 'https://service3.local' } },
      { name: 'Service 4', icon: '/icons/services/', location: { text: 'Service 4', url: 'https://service4.local' } },
      { name: 'Service 5', icon: '/icons/services/', location: { text: 'Service 5', url: 'https://service5.local' } },
      { name: 'Service 6', icon: '/icons/services/', location: { text: 'Service 6', url: 'https://service6.local' } },
      { name: 'Service 7', icon: '/icons/services/', location: { text: 'Service 7', url: 'https://service7.local' } },
      { name: 'Service 8', icon: '/icons/services/', location: { text: 'Service 8', url: 'https://service8.local' } },
      { name: 'Service 9', icon: '/icons/services/', location: { text: 'Service 9', url: 'https://service9.local' } }
    ]
  }
};
