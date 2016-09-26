import {Meteor} from "meteor/meteor";
import {Blog} from "/lib/collections/blog.js";

Meteor.publish("blogPosts", function() {
	return Blog.find({}, {sort:{createdAt:-1}});
});

Meteor.publish("detalle_blog_post", function(id) {
	return Blog.find({_id:id});
});
