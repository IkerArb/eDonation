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
	"configuracion",
	"payment_method",
	"unique_payment",
];

const freeRouteNames = [
	"home_free",
	"blog",
	"verify_email",
];

const roleMap = [
	{ route: "home_admin",	roles: ["admin"] },
	{ route: "configuracion",	roles: ["admin"] },
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
			var nav = 'navbarFree';
			BlazeLayout.render('layout',{navbar:nav,content:'home_free'});
    },

		subscriptions: function(routeParams, routeQuery) {
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
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'home_admin'});
    },
		subscriptions:function(routeParams,routeQuery){
			this.register('usuarios',Meteor.subscribe('users_all'));
			this.register('pagos',Meteor.subscribe('pagos_all'));
			this.register('tarjetas',Meteor.subscribe('tarjetas_all'));
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
			BlazeLayout.render('layout',{navbar:'navbarFree',content:'configuracion'});
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
			this.register('userTarjetas',Meteor.subscribe('userTarjetas'));
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
			this.register('userTarjetas',Meteor.subscribe('userTarjetas'));
			this.register('userPagos',Meteor.subscribe('userPagos'));
		},
	triggersExit: [
		function(context, redirect) {

		}
	]
});
