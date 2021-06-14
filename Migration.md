# Migration guide

## 3.0.2 -> 4.0.0

### Custom statuses
Update the parameters config in `preview.js`:

```
export const parameters = {
  state: {
    statuses: {
      [... custom statuses]
    },
  },
};
```

Statuses in stories should now be written as an object:

```
export default {
  title: 'BetterSoftwareLink',
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated' | 'releaseCandidate'
      url: 'http://www.url.com/status', // will make the tag a link
      statuses: {...} // add custom statuses for this story here
    }
  },
};
```

## 1.0.1 -> 2.0.0

[Matt Stow](https://github.com/stowball) pointed out we used 'depreciated' incorrectly when it should be 'deprecated'.

You'll need to find and replace `status: 'depreciated'` > `status: 'deprecated'`.
