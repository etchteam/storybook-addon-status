import * as HeaderStories from './Header.stories';
import { Page } from './Page';

export default {
  title: 'Example/Page',
  component: Page,
  parameters: {
    status: {
      type: 'customStatus',
    },
  },
};

const Template = (args) => <Page {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
};
