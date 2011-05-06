// src/ender.js removed the listener function from the window,
// just putting it back here for the tests
var listener = $.listener

function simulateClick (element){
  if (!document.createEvent){
    element.click() // IE
    return
  }

  var e = document.createEvent("MouseEvents")
  e.initEvent("click", true, true)
  element.dispatchEvent(e)
}


module('listener')
test('a listener should', function (){

  var fixture = document.getElementById('fixture')
    , c = 0

  // api: listener object creation
  var l = listener({
    node: fixture,
    event: 'click'
  }, function (event){
    c++
  })

  simulateClick(fixture)
  equal(c, 1, 'attach to an element and call the handler upon event')

  l.detach() // api
  simulateClick(fixture)
  equal(c, 1, 'be detachable')

  l.attach() // api
  simulateClick(fixture)
  equal(c, 2, 'be attachable')

  l.fire() // api
  equal(c, 3, 'be fireable')

  l.detach()
})

test('a listener that delegates with a function should', function (){

  var fixture = document.getElementById('fixture')
    , delegatee = document.getElementById('delegatee')
    , notDelegatee = document.getElementById('notDelegatee')
    , c = 0

  // api: event delegation w/o a selector engine
  var l = listener({
    node: fixture,
    event: 'click',
    delegate: function (node){
      // return a collection or array of elements
      return node.getElementsByTagName('a')
    }
  }, function (event){
    c++
  })

  simulateClick(delegatee)
  equal(c, 1, 'delegate events')

  simulateClick(fixture)
  equal(c, 1, 'not fire when self is clicked')

  simulateClick(notDelegatee)
  equal(c, 1, 'not fire when non-matching elements are clicked')

  l.detach()
})

test('a listener that delegates with a css string should', function (){

  var fixture = document.getElementById('fixture')
    , delegatee = document.getElementById('delegatee')
    , notDelegatee = document.getElementById('notDelegatee')
    , c = 0

  // api: event delegation w/o a selector engine
  var l = listener({
    node: fixture,
    event: 'click',
    delegate: 'a'
  }, function (event){
    c++
  })

  simulateClick(delegatee)
  equal(c, 1, 'delegate events')

  simulateClick(fixture)
  equal(c, 1, 'not fire when self is clicked')

  simulateClick(notDelegatee)
  equal(c, 1, 'not fire when non-matching elements are clicked')

  l.detach()
})

test('preventDefault should', function (){
  var el = document.getElementById('preventDefault')

  listener({
    node: el,
    event: 'click'
  }, function (event){
    listener.preventDefault(event)
  })

  simulateClick(el)

  equal(location.hash, '', 'prevent the default event')
})

test('stopPropagation should', function (){
  var el = document.getElementById('stopPropagation')

  listener({
    node: el,
    event: 'click'
  }, function (event){
    listener.preventDefault(event)
  })

  simulateClick(el)

  notEqual(location.hash, '#fail', 'prevent bubbling')
})


module('ender')
test('listener', function (){
  // simple selector engine
  $._select = function (tag, root){
    if (typeof tag != 'string')
      return [tag]
    return (root || document).getElementsByTagName(tag)
  }
  
  var wrap = $(document.getElementById('fixture'))
    , c = 0

  wrap.attach('click.foo', function (){
    c++
  })

  simulateClick(wrap[0])
  equal(c, 1, 'namespaced events should be added')

  wrap.fire('foo')
  equal(c, 2, 'namespaced events should be fired')

  wrap.detach('foo')
  simulateClick(wrap[0])
  equal(c, 2, 'detach should remove namespaced events')

  wrap.fire('foo')
  equal(c, 2, 'namespaced events should not be fired after being detached')
})