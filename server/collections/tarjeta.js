import {Tarjeta} from "/lib/collections/tarjeta.js";

Tarjeta.allow({
	insert: function (userId, doc) {
		return Tarjeta.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Tarjeta.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Tarjeta.userCanRemove(userId, doc);
	}
});

Tarjeta.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.createdBy) doc.createdBy = userId;
});

Tarjeta.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

Tarjeta.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Tarjeta.before.remove(function(userId, doc) {

});

Tarjeta.after.insert(function(userId, doc) {

});

Tarjeta.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Tarjeta.after.remove(function(userId, doc) {

});
