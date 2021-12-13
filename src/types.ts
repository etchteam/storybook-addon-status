export type StatusType =
  | 'beta'
  | 'deprecated'
  | 'stable'
  | 'releaseCandidate'
  | string;

export type UrlStatusType = {
  name: StatusType,
  url: string;
};

export type CustomStatusType = {
  background?: string;
  color?: string;
  description: string;
};

export type CustomStatusTypes = {
  [key: string]: CustomStatusType;
};

export type StatusVersion = string

export type AddonParameters = {
  type?: StatusType | (StatusType | UrlStatusType)[];
  statuses?: CustomStatusTypes;
  url?: string;
  version? : StatusVersion
};
