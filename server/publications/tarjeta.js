import {Meteor} from "meteor/meteor";
import {Tarjeta} from "/lib/collections/tarjetas.js";

Meteor.publish("userTarjetas", function() {
  return Tarjeta.find({createdBy:this.userId},
    {last_digits:true, brand:true});
});

Meteor.publish("tarjetas_all",function(){
  return Tarjeta.find({},{last_digits:true,brand:true});
});
