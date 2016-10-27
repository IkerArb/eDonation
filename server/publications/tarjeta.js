import {Meteor} from "meteor/meteor";
import {Tarjeta} from "/lib/collections/tarjeta.js";

//Meteor.publish("blogPosts", function() {
//	return Tarjeta.find({}, {sort:{createdAt:-1}});
//});
//
//Meteor.publish("detalle_blog_post", function(id) {
//	return Tarjeta.find({_id:id});
//});
Meteor.publish("userTarjetas", function() {
  return Tarjeta.find({createdBy:this.userId},
    {last_digits:true, brand:true});
});
