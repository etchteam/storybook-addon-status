import React from 'react';

import StatusTagBase from './StatusTagBase';

const SidebarStatusTag = ({ statusConfig }) => (
  <StatusTagBase
    label={statusConfig.label}
    status={statusConfig.status}
    variant="sidebar"
  />
);

export default SidebarStatusTag;
