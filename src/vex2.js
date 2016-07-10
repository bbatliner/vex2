// Object.assign polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    'use strict'
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}

// Detect CSS Animation End Support
// https://github.com/limonte/sweetalert2/blob/99bd539f85e15ac170f69d35001d12e092ef0054/src/utils/dom.js#L194
var animationEndEvent = (function () {
  var el = document.createElement('div')
  var eventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'animationend',
    'OAnimation': 'oanimationend',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  }
  for (var i in eventNames) {
    if (el.style[i] !== undefined) {
      return eventNames[i]
    }
  }
  return false
})()

// vex base CSS classes
var baseClassNames = {
  vex: 'vex',
  content: 'vex-content',
  overlay: 'vex-overlay',
  close: 'vex-close',
  closing: 'vex-closing',
  open: 'vex-open'
}

// Basic string to DOM function
var stringToDom = function (str) {
  var testEl = document.createElement('div')
  testEl.innerHTML = str
  if (testEl.childElementCount === 0) {
    return document.createTextNode(str)
  }
  if (testEl.childElementCount === 1) {
    return testEl.firstElementChild
  }
  var frag = document.createDocumentFragment()
  // Appending the element from testEl will remove it from testEl.children,
  // so we store the initial length of children and then always append the first child
  for (var i = 0, len = testEl.children.length; i < len; i++) {
    frag.appendChild(testEl.children[0])
  }
  return frag
}

var vexes = {}
var globalId = 1

var vex = {
  open: function (opts) {
    // vex object
    var vexInstance = {}

    // Set id
    vexInstance.id = globalId++

    // Store internally
    vexes[vexInstance.id] = vexInstance

    // Set state
    vexInstance.isOpen = true

    // Function to handle escape keypress
    var escHandler = function (e) {
      if (e.keyCode === 27) {
        vexInstance.close()
      }
    }

    // Close function on the vex object
    vexInstance.close = function () {
      // Check state
      if (!this.isOpen) {
        return true
      }

      var options = this.options

      var beforeClose = function () {
        if (options.beforeClose) {
          return options.beforeClose.call(this)
        }
        return true
      }.bind(this)

      var close = function () {
        if (!this.rootEl.parentNode) {
          return
        }
        // Run once
        this.rootEl.removeEventListener(animationEndEvent, close)
        // Remove the dialog from the DOM
        this.rootEl.parentNode.removeChild(this.rootEl)
        // Remove styling from the body during the next tick
        setTimeout(function () {
          document.body.classList.remove(baseClassNames.open)
        }, 0)
        // Call after close callback
        if (options.afterClose) {
          options.afterClose.call(this)
        }
      }.bind(this)

      if (beforeClose() === false) {
        return false
      }

      // Update state
      this.isOpen = false

      // Detect animation support
      var style = window.getComputedStyle(this.contentEl)
      function hasAnimationPre (prefix) {
        return style.getPropertyValue(prefix + 'animation-name') !== 'none' && style.getPropertyValue(prefix + 'animation-duration') !== '0s'
      }
      var hasAnimation = hasAnimationPre('') || hasAnimationPre('-webkit-') || hasAnimationPre('-moz-') || hasAnimationPre('-o-')

      // Close the vex
      if (animationEndEvent && hasAnimation) {
        this.rootEl.addEventListener(animationEndEvent, close)
        this.rootEl.classList.add(baseClassNames.closing)
      } else {
        close()
      }

      // Cleanup global handler for ESC
      window.removeEventListener('keyup', escHandler)

      return true
    }

    // TODO ESC key closes all vex dialogs
    // Register global handler for ESC
    window.addEventListener('keyup', escHandler)

    // Allow strings as content
    if (typeof opts === 'string') {
      opts = {
        content: opts
      }
    }
    var options = vexInstance.options = Object.assign({}, vex.defaultOptions, opts)

    // vex
    var rootEl = vexInstance.rootEl = document.createElement('div')
    rootEl.classList = baseClassNames.vex
    if (options.className) {
      rootEl.classList.add(options.className)
    }

    // Overlay
    var overlayEl = vexInstance.overlayEl = document.createElement('div')
    overlayEl.classList = baseClassNames.overlay
    if (options.overlayClassName) {
      overlayEl.classList.add(options.overlayClassName)
    }
    if (options.overlayClosesOnClick) {
      overlayEl.addEventListener('click', function (e) {
        if (e.target === overlayEl) {
          vexInstance.close()
        }
      })
    }
    rootEl.appendChild(overlayEl)

    // Content
    var contentEl = vexInstance.contentEl = document.createElement('div')
    contentEl.classList = baseClassNames.content
    if (options.contentClassName) {
      contentEl.classList.add(options.contentClassName)
    }
    contentEl.appendChild(options.content instanceof window.Node ? options.content : stringToDom(options.content))
    rootEl.appendChild(contentEl)

    // Close button
    if (options.showCloseButton) {
      var closeEl = vexInstance.closeEl = document.createElement('div')
      closeEl.classList = baseClassNames.close
      if (options.closeClassName) {
        closeEl.classList.add(options.closeClassName)
      }
      closeEl.addEventListener('click', vexInstance.close.bind(vexInstance))
      contentEl.appendChild(closeEl)
    }

    // Inject DOM
    document.querySelector(options.appendLocation).appendChild(rootEl)

    // Call after open callback
    if (options.afterOpen) {
      options.afterOpen.call(vexInstance)
    }

    // Apply styling to the body during the next tick
    setTimeout(function () {
      document.body.classList.add(baseClassNames.open)
    }, 0)

    return vexInstance
  },

  close: function (vexOrId) {
    var id
    if (vexOrId.id) {
      id = vexOrId.id
    } else if (typeof vexOrId === 'string') {
      id = vexOrId
    } else {
      throw new TypeError('close requires a vex object or id string')
    }
    return vexes[id].close()
  },

  closeAll: function () {
    for (var id in vexes) {
      this.close(id)
    }
    return true
  },

  getAll: function () {
    return vexes
  },

  getById: function (id) {
    return vexes[id]
  }
}

vex.defaultOptions = {
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

// TODO Loading symbols?

vex.registerPlugin = function (plugin, name) {
  var pluginName = name || plugin.name
  if (vex[pluginName]) {
    throw new Error('Plugin ' + name + ' is already registered.')
  }
  vex[pluginName] = plugin(vex)
  for (var prop in plugin) {
    if (plugin.hasOwnProperty(prop) && prop !== 'name') {
      vex[pluginName][prop] = plugin[prop]
    }
  }
}

module.exports = vex
