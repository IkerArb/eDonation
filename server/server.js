import {Users} from "meteor-user-roles";

S3.config = {
    key: 'AKIAIT25ZQ6KB6YCIYXA',
    secret: '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',
    bucket: 'smartcitychapala',
    region: 'us-east-1' // Only needed if not "us-east-1" or "us-standard"
};

Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	ServiceConfiguration.configurations.upsert(
	  { service: "facebook" },
	  {
	    $set: {
	      appId: "284314675282557",
	      loginStyle: "popup",
	      secret: "99bdd2acad1bcbee202667e6b5c508b6"
	    }
	  }
	);

	ServiceConfiguration.configurations.upsert(
	  {service: "google"},
		{
			$set:{
			  service: "google",
			  clientId: "55575290356-0hja7ruq3pm5f7b3qe8o8ev7f3re0d9a.apps.googleusercontent.com",
			  secret: "d_VRYdEEKrkhM4wHtsPiNS8u"
			}
		}
	);

});


var verifyEmail = true;

Accounts.config({ sendVerificationEmail: verifyEmail });

Accounts.onCreateUser(function (options, user) {
	user.roles = ['user'];

	if(options.profile) {
		user.profile = options.profile;
	}


	return user;
});

Accounts.validateLoginAttempt(function(info) {
	// reject users with role "blocked"
	if(info.user && Users.isInRole(info.user._id, "blocked")) {
		throw new Meteor.Error(403, "Your account is blocked.");
	}

	// reject user without verified e-mail address
	if(verifyEmail && info.user && info.user.emails && info.user.emails.length && !info.user.emails[0].verified) {
		throw new Meteor.Error(499, "E-mail not verified.");
	}

	return true;
});

Accounts.onLogin(function (info) {

});

Accounts.urls.resetPassword = function (token) {
	return Meteor.absoluteUrl('reset_password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
	return Meteor.absoluteUrl('verify_email/' + token);
};
