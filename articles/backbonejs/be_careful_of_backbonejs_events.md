Be Careful of Backbone.js Events
=================================

***************************

If you are using Backbone.js, inevitably, you need to deal with events. As a matter of fact it is at the heart of Javascript programming.

There are basically 3 types of events you probably need to take care.

**DOM event**

Binding to DOM events within the view element.

E.g. click a button in a person view to save the information
```javascript
class Person extends Backbone.View
  events:
    'click #save_person': 'saveModel'

  saveModel: ->
    @save()
```

**Events observed by your view**

Typically, when the data in the model changes, the view will observe the change event and update itself accordingly

E.g.
```javascript
class Person extends Backbone.View
  initialize: ->
    @collection.on 'change', @render # here this view observes events coming from the collection model
```

**Events your view publishes**

This can happen if you have different regions on a page, each regions contains some views and a view from region X want to notify region Y that something happened (or simply a view want to notify another view).

E.g.
```javascript
class Person extends Backbone.view
  events:
    'click #save_person' : 'saveModel'

  saveModel: ->
    @save
    @trigger 'person:save' # after save, broadcast custom event to whoever interested in observe

# suppose we use a region manager called center_region to manage our Person view
# and suppose side_region wants to know what happened in center region
var center_region = new RegionManager
var side_region = new RegionManager

center_region.set({ view: new Person })
center_region.view.on 'person:save', ->
  side_region.trigger 'person:save' # we simply trigger a event again in side_region
```

***************************

### However what really is important is to prevent memory leak when unbinding events. After all we close and open different views all the time.

**Unbind DOM events**

Easy, jQuery takes care of cleaning up any events bound to DOM.

**Unbind observed events from the view**

Note, this is important! Developer has the responsibility to unbind these events. Otherwise, memory leak...

Here is how: `@model.off()` or `@collection.off()`. This will unbind all event callbacks!

What if you have several views observe the same model events? You can provide a context. e.g. `object.off(null, null, context)` removes all callbacks from context.

What if you have several callbacks for the same model event? You can provide the callback name. e.g. `object.off("change", onChange)` only remove onChange callback.

**Unbind view published event callbacks**

You know the answer! Use `theView.off()` just like models and collections.

***************************

### Now you know all these mess, is anything way to make it consistent and more structured and form a best practice, yes here are some tips.

Use array to track resources and unbind events by just iterating the array.

Here is how:

```javascript
class SomeCollectionView extends Backbone.View
  initialize: ->
    @bindings = []
    @bindTo this.collection, "change", @render

  leave: ->
    @off()            # unbind view published event callbacks
    @unbindFromAll()  # unbind model/collection event callbacks
    @remove()         # unbind DOM events, jQuery does just that

  bindTo: (source, event, callback) ->
    source.on event, callback, this
    @bindings.push
      source: source
      event: event
      callback: callback

  unbindFromAll: ->
    _.each @bindings, (binding) ->
      binding.source.off binding.event, binding.callback
   @bindings = []
```

