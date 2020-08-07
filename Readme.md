# Storybook Addon Status

Storybook Status Addon can be used to add a component status label in [Storybook](https://storybook.js.org).

![React Storybook Screenshot](https://raw.githubusercontent.com/etchteam/storybook-addon-status/master/screenshot.png)

## Installation

```sh
npm install @etchteam/storybook-addon-status --save-dev
```

## Configuration

Then create a file called `main.js` in your storybook config.

Add the following content to it:

```js
module.exports = {
  addons: ['@etchteam/storybook-addon-status/register']
}
```

## Usage

Then write your stories like this:

```js
import React from 'react';

export default {
  title: 'BetterSoftwareLink',
  parameters: {
    status: 'stable' // stable | beta | deprecated
  },
};

export const defaultView = () => (
  <a href="https://makebetter.software">Make Better Software</a>
);
```

You'll get an awesome label injected in the top toolbar.

Made with ☕ at [Etch](https://etch.co)

## Migration guide

Need to [update your major version](Migration.md)?