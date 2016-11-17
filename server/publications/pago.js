import {Meteor} from "meteor/meteor";
import {Pago} from "/lib/collections/pagos.js";

Meteor.publish("userPagos", function() {
  return Pago.find({createdBy:this.userId});
});

Meteor.publish("pagos_all", function(){
  if(Users.isInRole(this.userId, "admin")) {
		return Pago.find({}, {});
	}
	return this.ready();
});
