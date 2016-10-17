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
	      appId: "1761523087442385",
	      loginStyle: "popup",
	      secret: "a52d5dbefb63c6689ee12145b3887f6b"
	    }
	  }
	);

	ServiceConfiguration.configurations.upsert(
	  {service: "google"},
		{
			$set:{
			  service: "google",
			  clientId: "661457512695-u9fkm6s3i8lkj7j6r40laekqjloi8op7.apps.googleusercontent.com",
			  secret: "lJ9_Y-OGQqx3ScxWombCg4U_"
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
