import {Tarjeta} from '/lib/collections/tarjetas.js';


var errorResponseHandler, successResponseHandler, tokenParams;
Conekta.setPublishableKey("key_FeHir2FBvSD4hTs29A7zJRA");
successResponseHandler = function(token) {
    tokenId=token;
    console.log("entro");
    console.log(tokenId);
    console.log(tokenParams);
    console.log(Conekta.card.getBrand(tokenParams.card.number));
    Meteor.call("saveClientConekta",tokenId.id,function(err,result){
      if(err){
        console.log(err.reason);
      }else{
        console.log(result);
        var docTarjeta = {
          token:result._id,
          last_digits:tokenParams.card.number.slice(-4),
          brand:Conekta.card.getBrand(tokenParams.card.number),
          card_token:token,
          client_token:result
        };
        Meteor.call("altaTarjeta",docTarjeta);
      }

    });
};

/* Después de recibir un error */

errorResponseHandler = function(error) {
  return console.log(error.message);
};

Template.payment_method.rendered = function(){
  $('.modal-trigger').leanModal();
  Session.set("cantidadADonar",500);
  Session.set("tipoDonacion","Unica");
};

Template.payment_method.helpers({
  selectedCard(){
    return Session.get("selectedTarjeta");
  },
  lastDigitsSeleccionada(){
    return Session.get("selectedTarjeta").last_digits;
  },
  brandSeleccionada(){
    var tarjeta = Session.get("selectedTarjeta");
		if(tarjeta.brand=='amex'){
			return 'fa-cc-amex';
		}
		if(tarjeta.brand=='visa'){
			return 'fa-cc-visa';
		}
		if(tarjeta.brand=='mastercard'){
			return 'fa-cc-mastercard';
		}
  },
  cantidadADonar(){
    return Session.get("cantidadADonar");
  },
  tipoDonacion(){
    return Session.get("tipoDonacion");
  },
  tarjetas(){
    return Tarjeta.find();
  },
  brand(){
    var tarjeta = this;
		if(tarjeta.brand=='amex'){
			return 'fa-cc-amex';
		}
		if(tarjeta.brand=='visa'){
			return 'fa-cc-visa';
		}
		if(tarjeta.brand=='mastercard'){
			return 'fa-cc-mastercard';
		}
  },
  isSelected(){
    if(Session.get('selectedTarjeta')._id==this._id){
      return 'selected';
    }
  }
});

Template.payment_method.events({
  "click #altaTarjeta": function(){

    var nombrePortador = $("#nameHolder").val();
    if(nombrePortador===""){
      $("#nameHolder").addClass("invalid");
      Materialize.toast("Porfavor ingresa un nombre de portador",4000);
    }

    var numeroTarjeta = $("#cardNumber").val();
    if(numeroTarjeta===""){
      $("#cardNumber").addClass("invalid");
      Materialize.toast("Porfavor ingresa el número de tarjeta",4000);
    }

    var expYear = "20" + $("#expirationYear").val();
    if(expYear===""){
      $("#expirationYear").addClass("invalid");
      Materialize.toast("Porfavor ingresa el año de expiración",4000);
    }

    var expMonth = $("#expirationMonth").val();
    if(expMonth===""){
      $("#expirationMonth").addClass("invalid");
      Materialize.toast("Porfavor ingresa el número de mes",4000);
    }

    var cvc = $("#cardKey").val();
    if(cvc===""){
      $("#cardKey").addClass("invalid");
      Materialize.toast("Porfavor ingresa el número de clave",4000);
    }
    tokenParams = {
      "card": {
        "number": numeroTarjeta,
        "name": nombrePortador,
        "exp_year": expYear,
        "exp_month": expMonth,
        "cvc": cvc
      }
    };
    console.log(tokenParams);
    Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
  },
  "click .delete-card":function(e){
    console.log(e.target);
    var borraSession = Session.get('selectedTarjeta')._id == e.target.id;
    var tarjetaId = e.target.id;
    console.log(tarjetaId);
    Meteor.call("bajaTarjeta",tarjetaId,function(error,success){
      if(error){
        Materialize.toast(error.reason,4000);
      }
      else{
        Materialize.toast("Baja exitosa de tarjeta",4000);
        if(borraSession){
          Session.set('selectedTarjeta','');
        }
      }
    });
  },
  "click .elige-tarjeta":function(e){
    Session.set('selectedTarjeta',this);
  },
  "click #confirmaPago":function(e){
    console.log("entro");
    if(Session.get("tipoDonacion")==="Unica"){
      Meteor.call('createDonacion',Session.get("cantidadADonar"),Session.get("selectedTarjeta")._id,
      function(error,success){
        if(error){
          Materialize.toast(error.reason);
        }
        else{
          Materialize.toast("Donación Única Exitosa",4000);
        }
      });
    }
  }
});
