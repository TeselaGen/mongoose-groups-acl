mongoose-grops-acl
===

Usage
---

```javascript
var mongoose = require('mongoose');
var acl = require('mongoose-groups-acl');

var ObjectSchema = new mongoose.Schema({ … });
ObjectSchema.plugin(acl.object);

var UserSchema = new mongoose.Schema({ … });
UserSchema.plugin(acl.subject);
```
    
Methods
---
Getting and setting the permissions for a given object:

```javascript
var user = …;

user.setAccess(object, ['read', 'write', 'delete']);
user.getAccess(object); // => ['read', 'write', 'delete']
```
    
We can query for all objects to which a particular subject has access:

```javascript
Object.withAccess(user, ['read']).exec(function(err, objects) {
    ...
});
```
    
Options
---

### Object

We can specify the path in which the ACL will be stored (by default it will be available at `_acl`):

```javascript
ObjectSchema.plugin(acl.object, {
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