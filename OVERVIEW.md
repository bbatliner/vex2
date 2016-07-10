## Getting started guide

### Installation

vex2 is available on npm and bower.

```
npm install vex2
bower install vex2
```

You can optionally [download](https://github.com/bbatliner/vex2/releases/v1.0.0) the project files.

### Basics of creating dialogs and passing content

Open a vex by calling `vex.open`.

```javascript
var dialog = vex.open('Hello, world!')
```

The user can close the dialog manually, or you can call `.close`.

```javascript
dialog.close()
```

### Options

When calling `vex.open` you can pass a number of options to handle styling and certain behaviors.

Here are the defaults:

```javascript
defaultOptions = {
  content: '',
  showCloseButton: true,
  escapeButtonCloses: true,
  overlayClosesOnClick: true,
  appendLocation: 'body',
  className: '',
  overlayClassName: '',
  contentClassName: '',
  closeClassName: ''
}
```

To learn more, see the [API docs](/docs/intro.md).

### Plugins

vex2 plugins are a great way to extend the functionality of vex while keeping your dependencies lightweight.
For these examples, we'll be using [vex2-dialog](https://github.com/bbatliner/vex2-dialog), a plugin for vex2 that contains dropin replacements for `alert`, `confirm`, and `prompt`.

#### Installing plugins

Plugins can be published individually to package managers such as npm or bower, or included locally. For vex2-dialog, we'll use npm.

```
npm install vex2-dialog
```

#### Registering plugins

All plugins must be registered with the main vex2 module.

```javascript
var vex = require('vex2') // or window.vex, if included via script tag
vex.registerPlugin(require('vex2-dialog')) // or window.vexDialog, if included via script tag

// The plugin is registered under the vex namespace.
vex.dialog.alert('I was made by a plugin!')
```

#### Writing your own plugins

For more info on plugins, see [Plugins](/PLUGINS.md).
