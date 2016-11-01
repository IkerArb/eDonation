import {Schemas} from '/lib/collections/schema.js';
import {Tarjeta} from '/lib/collections/tarjetas.js';

Meteor.methods({
  'altaTarjeta':function(doc){
    console.log(doc);
    // check(doc,Schemas.Tarjeta);
    return Tarjeta.insert(doc);
  },
  'bajaTarjeta':function(id){
    Tarjeta.remove(id);
  }
});
