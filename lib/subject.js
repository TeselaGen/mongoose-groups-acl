module.exports = function(schema, options) {
    options || (options = {});

    if (!options.key) {
        options.key = function() {
            return this._id;
        };
    }

    if (!options.additionalKeys) {
        options.additionalKeys = function() {
            return [];
        };
    }

    // Methods

    schema.methods.getAccessKeys = function() {
        var key = options.key.call(this);
        var additional = options.additionalKeys.call(this);
        var keys = [key, options.public].concat(additional);

        return keys.filter(function(key) {
            return !!key;
        });
    };

    schema.methods.getAccess = function(object,groups) {
        var accessKeys = this.getAccessKeys();

        if(object.groups)
        {
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

        var result = [];

        entries.forEach(function(perms) {
            perms.forEach(function(perm) {
                if (result.indexOf(perm) === -1) {
                    result.push(perm);
                }
            });
        });

        return result;
    };

    schema.methods.setAccess = function(object, perms) {
        var key = options.key.call(this);
        object.setAccess(key, perms);
    };
};