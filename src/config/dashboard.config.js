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
      uptime: '45 days, 12:34:56'
    }
  },
  smallTiles: [
    { title: 'OpenWRT', status: 'online', icon: '/icons/openwrt.svg' },
    { title: 'Pi-hole', status: 'online', icon: '/icons/pi-hole.svg'},
    { title: 'Immich', status: 'online', icon: '/icons/immich.svg'},
    { title: 'Wireguard', status: 'online', icon: '/icons/wireguard.svg' }
  ],
  servicesCard: {
    title: 'Services',
    status: 'online',
    logos: [
      { name: 'Service 1', icon: null },
      { name: 'Service 2', icon: null },
      { name: 'Service 3', icon: null },
      { name: 'Service 4', icon: null },
      { name: 'Service 5', icon: null },
      { name: 'Service 6', icon: null },
      { name: 'Service 7', icon: null },
      { name: 'Service 8', icon: null },
      { name: 'Service 9', icon: null }
    ]
  }
};
