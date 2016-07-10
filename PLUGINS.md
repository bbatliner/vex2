## Plugins

vex2 has support for plugins that can extend and modify the behavior of vex2.

### Structure of a vex2 plugin

A vex2 plugin is a simple function that returns an object containing that plugin's functionality. The 

For example, here is a basic plugin that will log a message every time a vex is opened using the plugin:

```javascript
var myFirstPlugin = function (vex) {
    return {
        open: function (options) {
            console.log('you opened a vex with a plugin!')
            return vex.open(options)
        }
    }
}

myFirstPlugin.name = 'myFirstPlugin'
```

Then, register your plugin with vex:

```javascript
vex.registerPlugin(myFirstPlugin)
vex.myFirstPlugin.open('Hello!') // logs 'you opened a vex with a plugin!'
// also opens a vex!
```
