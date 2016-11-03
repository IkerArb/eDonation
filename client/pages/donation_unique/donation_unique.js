Template.donation_unique.rendered = function(){
	Session.set("specifyDonation", false);
}

Template.donation_unique.helpers({
	isSpecifiedDonation: function(){
		return Session.get("specifyDonation");
	}
});

Template.donation_unique.events({
	"click #specificDonation": function(e){
		Session.set("specifyDonation", true);
	},
	"click #donate50": function(e){
		Session.set("specifyDonation", false);
		Session.set("donateAmount", 50);
	},
	"click #donate100": function(e){
		Session.set("specifyDonation", false);
	},
	"click #donate200": function(e){
		Session.set("specifyDonation", false);
	}
});



