import defaultStatuses, { Statuses } from './default-statuses';

export default function statusBackground(status: string, statuses?: Statuses) {
  const availableStatuses = { ...defaultStatuses, ...(statuses || {}) };
  return availableStatuses[status]?.color || '#666';
}
