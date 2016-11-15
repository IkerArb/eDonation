import {Mongo} from "meteor/mongo";
import {Schemas, TabularTables} from "/lib/collections/schema.js";

Schemas.UserProfile2 = new SimpleSchema({
  fullName: {
    type: String,
    optional: false,
    label: "Nombre Completo"
  }
});

Schemas.User = new SimpleSchema({
    "email": {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        custom: function () {
          //Método de revisión asíncrona que avisa si el correo es válido o no
          if (Meteor.isClient && this.isSet) {
            //Checamos si se está editando un user mediante la variable de sesión
            var selectedUser = Session.get('selectedUser');
            //Mandamos a revisar si ya existe el correo
            Meteor.call("accountsIsEmailAvailable", this.value,selectedUser, function (error, result) {
              if (!result) {
                //Si ya existe regresa falso y manda error
                Schemas.User.namedContext("catalogo_alta_user").addInvalidKeys([{email: "email", type: "notUnique"}]);
                Materialize.toast('Ese correo ya está registrado con otro usuario', 4000,'red');
              }
            });
          }
        },
        autoform:{
          value: function(){
            if(Meteor.isClient){
              if(Session.get("selectedUser")){
                return Meteor.users.findOne({_id: Session.get("selectedUser")}).emails[0].address;
              }
            }
          }
        }
    },
    profile: {
        type: Schemas.UserProfile2
    },
    password:{
      type: String,
      autoform: {
        type: "password"
      }
    }
});

TabularTables.FuncionarioUsers = new Tabular.Table({
  name: "FuncionarioUsers",
  collection: Meteor.users,
  columns: [
    {data: "profile.fullName", title: "Nombre"},
		{data: "email()", title: "Email"},
    {data: "delete()", title: "Delete"},
    {data: "show()", title: "Show"}
  ],
  extraFields:['emails','services'],
  selector: function(){
    return {roles: ["admin"]};
  }
});
// Ocupamos el paquete dburles:collection-helpers para usar los helpers de coleccion
Meteor.users.helpers({
  email: function(){
    if(this.services.google){
      return this.services.google.email;
    }
    if(this.services.facebook){
      return this.services.facebook.email;
    }
    return this.emails[0].address;
  },
  delete: function () {
    if(this._id === Meteor.userId()){
      return '<td style="width: 70px"><button rel='+this._id+' class="btn btn-sm btn-danger disabled" type="button">Delete</button></td>';
    }
    return '<td style="width: 70px"><button rel='+this._id+' class="btn btn-sm btn-danger deleteUser" type="button">Delete</button></td>';
  },
  show: function () {
    if(this._id === Meteor.userId()){
      return '<td style="width: 70px"><button rel='+this._id+' class="btn btn-sm btn-success disabled" type="button">Show</button></td>';
    }
    return '<td style="width: 70px"><button rel='+this._id+' class="btn btn-sm btn-success showUser" type="button">Show</button></td>';
  }
});
