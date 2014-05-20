module.exports = function(schema, options) {
    options || (options = {});
    options.path || (options.path = '_acl');

    // Fields

    var fields = {};

    if (!schema.paths[options.path]) {
        fields[options.path] = {};
    }

    schema.add(fields);


    schema.pre('save', function (next) {
      if(!this.perms.write) 
      {
        var err = new Error('No writing permissions');
        next(err);
      }
      else next();
    });

    schema.methods.setAccess = function(key, perms, cb) {
        if(key instanceof Array){
            //this[options.path][]
            this.markModified(options.path);
            if(typeof cb == "object") this.save(cb);
            else this.save();
        }
        else
        {
            perms || (perms = []);
            this[options.path] || (this[options.path] = {});
            this[options.path][key] = perms;
            this.markModified(options.path);
        }
    };

    schema.methods.getAccess = function(key) {
        var acl = this[options.path] || {};
        return acl[key] || [];
    };

    var toJSON = schema.methods.toJSON;

    schema.methods.toJSON = function() {
        var data = toJSON ? toJSON.call(this) : this.toObject();
        delete data[options.path];
        return data;
    };

};