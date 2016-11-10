import {Mongo} from "meteor/mongo";
import {Schemas, TabularTables} from "/lib/collections/schema.js";

export const Tarjeta = new Mongo.Collection("Tarjeta");

Tarjeta.userCanInsert = function(userId, doc) {
  return true;
};

Tarjeta.userCanUpdate = function(userId, doc) {
  return Tarjetas.findOne(doc._id).createdBy === userId;
};

Tarjeta.userCanRemove = function(userId, doc) {
  return Tarjetas.findOne(doc._id).createdBy === userId;
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
    type:Object
  },
  client_token:{
    type:Object
  }
});
