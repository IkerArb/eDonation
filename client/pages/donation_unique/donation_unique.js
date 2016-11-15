



// Template.payment_method.events({

//   "click #package1": function(){
//   	$("#package1").css("color", "red");
//   }
//   "click #package2": function(){
//   	$("#package1").css("color", "red");
//   }
//   "click #package3": function(){
//   	$("#package1").css("color", "red");
//   }
//   "click #package4": function(){
//   	$("#package1").css("background-color", "red");
//   }

// });
$("#package1").click(function(){
    $("#package1").css("color", "red");
});
Template.donation_unique.rendered = function(){
	Session.set("specifyDonation", false);
	Session.set("donationSelected", false);
}

Template.donation_unique.helpers({
	isSpecifiedDonation: function(){
		return Session.get("specifyDonation");
	},
	isDonationSelected: function(){
		return Session.get("donationSelected");
	}
});

Template.donation_unique.events({
	"click #specificDonation": function(e){
		Session.set("specifyDonation", true);
	},
	"click #donate50": function(e){
		Session.set("specifyDonation", false);
		Session.set("donationSelected", true);
		Session.set("donateAmount", 50);
	},
	"click #donate100": function(e){
		Session.set("specifyDonation", false);
		Session.set("donationSelected", true);
		Session.set("donateAmount", 100);
	},
	"click #donate200": function(e){
		Session.set("specifyDonation", false);
		Session.set("donationSelected", true);
		Session.set("donateAmount", 200);
	},
	"click #nextBtnOther": function(e){
		Session.set("donationSelected", false);
		var Amount = $("#amount").val();
	    if(Amount===""){
	      $("#amount").addClass("invalid");
	      Materialize.toast("Porfavor ingresa la cantidad que desea donar",4000);
	    }
	    else if(isNaN(Amount)){
	    	$("#amount").addClass("invalid");
	      Materialize.toast("La cantidad que ingresaste no es válida",4000);
	    }


		Session.set("donateAmount", Amount);
	}
});

