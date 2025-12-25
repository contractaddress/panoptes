export function getStatusTooltip(status) {
  switch(status) {
    case 'online':
      return 'System is running normally';
    case 'offline':
      return 'System is currently offline';
    case 'warning':
      return 'System has warnings or issues';
    default:
      return 'Unknown status';
  }
}

export function getImageStyleClass(status) {
  switch(status) {
    case 'offline':
      return 'offline-image';
    case 'warning':
      return 'warning-image';
    default:
      return '';
  }
}
