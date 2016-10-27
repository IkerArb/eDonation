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
        console.log(error.reason);
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
};

Template.payment_method.events({
  "click #altaTarjeta": function(){
    var nombrePortador = $("#nameHolder").val();
    if(nombrePortador===""){
      $("#nameHolder").addClass("invalid");
      Materialize.toast("Porfavor ingresa un nombre de portador",4000);
    }
    var numeroTarjeta;
    var expYear;
    var expMonth;
    var cvc;
    tokenParams = {
      "card": {
        "number": numeroTarjeta,
        "name": nombrePortador,
        "exp_year": expYear,
        "exp_month": expMonth,
        "cvc": cvc
      }
    };
    Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
  }
});
