import {Meteor} from "meteor/meteor";
import {Tarjeta} from "/lib/collections/tarjeta.js";

Meteor.publish("userTarjetas", function() {
  return Tarjeta.find({createdBy:this.userId},
    {last_digits:true, brand:true});
}
