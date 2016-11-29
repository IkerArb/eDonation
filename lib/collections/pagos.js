import {Mongo} from "meteor/mongo";
import {Schemas, TabularTables} from "/lib/collections/schema.js";
import {Tarjeta} from "/lib/collections/tarjetas.js";

export const Pago = new Mongo.Collection("Pago");

Pago.userCanInsert = function(userId, doc) {
  return true;
};

Pago.userCanUpdate = function(userId, doc) {
  return false;
};

Pago.userCanRemove = function(userId, doc) {
  return false;
};

// Declaramos esquemas de coleccion
Schemas.Pago = new SimpleSchema({
  amount:{
    type:String
  },
  tarjetaId:{
    type:String
  }
});

TabularTables.Pago = new Tabular.Table({
  name: "Pago",
  collection: Pago,
  columns: [
    {data: "_id", title: "Id Pago"},
    {data: "createdAt", title: "Fecha Creación"},
    {data: "nombreUser()", title:"Nombre Usuario"},
    {data: "tarjetaHelper()", title:"Tarjeta"},
    {data: "amount", title:"Cantidad"}
  ],
  extraFields:['createdBy','tarjeta'],
  responsive: true,
	autoWidth: false,
});
// Ocupamos el paquete dburles:collection-helpers para usar los helpers de coleccion
Pago.helpers({
  nombreUser(){
    var userObject = Meteor.users.findOne(this.createdBy);
    if(userObject.services.google){
      return userObject.services.google.name;
    }
    if(userObject.services.facebook){
      return userObject.services.facebook.name;
    }
    return userObject.profile.name;
  },
  tarjetaHelper(){
    var tarjetaLogo;
		if(this.tarjeta.brand=='amex'){
			tarjetaLogo = 'fa-cc-amex';
		}
		if(this.tarjeta.brand=='visa'){
			tarjetaLogo = 'fa-cc-visa';
		}
		if(this.tarjeta.brand=='mastercard'){
			tarjetaLogo = 'fa-cc-mastercard';
		}
    return '<i class="fa '+tarjetaLogo+' fa-2x" style="display:inline-block" aria-hidden="true"></i><p style="display:inline-block;margin-left:10px;">****'+this.tarjeta.last_digits+'</p>';
  }
});
