

Template.home_free.events({
  'click #donationUniqueBtn': function(e){
    e.preventDefault();
    if(!Meteor.user()){
      Materialize.toast("Favor de iniciar sesión para donar",4000);
      $("#login-register-modal").openModal();
    }
    else{
      FlowRouter.go("donation_unique");
    }
  }
});
