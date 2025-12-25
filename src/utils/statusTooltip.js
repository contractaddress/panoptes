export function getStatusTooltip(status) {
  switch(status) {
    case 'online':
      return 'System is running';
    case 'offline':
      return 'System is offline';
    default:
      return 'Unknown status';
  }
}

export function getImageStyleClass(status) {
  switch(status) {
    case 'offline':
      return 'offline-image';
    default:
      return '';
  }
}
