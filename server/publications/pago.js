import {Meteor} from "meteor/meteor";
import {Pago} from "/lib/collections/pagos.js";

Meteor.publish("userPagos", function() {
  return Pago.find({createdBy:this.userId});
});
