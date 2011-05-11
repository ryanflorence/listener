!function (context, $){
  var listener = context.listener.noConflict()
  // add $.listener
  $.ender({
    listener: listener,
    preventDefault: listener.preventDefault,
    stopPropagation: listener.stopPropagation
  })

  // set the selector engine to ender's
  if ($._select) $.listener._select

  // add wrapper prototype methods
  $.ender({
    attach: function (event, handler, /* internal */ delegation){
      var split = event.split('.'),
          listeners = []

      if (split[1])
        listeners = store(this.selector, split[1]) || []

      for (var i = 0, l = this.length, element, params; i < l; i++) {
        params = {
          node: this[i],
          event: split[0]
        }

        if (delegation)
          params.delegate = delegation

        listeners.push($.listener(params, handler))
      }

      if (split[1])
        store(this.selector, split[1], listeners)

      return this
    },

    detach: function (namespace){
      listenerMethod(this, 'detach', namespace, null, true)
      store(this.selector, namespace, null)
      return this
    },

    fire: function (namespace, arguments){
      return listenerMethod(this, 'fire', namespace, arguments)
    },

    delegate: function (event, delegation, handler){
      return this.attach(event, handler, delegation)
    }
  }, true)

  var storage = {}

  function store (selector, key, value){
    var data = storage[selector]

    if (!data)
      data = storage[selector] = {}

    if (value === void+1)
      return data[key]

    return data[key] = value
  }

  function listenerMethod (wrapper, method, namespace, arguments){
    var data = store(wrapper.selector, namespace)

    if (data)
      for (var i = 0, l = data.length; i < l; i++)
        data[i][method].apply(wrapper, arguments)

    return wrapper
  }
}(this, ender || $);
