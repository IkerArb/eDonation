import {Mongo} from "meteor/mongo";
import {Schemas, TabularTables} from "/lib/collections/schema.js";

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
  issuedAt:{
    type:Date
  },
  tarjetaId:{
    type:String
  }
});
