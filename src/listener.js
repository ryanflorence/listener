/*!
 * listener.js - (c) Ryan Florence 2011
 * github.com/rpflorence/listener
 * MIT License
 */
!function (context, document){
  var _listener = context.listener
    , add    = document.addEventListener ? 'addEventListener' : 'attachEvent'
    , remove = document.addEventListener ? 'removeEventListener' : 'detachEvent'
    , prefix = document.addEventListener ? '' : 'on'
    , index  = [].indexOf
    , indexOf = index 
        ? function(item, array){
          return index.call(array, item)
        }
        : function (item, array){
          for (var i = 0, l = array.length; i < l; i++)
            if (array[i] === item)
              return i
          return -1
        }
    , bind = function (fn, context){
        return function (){
          fn.apply(fn, arguments)
        }
      }

  var listener = context.listener = function (params, handler){
    if (params.delegate){
      params.capture = true
      _handler = handler
      handler = function (event){
        // adapted from Zepto
        var target = event.target || event.srcElement,
            nodes = typeof params.delegate == 'string'
              ? listener._select(params.delegate, params.node)
              : params.delegate(params.node)

        while (target && indexOf(target, nodes) == -1 )
          target = target.parentNode

        if (target && !(target === this) && !(target === document))
          _handler.call(target, event, target)
      }
    }

    if (params.context)
      handler = bind(handler, params.context)

    var methods = {
      attach: function (){
        params.node[add](prefix + params.event, handler, params.capture)
      },

      detach: function (){
        params.node[remove](prefix + params.event, handler, params.capture)
      },

      fire: function (){
        handler.apply(params.node, arguments)
      }
    }

    methods.attach()

    return methods
  }

  // super simple selector "engine"
  listener._select = function (tag, root){
    return (root || document).getElementsByTagName(tag)
  }

  listener.stopPropagation = function (event){
    if (event.stopPropagation)
      event.stopPropagation()
    else
      event.cancelBubble = true
  }

  listener.preventDefault = function (event){
    if (event.preventDefault)
      event.preventDefault()
    else
      event.returnValue = false
  }

  listener.noConflict = function (){
    context.listener = _listener
    return listener
  }

  ;(typeof module != 'undefined' && module.exports && (module.exports = listener))

}(this, document);
