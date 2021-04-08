type Statuses = {
  [key: string]: string
};

const defaultStatuses: Statuses = {
  beta: '#ec942c',
  stable: '#339900',
  deprecated: '#f02c2c',
};

export default function statusBackground(status: string, statuses?: Statuses) {
  const availableStatuses = statuses || defaultStatuses;
  return availableStatuses[status] || '#666';
}
