# css-in-js support for Emmet

`apm install atom-emmet-css-in-js`

A companion package to `emmet-atom` which will expand css abbreviations into css-in-js object style.

![Animated gif showing example usage](/demo.gif?raw=true)

This will turn someting like `mt0` into `marginTop: 0` or `jfcsb` into `justifyContent: 'space-between'`.  
Check out [the emmet docs on css abbreviations](https://docs.emmet.io/css-abbreviations/#css-abbreviations) to learn more about how to use them.

### Keymap

This package does not assign a shortcut by default, you can run `Application: Open Your Keymap` from the Command Palette add one of your choosing to your `keymap.cson`:

```coffee
'atom-text-editor:not([mini])':
  'ctrl-w': 'atom-emmet-css-in-js:expand'
```

### Caveats

Note that this package requires `emmet-atom` to be installed and activated to work.
