export const defaultBackground = '#2f2f2f';
export const defaultColor = '#ffffff';

export const defaultStatus = {
  color: defaultColor,
  background: defaultBackground,
};

export const defaultStatuses = {
  beta: {
    color: '#ffffff',
    background: '#ec942c',
    description: 'The interface for this component may change',
  },
  deprecated: {
    color: '#ffffff',
    background: '#f02c2c',
    description: 'This component will be removed in the next major version',
  },
  stable: {
    color: '#ffffff',
    background: '#339902',
    description: 'This component is stable',
  },
  releaseCandidate: {
    color: '#ffffff',
    background: '#a335ee',
    description: 'This component is a release candidate',
  },
};
