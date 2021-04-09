export type Statuses = {
  [key: string]: {
    color: string;
    description: string;
  }
};

const defaultStatuses: Statuses = {
  beta: {
    color: '#ec942c',
    description: 'The interface for this component may change',
  },
  stable: {
    color: '#339900',
    description: 'This component is safe to use',
  },
  deprecated: {
    color: '#f02c2c',
    description: 'This component will be removed in the next major version',
  },
};

export default defaultStatuses;
