import {Schemas} from '/lib/collections/schema.js';
import {Tarjeta} from '/lib/collections/tarjetas.js';

Meteor.methods({
  'altaTarjeta':function(doc){
    console.log(doc);
    // check(doc,Schemas.Tarjeta);
    return Tarjeta.insert(doc);
  },
  'bajaTarjeta':function(id){
    var customerId = Tarjeta.findOne({_id:id}).token;
    console.log(customerId);
    var fut = new Future();
    var bajaTarjeta = Meteor.wrapAsync(conekta.Customer.find,conekta.Customer);
    bajaTarjeta(customerId, function(err, customer) {
      customer.delete(function(err, res) {
        if(err){
          fut.return({msg:err,succes:0});
        }else{
          fut.return({succes:1,conekta:res});
        }
      });
    });
    var result = fut.wait();
    if(result.succes===0){
      throw new Meteor.Error('falta-dir', result.msg.message_to_purchaser);
    }
    Tarjeta.remove(id);
    return result.conekta;
  }
});
