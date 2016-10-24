import {Schemas} from '/lib/collections/schema.js';
import {User_Collection} from '/lib/collections/users.js';

Meteor.methods({
  // Método para revisar si el correo está disponible, nada más revisa que sea igual a 0
  // la búsqueda de ese elemento
  "accountsIsEmailAvailable": function(email,selectedUser){
    //Si es edición funciona distinto esto se checa para ver si nos mandaron selecteduser
    if(selectedUser){
      //Revisamos que no exista el correo mas que en el usuario editado
      return Meteor.users.find({emails:{$elemMatch:{address:email}},_id:{$ne:selectedUser}}).fetch().length===0;
    }
    //Si no es edición nada más revisamos que no exista ese correo
    return Meteor.users.find({emails:{$elemMatch:{address:email}}}).fetch().length===0;
  },
  //Método para crear usuarios funcionario donde checamos contra el esquema
  // y le agregamos campos extra y mandamos email de verificación
  "createUserAdmin": function(doc){
    check(doc,Schemas.User);
    doc.roles = ["admin"];
    var newUser = Accounts.createUser({email:doc.email,password:doc.password,profile:doc.profile});
    Meteor.users.update({_id:newUser},{$set:{roles:doc.roles}});
    Accounts.sendVerificationEmail(newUser);
  },
  deleteUser: function(userId){
    Meteor.users.update({_id:userId},{$set:{roles:["borrado"]}});
  },
  updateUser: function(doc,docId){
    check(doc,Schemas.User);
    //Usamos un auxiliar para modificar el objeto de entrada
    var aux = doc['$set'];
    //Sacamos el correo que vamos a borrar porque no respeta el esquema de accounts
    var email = aux.email;
    //Lo borramos
    delete aux.email;
    //Reasignamos la llave del set porque así se tiene que mandar al update
    doc['$set'] = aux;
    //Checamos que hubiera cambio de correo porque sino nos deja con los correos vacíos
    if(email!==Meteor.users.findOne({_id:docId}).emails[0].address){
      //Agregamos el nuevo correo primero
      Accounts.addEmail(docId,email);
      //Mandamos correo de verificación
      Accounts.sendVerificationEmail(docId,email);
      //Quitamos el correo viejo que teníamo
      Accounts.removeEmail(docId,Meteor.users.findOne({_id:docId}).emails[0].address);
    }
    //Hacemos un update de todos los demás campos mandados en la forma
    Meteor.users.update({_id:docId},doc,{filter: false, validate: false});
  },
  'saveClientConekta':function(tokenId){
    var user = Meteor.users.findOne({_id:this.userId});
    var fut = new Future();
    var clientCreate = Meteor.wrapAsync(conekta.Customer.create,conekta.Customer);
    clientCreate({
      "name": user.profile.name,
      "email": user.profile.email,
      "phone": "",
      "cards": [tokenId]
    }, function(err, res) {
        if(err){
          fut.return({msg:err,succes:0});
        }else{
          fut.return({succes:1,conekta:res});
        }
    });
    var result = fut.wait();
    if(result.succes===0){
      throw new Meteor.Error('falta-dir', result.msg.message_to_purchaser);
    }
    return result.conekta;
  }
});
