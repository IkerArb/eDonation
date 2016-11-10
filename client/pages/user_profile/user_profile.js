
Template.user_profile.rendered = function() {
    $('ul.tabs').tabs();
    // $('ul.tabs').tabs('select_tab', 'tab_id');
};

Template.user_profile.helpers({
	userName(){
		 if(Meteor.user().services.google){
		    return Meteor.user().services.google.name;
		  }
		  if(Meteor.user().services.facebook){
		    return Meteor.user().services.facebook.name;
		  }
		  return Meteor.user().profile.name;
	},
	email(){
		if(Meteor.user().services.google){
		    return Meteor.user().services.google.email;
		  }
		  if(Meteor.user().services.facebook){
		    return Meteor.user().services.facebook.email;
		  }
		return Meteor.user().profile.email; 
	}
});