import {Pago} from "/lib/collections/tarjeta.js";

Pago.allow({
	insert: function (userId, doc) {
		return Pago.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Pago.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Pago.userCanRemove(userId, doc);
	}
});

Pago.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.createdBy) doc.createdBy = userId;
});

Pago.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

Pago.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Pago.before.remove(function(userId, doc) {

});

Pago.after.insert(function(userId, doc) {

});

Pago.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Pago.after.remove(function(userId, doc) {

});
