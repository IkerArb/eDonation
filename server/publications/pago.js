import {Meteor} from "meteor/meteor";
import {Pago} from "/lib/collections/pago.js";

Meteor.publish("userPagos", function() {
  return Pago.find({createdBy:this.userId},
    {amount:true, issuedAt:true, tarjetaId:true});
}
