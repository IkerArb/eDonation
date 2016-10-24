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
        Tarjetas.insert({
          token:result._id,
          lastDigits:tokenParams.card.number.slice(-4),
          tarjetaBrand:Conekta.card.getBrand(tokenParams.card.number),
          cardToken:token,
          clientToken:result
        });
      }

    });
};

/* Después de recibir un error */

errorResponseHandler = function(error) {
  return console.log(error.message);
};

// Template.Tarjeta.helpers({
//     "tarjetas":function(){
//         return Tarjetas.find();
//     },
//     "error":function(){
//         return pageSession.get("error");
//     },
//     "isError":function(){
//         return pageSession.get("error")!=="";
//     }
// });
//
// Template.Tarjeta.events({
//     "submit #cardForm":function(e, t){
//         e.preventDefault();
//         console.log(e);
//         //t = e.target;
//         console.log(t);
//         tokenParams = {
//             "card": {
//                 "number": t.find('#card_number').value,
//                 "name": t.find('#card_name').value,
//                 "exp_year": t.find('#card_exp_year').value,
//                 "exp_month": t.find('#card_exp_month').value,
//                 "cvc": t.find('#card_cvc').value
//             }
//         };
//         Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
//     },
//     "click #clearTarjeta":function(e, t){
//         e.preventDefault();
//         Tarjetas.remove({_id:this._id});
//     }
// });
