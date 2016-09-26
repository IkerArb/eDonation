import {Mongo} from "meteor/mongo";
import {Schemas, TabularTables} from "/lib/collections/schema.js";

export const Blog = new Mongo.Collection("Blog");

Blog.userCanInsert = function(userId, doc) {
	return Users.isInRole(userId, "admin");
};

Blog.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRole(userId, "admin");
};

Blog.userCanRemove = function(userId, doc) {
	return userId && Users.isInRole(userId, "admin");
};

// Asignamos esquemas a la coleccion
Blog.attachSchema(Schemas.Blog);

// Declaramos esquemas de colección
Schemas.Blog = new SimpleSchema({
			titulo:{
				type:String,
				label:"Titulo",
				max:50,
				min:3
			},
			contenido:{
				type: String,
				label:"Contenido",
				autoform: {
    			afFieldInput: {
      			type: "textarea",
      			rows: 10,
    			}
  			}
			},
			// nivel_riesgo:{
			// 	type: String,
			// 	label:"Nivel de Riesgo",
			// 	autoform: {
      // 		options: [
      //   		{label: "Alto", value: "alto"},
      //   		{label: "Medio", value: "medio"},
      //   		{label: "Bajo", value: "bajo"}
      // 		]
    	// 	},
			// 	optional: true
			// },
			pictures:{
		    type: [String],
		    label: 'Choose file',
				optional: true
			},
		  "pictures.$":{
		    autoform:{
		      afFieldInput:{
		        type: 'file',
						value: ''
					}
				}
			}

});

// Declaramos tabla para desplegar coleccion
TabularTables.Blog = new Tabular.Table({
  name: "Blog",
  collection: Blog,
  columns: [
    {data: "titulo", title: "Titulo Aviso"},
		{data: "contenido", title: "Contenido"},
		{data: "createdAt", title: "Fecha de Creacion"},
    {data: "delete()", title: "Delete"},
    {data: "show()", title: "Show"}
  ],
	// Pasamos campos extra que utilizamos en nuestros collection helpers pero no queremos desplegar en la tabla
	extraFields:[],
	// Opciones para hacer la tabla responsiva
	responsive: true,
	autoWidth: false,
});
// Ocupamos el paquete dburles:collection-helpers para usar los helpers de coleccion
Blog.helpers({
  delete: function () {
    return '<td style="width: 70px"><button rel='+this._id+' class="btn btn-sm btn-danger deleteBlogPost" type="button">Delete</button></td>';
  },
  show: function () {
    return '<td style="width: 70px"><button rel='+this._id+' class="btn btn-sm btn-success showBlogPost" type="button">Show</button></td>';
  },

});
