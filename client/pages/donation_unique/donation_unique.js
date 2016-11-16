Template.donation_unique.rendered = function(){
};

Template.donation_unique.helpers({
	isSpecifiedDonation: function(){
		return Session.get("specifyDonation");
	},
	isDonationSelected: function(){
		return Session.get("donationSelected");
	},
	donateAmount: function(){
		if(Session.get("specifyDonation")){
			return Session.get("donateAmount");
		}
	},
	isSelected50: function(){
		if(Session.get("donationSelected")){
			if(Session.get("donateAmount")===50){
				return 'cantidadSeleccionada';
			}
		}
	},
	isSelected100: function(){
		if(Session.get("donationSelected")){
			if(Session.get("donateAmount")===100){
				return 'cantidadSeleccionada';
			}
		}
	},
	isSelected200: function(){
		if(Session.get("donationSelected")){
			if(Session.get("donateAmount")===200){
				return 'cantidadSeleccionada';
			}
		}
	},
	isSelectedOther: function(){
		if(Session.get("specifyDonation")){
			return 'cantidadSeleccionada';
		}
	}
});

Template.donation_unique.events({
	"click #specificDonation": function(e){
		Session.setPersistent("specifyDonation", true);
		Session.setPersistent("donationSelected", false);
		Session.setPersistent("donateAmount",0);
	},
	"click #donate50": function(e){
		Session.setPersistent("specifyDonation", false);
		Session.setPersistent("donationSelected", true);
		Session.setPersistent("donateAmount", 50);
	},
	"click #donate100": function(e){
		Session.setPersistent("specifyDonation", false);
		Session.setPersistent("donationSelected", true);
		Session.setPersistent("donateAmount", 100);
	},
	"click #donate200": function(e){
		Session.setPersistent("specifyDonation", false);
		Session.setPersistent("donationSelected", true);
		Session.setPersistent("donateAmount", 200);
	},
	"click #nextBtnOther": function(e){
		e.preventDefault();
	  if(Session.get("donateAmount")<50){
			Materialize.toast("Favor de ingresar una cantidad mayor a 50",3000);
		}
		else{
			FlowRouter.go("payment_method");
		}
	},
	"keyup #amount": function(e){
		e.preventDefault();
		var cantidad = Number(e.target.value);
		if(cantidad>=50){
			Session.setPersistent("donateAmount",cantidad);
		}
	},
	"click #nextBtnPackage":function(e){
		if(Session.get("donationSelected")){
			FlowRouter.go("payment_method");
		}
		else{
			Materialize.toast("Favor de elegir o ingresar una cantidad válida",3000);
		}
	}
});
