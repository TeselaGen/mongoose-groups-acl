
/*
 * @list dependencies
 */


module.exports = function(mongoose) {

	/*
	 * @method paginate
	 * @param {Object} query Mongoose Query Object
	 * @param {Number} pageNumber
	 * @param {Number} resultsPerPage
	 * Extend Mongoose Models to paginate queries
	 */

	mongoose.Query.prototype.acl = function(user,cb) {

		console.log("Passing through ACL");

		query = this;
		model = this.model;

		if (!cb) { throw new Error("acl needs a callback as the second argument."); }
		if (!user) { throw new Error("acl needs a user as first argument"); }



			return query.exec(function(err, docs) {
				if (err) {
					return cb(err, null, null);
				} else {
					if(docs instanceof Array)
					{
						return cb(null,docs.filter(function(doc,docIndex){
							user.getAccess(doc,function(err){
								if(err) {
									console.log("Document with no reading permissing, won't include it.");
									return false;
								}
								else return true;
							});		
						}));
						
					}
					else
					{
						user.getAccess(docs,function(){
							return cb(err,docs)
						});
					}
				}
			});

  	};
	
  	return {
  		object : require('./object'),
		subject : require('./subject')
	};
};