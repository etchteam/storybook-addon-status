import React from 'react';

import Header from './Header';

// Demo of meta vs story level tags.
//
//   meta:      ['stable', 'releaseCandidate']
//   LoggedIn:  ['stable', 'releaseCandidate']           (inherits)
//   LoggedOut: ['releaseCandidate', 'beta']             (negates 'stable', adds 'beta')
//
// Storybook computes a non-leaf node's tags as the intersection of its
// descendants' tags, so the Header component sidebar entry shows only
// 'releaseCandidate' — the one status both stories share.
export default {
  title: 'Example/Header',
  component: Header,
  tags: ['stable', 'releaseCandidate'],
};

const Template = (args) => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
LoggedOut.tags = ['!stable', 'beta'];
