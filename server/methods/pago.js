import {Meteor} from "meteor/meteor";
import {Pago} from "/lib/collections/pagos.js";
import {Tarjeta} from "/lib/collections/tarjetas.js";

Meteor.methods({
  'createDonacion':function(total,tarjetaId){
    var user = Meteor.users.findOne({_id:this.userId});
    userId = this.userId;
    var tarjeta = Tarjeta.findOne(tarjetaId);
    var description= "Donacion de "+user.profile.name+" a las "+Date.now();
    self = this;
    var fut = new Future();
    var chargeCreate = Meteor.wrapAsync(conekta.Charge.create,conekta.Charge);
    charge = "";
    chargeCreate({
      "description":description,
      "amount": total*100,
      "currency":"MXN",
      "reference_id":"9839-wolf_pack",
      "card": tarjeta.token,
      "details": {
        "name": "user.profile.name",
        "phone": "8888888888",
        "email": "user.profile.email",
        "customer": {
          "logged_in": true,
          "successful_purchases": 14,
          "created_at": 1379784950,
          "updated_at": 1379784950,
          "offline_payments": 4,
          "score": 9
        },
        "line_items": [{
          name:"Donación Única Unidos",
          description: "Imported From Mex.",
          unit_price: total*100,
          quantity: 1}],
        "billing_address": {
          "street1":"user.profile.domicilio.calle+user.profile.domicilio.numero",
          "street2": null,
          "street3": null,
          "city": "user.profile.domicilio.ciudad",
          "state":"user.profile.domicilio.estado",
          "zip": "user.profile.domicilio.codigoPostal",
          "country": "Mexico",
          "tax_id": "user.profile.facturacion.rfc",
          "company_name":"user.profile.facturacion.razonSocial",
          "phone": "77-777-7777",
          "email": "user.profile.email"
        }
      }
    }, function(err, res) {
        if(err){
          charge = err.message_to_purchaser;
          console.log(err);
          fut.return({msg:err,success:0});
        }
        else{
          charge = res.toObject();
          console.log(charge);
          var pagoId =Pago.insert({
            amount:total,
            tarjetaId:tarjetaId
          });

          // Meteor.call('correoPedidoCobrado',pedidoId);
          fut.return({msg:charge,success:1});
        }
    });
    var result = fut.wait();
    if(result.success===0){
      throw new Meteor.Error('falta-dir', result.msg.message_to_purchaser);
    }
    return result.sucess;
  }
});
