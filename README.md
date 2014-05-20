mongoose-grops-acl
===

Usage
---

```javascript
var mongoose = require('mongoose');
var acl = require('mongoose-groups-acl');

var ResourceSchema = new mongoose.Schema({ … });
ResourceSchema.plugin(acl.object);

var UserSchema = new mongoose.Schema({ … });
UserSchema.plugin(acl.subject);
```
    
Methods
---
Getting and setting the permissions for a given resource:

```javascript
var user = …;

user.setAccess(resource, ['read', 'write', 'delete']);
user.getAccess(resource); // => ['read', 'write', 'delete']
```
    
We can query for all resources to which a particular subject has access:

```javascript
Resource.withAccess(user, ['read']).exec(function(err, resources) {
    ...
});
```

For Using Groups (optional)
---
    var GroupSchema = new Schema({
        name: {type: String, default: "Standard"}
    })

    GroupSchema.plugin(acl.subject);

    var UserSchema = new Schema({
        groups: [{type: oIDRef, ref: 'group'}]
            ...
    });

    UserSchema.plugin(acl.subject);

    
Options
---

### Resource

We can specify the path in which the ACL will be stored (by default it will be available at `_acl`):

```javascript
ResourceSchema.plugin(acl.object, {
    path: '_acl'
});
```
        
There is one special key referred to as the public key.  If set, the associated permissions will apply to all subjects:

```javascript
UserSchema.plugin(acl.subject, {
    public: '*'
});
```

Install
---

    npm install mongoose-groups-acl
    
Tests
---

    npm test