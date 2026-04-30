import React from 'react';

import Button from './Button';

// Meta-level tag — every story under this title inherits 'beta' by default.
export default {
  title: 'Example/Tag overrides',
  component: Button,
  tags: ['beta'],
};

const Template = (args) => <Button {...args} />;

// Inherits the meta's 'beta' status.
export const InheritsFromComponent = Template.bind({});
InheritsFromComponent.args = { primary: true, label: 'Inherits beta' };

// Negates the inherited 'beta' tag and adds 'stable' instead.
// Resolved tags: ['stable'].
export const OverridesToStable = Template.bind({});
OverridesToStable.args = { primary: true, label: 'Overrides to stable' };
OverridesToStable.tags = ['!beta', 'stable'];

// Adds 'deprecated' on top of the inherited 'beta'.
// Resolved tags: ['beta', 'deprecated'].
export const AddsDeprecated = Template.bind({});
AddsDeprecated.args = { primary: true, label: 'Adds deprecated' };
AddsDeprecated.tags = ['deprecated'];
