/*IMPORTS*/
if(Meteor.isClient){
	Tracker.autorun(function() {
		var userId = Meteor.userId();
		var user = Meteor.user();
		if(userId && !user) {
			return;
		}

		var currentContext = FlowRouter.current();
		var route = currentContext.route;
		if(route) {
			if(user) {
				if(route.group.name == "public") {
					FlowRouter.reload();
				}
			} else {
				if(route.group.name == "private") {
					FlowRouter.reload();
				}
			}
		}
	});
}

const publicRouteNames = [

];

const privateRouteNames = [
	"home_admin",
	"catalogo_blog",
	"configuracion",
	"payment_method"
];

const freeRouteNames = [
	"home_free",
	"blog",
	"detalle_blogPost",
	"verify_email",
];

const roleMap = [
	{ route: "home_admin",	roles: ["admin"] },
	{ route: "catalogo_blog",	roles: ["admin"] },
	{ route: "configuracion",	roles: ["admin"] },
	{ route: "payment_method",	roles: ["admin", "user"] }
];

const firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRouteNames, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRouteNames, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRouteNames, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		console.log("All routes are restricted for current user.");
		return "notFound";
	}

	return "";
};

// this function returns true if user is in role allowed to access given route
export const routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app doesn't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in or doesn't have "role" member
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

const freeRoutes = FlowRouter.group({
	name: "free",
	triggersEnter: [
		function(context, redirect, stop) {
			if(!routeGranted(context.route.name)) {
				// user is not in allowedRoles - redirect to first granted route
				var redirectRoute = firstGrantedRoute("home_free");
				redirect(redirectRoute);
			}
		}
	]
});

const publicRoutes = FlowRouter.group({
	name: "public",
	triggersEnter: [
		function(context, redirect, stop) {
			if(Meteor.user()) {
				var redirectRoute = firstGrantedRoute("home_free");
				redirect(redirectRoute);
			}
		}
	]
});

const privateRoutes = FlowRouter.group({
	name: "private",
	triggersEnter: [
		function(context, redirect, stop) {
			if(!Meteor.user()) {
				// user is not logged in - redirect to public home
				var redirectRoute = firstGrantedRoute("home_free");
				redirect(redirectRoute);
			} else {
				// user is logged in - check role
				if(!routeGranted(context.route.name)) {
					// user is not in allowedRoles - redirect to first granted route
					var redirectRoute = firstGrantedRoute("home_free");
					redirect(redirectRoute);
				}
			}
		}
	]
});

FlowRouter.notFound = {
	action () {
		BlazeLayout.render('layout',{navbar:'navbarFree',content:'notFound'});
		var title = "Not Found";
		DocHead.setTitle(title);
	}
};

freeRoutes.route("/verify_email/:token",{
	name:"verify_email",
	action: (routeParams)=>{
		Accounts.verifyEmail(routeParams.token,(error)=>{
			if(error){
				//TODO: mensaje de error
			}
			else{
				FlowRouter.go("/");
				//TODO: mensaje de success;
			}
		});
	}
});

freeRoutes.route("/", {
    name: "home_free",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'home_free'});
    },

		subscriptions: function(routeParams, routeQuery) {
    },
	triggersExit: [
		function(context, redirect) {

		}
	]
});

freeRoutes.route("/blog", {
    name: "blog",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'blog'});
			var title = "Blog";
			DocHead.setTitle(title);
    },

		subscriptions:function(routeParams,routeQuery){
			this.register('blogPosts',Meteor.subscribe('blogPosts'));
		},
	triggersExit: [
		function(context, redirect) {

		}
	]
});

freeRoutes.route("/detalle_blogPost/:_id", {
    name: "detalle_blogPost",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			import {Blog} from '/lib/collections/blog.js';
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'detalle_blogPost'});
			var blogPost = Blog.findOne(routeParams._id);
			var title = blogPost.titulo;
			DocHead.setTitle(title);
			var url = {name:"og:url", content:FlowRouter.url(FlowRouter.current().path)};
			DocHead.addMeta(url);
			var type = {name:"og:type", content:"article"};
			DocHead.addMeta(type);
			var metatitle = {name:"og:title", content:blogPost.titulo};
			DocHead.addMeta(metatitle);
			var description  = {name:"og:description", content:blogPost.contenido};
			DocHead.addMeta(description);
			var image = {name:"og:image", content:blogPost.pictures[0].secure_url};
			DocHead.addMeta(image);
    },

		subscriptions:function(routeParams,routeQuery){
			this.register('detalle_blogPost',Meteor.subscribe('detalle_blogPost',routeParams._id));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});

privateRoutes.route("/home_admin", {
    name: "home_admin",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarAdmin',content:'home_admin'});
    },
		subscriptions:function(routeParams,routeQuery){
			this.register('usuarios',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});

privateRoutes.route("/catalogo_blog", {
    name: "catalogo_blog",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarAdmin',content:'catalogo_blog'});
    },

		subscriptions:function(routeParams,routeQuery){
			this.register('blogPosts',Meteor.subscribe('blogPosts'));
		},
	triggersExit: [
		function(context, redirect) {

		}
	]
});


privateRoutes.route("/configuracion", {
    name: "configuracion",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarAdmin',content:'configuracion'});
    },
		subscriptions: function(routeParams,routeQuery){
			this.register('users',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});

privateRoutes.route("/payment_method", {
    name: "payment_method",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'payment_method'});
    },
		subscriptions: function(routeParams,routeQuery){
			this.register('users',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});

privateRoutes.route("/choose_donation_type", {
    name: "choose_donation_type",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'choose_donation_type'});
    },
		subscriptions: function(routeParams,routeQuery){
			this.register('users',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});

privateRoutes.route("/donation_suscription", {
    name: "donation_suscription",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'donation_suscription'});
    },
		subscriptions: function(routeParams,routeQuery){
			this.register('users',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});

privateRoutes.route("/donation_unique", {
    name: "donation_unique",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'donation_unique'});
    },
		subscriptions: function(routeParams,routeQuery){
			this.register('users',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});
privateRoutes.route("/profile", {
    name: "user_profile",

	triggersEnter: [
		function(context, redirect, stop) {

		}
	],
    action: function(routeParams, routeQuery) {
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'user_profile'});
    },
		subscriptions: function(routeParams,routeQuery){
			this.register('users',Meteor.subscribe('users_all'));
		},

	triggersExit: [
		function(context, redirect) {

		}
	]
});
