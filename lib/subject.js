module.exports = function(schema, options) {
    options || (options = {});

    if (!options.key) {
        options.key = function() {
            return this._id;
        };
    }

    schema.methods.getAccessKeys = function() {
        var key = options.key.call(this);
        var keys = [key, options.public];

        return keys.filter(function(key) {
            return !!key;
        });
    };

    schema.methods.getAccess = function(object,cb) {

        var accessKeys = this.getAccessKeys();

        if(this.groups)
        {
            groups = this.groups;
            // Groups are normalized to get the _id
            groups = groups.map(function(p){
              if(p._id) return p._id;
              else return p;
            });

            // Groups keys are concatenated with current object key    
            accessKeys = accessKeys.concat(groups);
        }


        var entries = accessKeys.map(function(key) {
            return object.getAccess(key);
        });

        var result = {};

        entries.forEach(function(perms) {
            perms.forEach(function(perm) {
                result[perm] = true;
            });
        });

        if(!result.read)
        {
            var err = new Error('No reading permissions');
            return cb(err);
        }

        object.perms = result;

        return cb(null,object);
    };

    schema.methods.setAccess = function(object, perms, cb) {
        var key = options.key.call(this);
        object.setAccess(key, perms);
        object.save(cb);
    };
};