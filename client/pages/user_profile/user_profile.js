import {Tarjeta} from '/lib/collections/tarjetas.js';
import {Pago} from '/lib/collections/pagos.js';


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

Template.user_profile.rendered = function(){
  $('.modal-trigger').leanModal();
  $('ul.tabs').tabs();
  Session.setPersistent("tipoDonacion","Unica");
};

Template.user_profile.helpers({
  userName(){
		 if(Meteor.user().services.google){
		    return Meteor.user().services.google.name;
		  }
		  if(Meteor.user().services.facebook){
		    return Meteor.user().services.facebook.name;
		  }
		  return Meteor.user().profile.name;
	},
  email(){
		if(Meteor.user().services.google){
		    return Meteor.user().services.google.email;
		  }
		  if(Meteor.user().services.facebook){
		    return Meteor.user().services.facebook.email;
		  }
		return Meteor.user().emails[0].address;
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
  pagosUser(){
    return Pago.find();
  },
  noRedesSociales(){
    return !(Meteor.user().services.facebook||Meteor.user().services.google);
  },
  currentName(){
    return Meteor.user().profile.name;
  },
  currentMail(){
    return Meteor.user().emails[0].address;
  }
});

Template.user_profile.events({
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
    var tarjetaId = e.target.id;
    Meteor.call("bajaTarjeta",tarjetaId,function(error,success){
      if(error){
        Materialize.toast(error.reason,4000);
      }
      else{
        Materialize.toast("Baja exitosa de tarjeta",4000);
      }
    });
  },
  "click #editProfile": function(e){
    $("#editUser").openModal();
  },
  "click #actualizarPerfil":function(e){
    var name = $("#nameUser").val();
    var email = $("#emailUser").val();
    if(name!==""&&email!==""){
      Meteor.call("updateNameAndEmail",Meteor.userId(),name,email,function(e,r){
        if(e){
          Materialize.toast(e.reason,4000,"red");
        }
        else{
          Materialize.toast("Actualización del Perfil Exitosa",4000,'green');
        }
      });
    }
    else{
      Materialize.toast("Favor de llenar los campos correctamente",4000,"red");
    }
  }
});
