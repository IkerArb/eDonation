

Meteor.publish("users_all", function() {
	if(Users.isInRole(this.userId, "admin")) {
		return Meteor.users.find({}, {});
	}
	return this.ready();
});

Meteor.publish(null, function() {
// automatically publish the userType for the connected user
// no subscription is necessary
return Meteor.users.find(this.userId);
});
