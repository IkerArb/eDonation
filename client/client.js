
import {Schemas,Collections} from "/lib/collections/schema.js";

Meteor.startup(function() {
  //Código para prender el debugger de Simple Schema
  SimpleSchema.debug = true;
});


// Establecemos el helper schema en el proyecto
Template.registerHelper("Schemas", Schemas);
// Establecemos el helper collections en el proyecto
Template.registerHelper("Collections", Collections);


// Configuracion autoform para agarrar estilos de materialize
AutoForm.setDefaultTemplate('materialize');


// Api google maps
