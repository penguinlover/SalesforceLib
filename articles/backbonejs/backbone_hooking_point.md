Backbone.js Hooks
=================

This article explains how Backbone synchronization works, the will be helpful if you want to use Backbone to any unstandard rest services. e.g. visualforce page

Keep in mind

*  Backbone uses jquery ajax ($.ajax) call to sync to server at the lowest level
*  Backbone uses method dispatch. E.g. create, read, update, delete all invoke the same 
   proxy method called **sync**

A very highlevel flow of sync process

Backbone.Collection.prototype.fetch  
&nbsp;&nbsp;-> Backbone.Collection.prototype.sync  
&nbsp;&nbsp;-> Backbone.sync  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-> $.ajax

Let's start at the lowest level

**Backbone.sync** is the core persistent function which is a wrapper of _jQuery.ajax_ function

```javascript
Backbone.sync = function(method, model, options){
  // ignored the code to extract type, url, contentType, data, etc. 
  //  params from method, model, options ...

  var xhr = $.ajax({
    type: 'POST'              // method.type
    url:  'api/projects/99'   // model.url
    data: { name: 'p1' }      // model.toJSON()
    success: options.success
    error:   options.error
    contentType: 'application/json'
  });
  return xhr;
}
```

**Backbone.Model.prototype.save

```javascript
// Backbone.Model.prototype.save
save: function(key, val, options) {
  // validate arguments
  // validate data that need to be saved
  // decide whether to parse the model data first
  // register callbacks !
  var custom_success = options.success // customized success function
  options.success = function(resp){    // official success function
    // bla bla
    if(custom_success) custom_success(model, resp, options);
  }
  // determine method type
  var xhr = this.sync(method, this, options);
  return xhr;
}
```

```javascript
// Backbone.Model.prototype.sync
sync: function() {
  return Backbone.sync.apply(this, arguments);
}
```

Hope it helps!
