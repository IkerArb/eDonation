import {Mongo} from "meteor/mongo";
import {Schemas, TabularTables} from "/lib/collections/schema.js";

export const Tarjeta = new Mongo.Collection("Tarjeta");

Tarjeta.userCanInsert = function(userId, doc) {
  //TODO validar
  return true;
};

Tarjeta.userCanUpdate = function(userId, doc) {
  //TODO validar
  return true;
};

Tarjeta.userCanRemove = function(userId, doc) {
  //TODO validar
  return true;
};

// Declaramos esquemas de coleccion
Schemas.Tarjeta = new SimpleSchema({
  token:{
    type:String
  },
  last_digits:{
    type:String
  },
  brand:{
    type:String
  },
  card_token:{
    type:String
  },
  client_token:{
    type:Object
  }
});
