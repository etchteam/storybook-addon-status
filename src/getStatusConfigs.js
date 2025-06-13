import { defaultStatuses } from './defaults';

const combineTagsAndParameters = (tags, parameters) => {
  // If there are no parameter statuses, we only use the tags.
  if (!parameters) {
    return tags ?? [];
  }

  // If parameters is an array, there are multiple statuses.
  if (Array.isArray(parameters)) {
    return [...tags, ...parameters];
  }

  // If parameters is a string or an object, it's a single status.
  if (typeof parameters === 'string' || typeof parameters === 'object') {
    return [...tags, parameters];
  }

  // We shouldn't get here but if we do, return an empty array.
  return [];
};

const filterStatuses = (statuses) => {
  const filteredStatuses = [];
  const existingNames = [];

  statuses.forEach((status) => {
    const name = typeof status === 'string' ? status : status.name;
    if (!existingNames.includes(name)) {
      filteredStatuses.push(status);
      existingNames.push(name);
      return;
    }
    // If the same status is defined in both tags and parameters, it should only be included once -
    // parameter statuses override tag statuses as they may contain additional information.
    if (status.name) {
      const index = existingNames.indexOf(name);
      if (index !== -1) {
        filteredStatuses[index] = status;
      }
    }
  });

  return filteredStatuses;
};

export const getStatusConfigs = ({ tags, parameters, customConfigs }) => {
  // If there are no statuses from either parameters or tags, return an empty array.
  if (!parameters && !tags?.length) {
    return [];
  }

  // Combine the tag and parameter statuses into a single array.
  const combinedStatuses = combineTagsAndParameters(tags, parameters?.type);

  // Filter out duplicate statuses based on their names.
  const statuses = filterStatuses(combinedStatuses);

  // Combine the default and custom status configs.
  // If there's no custom configs, try to use the status configs from parameters.
  const statusConfigMap = {
    ...defaultStatuses,
    ...(customConfigs || parameters?.statuses || {}),
  };

  // Map the status names to their configurations.
  let statusConfigs = statuses.map((status) => {
    if (typeof status === 'string') {
      return {
        label: status,
        status: statusConfigMap[status],
        url: parameters?.url,
      };
    }

    return {
      label: status.name,
      status: statusConfigMap[status.name],
      url: status.url,
    };
  });

  // Remove any missing status configurations
  statusConfigs = statusConfigs.filter((x) => x.status != null);

  return statusConfigs;
};
