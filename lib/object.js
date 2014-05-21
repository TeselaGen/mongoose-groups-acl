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
      if(this.perms && !this.perms.write) 
      {
        var err = new Error('No writing permissions');
        next(err);
      }
      else next();
    });


    schema.statics.getAll = function(user,cb) {

            //var query = this;
            var model = this;

            var possibleKeys = [];
            possibleKeys["_acl."+user._id]= {$exists:true};
            if(user.groups)
            {

                groups = user.groups.map(function(p){
                  if(p._id) return p._id;
                  else return p;
                });

                groups.forEach(function(group){
                    possibleKeys["_acl."+group]= {$exists:true};
                });

                var orQuery = [];

                possibleKeys.forEach(function(key,value){
                    orQuery.push({key,value});
                });

            }

            console.log(possibleKeys);

            model.find({$or:[ '_acl.533a013c3167412c2600004b': { '$exists': true },
  '_acl.537a9e1a27ff4585e5000006': { '$exists': true } ]},{name:1}).exec(cb);
    };

    schema.methods.setAccess = function(key, perms, cb) {
        if(key instanceof Array){
            key = "*";
            perms || (perms = []);
            this[options.path] || (this[options.path] = {});
            this[options.path][key] = perms;
            this.markModified(options.path);
        }
        else
        {
            perms || (perms = []);
            this[options.path] || (this[options.path] = {});
            this[options.path][key] = perms;
            this.markModified(options.path);
        }
        console.log("Permissions updated");
        if(typeof cb == "function") this.save(cb);
        else this.save();
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