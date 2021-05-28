export type StatusType =
  | 'beta'
  | 'deprecated'
  | 'stable'
  | 'releaseCandidate'
  | string;

export type CustomStatusType = {
  background?: string;
  color?: string;
  description: string;
};

export type CustomStatusTypes = {
  [key: string]: CustomStatusType;
};

export type AddonParameters = {
  type?: StatusType;
  statuses?: CustomStatusTypes;
  url?: string;
};
