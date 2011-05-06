Listener
========

A no-frills cross-browser DOM event listener with [ender](http://ender.no.de) integration.

Features
--------

- 0.6kb gzipped (1.2kb minified)
- Cross-browser event listeners (IE6+, and everybody else)
- Cross-browser `preventDefault` and `stopPropagation`
- Event delegation with or without a selector engine
- Ender bridge with wrapper prototype methods

Installation
------------

Install with [npm](http://npmjs.org)

`$ npm install listener`

... or build with ender

`$ ender build listener`

... or just download and include like any other script.

Method signature overview
-------------------------

Please see full API docs down the page

```javascript
listener(params, handler)

listenerObj.attach()
listenerObj.detach()
listenerObj.fire([arg1, [argN]])

listener.preventDefault(event)
listener.stopPropagation(event)
```

Ender bridge

```javascript
// ender methods
ender.listener(params, handler)
ender.preventDefault(event)
ender.stopPropagation(event)

// ender element wrapper prototype methods
wrap.attach(event, handler)
wrap.detach(namespace)
wrap.fire(namespace)
wrap.delegate(event, delegation, handler)
```

Ender Integration
-----------------

When including a selector engine, include it before `listener`, and then you can delegate events with a selector supported by the engine.  Otherwise you can delegate with functions or a single tag selector.

The ender API is included at the end of the docs.

Tests
-----

The tests require qunit, it's a submodule so do this before running:

```shell
$ git submodule init
$ git submodule update
```

And then you can open the `tests/index.html` file in your browser.

Copyright / License
-------------------

(c) Ryan Florence 2011, MIT License








Listener API Documentation
==========================

Listener can be built with ender, see the "Ender Bridge Documentation" at the end.

listener
--------

Creates a new event listener object.

__Note__: When using a string for `delegate` you should define a selector engine with `listener._select = function(){...}`.  If you're building with ender, build the selector engine (like qwery) _before_ listener.  The Ender API bridge assigns the listener's engine to ender's, if it's undefined, you're hosed.

### Signature

```javascript
listener(params, handler)
```

1. `params` (__object__) - Key value pairs of parameters for the listener.

	- `node` (__element__) - A DOM element to attach the listener to.

	- `event` (__string__) - Which event to listen to, i.e. 'click'.

	- `capture` (__boolean__: default `false`) - Initiates capture. [W3 Reference](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
	- `delegate` (__mixed__) - Accepts a CSS selector or a function

		__Signature__

		`function (node)`

		__Arguments__

		1. `node` (__element__) - The element the event is listening on

		__Returns__ Array - You must return an element collection, or array of elements you want to be matched against the event target.

2. `handler` (__function__) - The event handler.

### Returns

__Object__ - A listener object.

### Examples

_A basic click listener_

```javascript
var params = {
  node: document.getElementById('foo'),
  event: 'click'
}
listener(params, function (){
  alert('hey!')
})
```

_Delegate with function_

```javascript
var params = {
  node: document.getElementById('foo'),
  event: 'click',
  delegate: function (node){
    // return a collection of elements
    // only buttons will fire the handler
    return node.getElementsByTagName('button')
  }
}

listener(params, function (){
  alert('hey!')
})
```

_Delegate with CSS selector_

```javascript
listener({
  node: document.getElementById('foo'),
  event: 'click',
  delegate: 'button' // same as above but uses the selector engine
}, function (){
  alert('hey!')
})
```


listenerObj.attach
---------------

Attaches the listener to the element.

### Signature

```javascript
listenerObj.attach()
```

### Returns

__undefined__

### Examples

```javascript
var listenerObj = listener({
  node: document.getElementById('foo'),
  event: 'click'
}, function (){
  alert('hey!')
})

listenerObj.detach()
// click does nothing

listenerObj.attach()
// click is attached again
```




listenerObj.detach
------------------

Detaches the listener from the element.

### Signature

```javascript
listenerObj.detach()
```

### Returns

__undefined__

### Examples

```javascript
var listenerObj = listener({
  node: document.getElementById('foo'),
  event: 'click'
}, function (){
  alert('hey!')
})

listenerObj.detach()
// click does nothing

listenerObj.attach()
// click is attached again
```





listenerObj.fire
----------------

Fires the handler of a listener object.

### Signature

```javascript
listener.fire([arg1, [argN]])
```

### Arguments

1. `arg1` (__mixed__: optional) - An argument to be passed to the handler, often a mock event object should be supplied.</li>
2. `argN` (__mixed__: optional) - Any number of arguments passed in will be applied to the handler.

### Returns

__undefined__

### Examples

```javascript
var listenerObj = listener({
  node: document.getElementById('foo'),
  event: 'keyup'
}, function (event){
  event.keyCode //> 'fake'
})

listenerObj.fire({keyCode: 'fake'})
```




listener.preventDefault
-----------------------

Cross-browser method to cancel an event without stopping further propagation of the event.

### Signature

```javascript
listener.preventDefault(event)
```
### Arguments

1. `event` (__event__) - A DOM event object

### Returns

__undefined__

### Examples

```javascript
listener({
  event: 'click',
  node: document.getElementById('foo')
}, function (event){
  listener.preventDefault(event) // cancels event
})
```

### Notes
See [MDC event.preventDefault](https://developer.mozilla.org/en/DOM/event.preventDefault)




listener.stopPropagation
------------------------

Cross-browser method to prevent bubbling (propagation) of an event.

### Signature

```javascript
listener.stopPropagation(event)
```

### Arguments

1. `event` (__event__) - A DOM event object

### Returns

__undefined__

### Examples

```javascript
listener({
  event: 'click',
  node: document.getElementById('foo')
}, function (event){
  listener.stopPropagation(event) // prevents bubbling
})
```

### Notes

See [MDC event.stopPropagation](https://developer.mozilla.org/en/DOM/event.stopPropagation)

Ender Bridge Documentation
==========================

When building with ender the `listener` function is returned to its previous definition and then added to the ender client-side API.

ender.listener
----------

Identical to `listener`, see docs above.

ender.preventDefault
----------------

Identical to `listener.preventDefault`, see docs above.

ender.stopPropagation
-----------------

Identical to `listener.stopPropagation`, see docs above.

ender.prototype.attach
------------------

Attaches an event handler to each element in the wrap.

### Signature

```javascript
wrap.attach(event, handler)
```

### Arguments

1. `event` (<b>string</b>) - The event handler to add, i.e. 'click'
2. `handler` (<b>function</b>) - The event handler.

### Returns

__Object__ - the `wrap`

### Examples


```javascript
// assumes you've got a selector engine
var wrap = $('#some-el')
wrap.attach('click', function (){
  // do something
})
```





ender.prototoype.detach
-----------------------

Detaches any event handlers added with a namespace from each element in the wrap.

### Signature

```javascript
wrap.detach(namespace)
```

### Arguments

1. `namespace` (__string__) - The namespace of events.

### Returns

__Object__ - the `wrap`

### Examples

```javascript
// assumes you've got a selector engine
var wrap = $('#some-el')
wrap.attach('click.foo', function (event){
  // do something
})
wrap.attach('mouseover.foo', function (event){
    // do something else
})

// later
wrap.detach('foo') // removes both listeners
```





ender.prototype.fire
--------------------

Fires any event handlers added with a namespace for each element in the wrap.

### Signature

```javascript
wrap.fire(namespace)
```

### Arguments

1. `namespace` (__string__) - The namespace of events.

### Returns

__Object__ - `wrap`

### Examples

```javascript
// assumes you've got a selector engine
var wrap = $('#some-el')
wrap.attach('click.foo', function (event){
  // do something
})
wrap.attach('mouseover.foo', function (event){
  // do something else
})

wrap.fire('foo') // fires both listeners
```

ender.prototype.delegate
------------------------

Delegates an event for each element in the wrapper.

### Signature

```javascript
wrap.delegate(event, delegation, handler)
```

### Arguments

1. `event` (<b>string</b>) - The event handler to add, i.e. 'click'

2. `delegation` (__mixed__) - Accepts a CSS selector or a function.

	__Signature__

	`function (node)`

	__Arguments__

	1. `node` (__element__) - The element the event is listening on

	__Returns__ Array - You must return an element collection, or array of elements you want to be matched against the event target.
	
3. `handler` (__function__) - The event handler.

### Returns

__Object__ - `wrap`

### Examples

_delegate with selector_

```javascript
// assumes you've got a selector engine
var wrap = $('#some-el')
wrap.delegate('click', 'a', function (event, target){
  // `this` and `target` are the clicked anchor tag
})
```

_delegate with function_

```javascript
var delegation = function (node){
  return node.getElementsByTagName('foo')
}

// assumes you've got a selector engine
var wrap = $('#some-el')
wrap.delegate('click', delegation, function (event, target){
  // do stuff with the target
})
```
