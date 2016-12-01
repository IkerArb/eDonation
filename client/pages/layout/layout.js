

Template.navbarFree.onRendered(function(){
});

Template.navbarFree.helpers({
  'isAdmin': function(){
    console.log(Meteor.user().roles);
    return Meteor.user().roles.indexOf('admin')>=0;
  },
  'home_admin_link': function(){
    return FlowRouter.path("home_admin");
  },
  'configuracion_link': function(){
    return FlowRouter.path("configuracion");
  },
  'home_link': function(){
    return FlowRouter.path("home_free");
  },
  'blog_link': function(){
    return FlowRouter.path("blog");
  },
  currentUserEmail(){
    if(Meteor.user().services.google){
      return Meteor.user().services.google.email;
    }
    if(Meteor.user().services.facebook){
      return Meteor.user().services.facebook.email;
    }
    return Meteor.user().emails[0].address;
  }
});

Template.navbarFree.events({

});

Template.navbarAdmin.helpers({
  'home_link': function(){
    return FlowRouter.path("home_admin");
  },
  'cat_blog_link': function(){
    return FlowRouter.path("catalogo_blog");
  },
  'configuracion_link': function(){
    return FlowRouter.path("configuracion");
  },
  currentUserEmail(){
    if(Meteor.user().services.google){
      return Meteor.user().services.google.email;
    }
    if(Meteor.user().services.facebook){
      return Meteor.user().services.facebook.email;
    }
    return Meteor.user().emails[0].adress;
  }
});

Template.navbarAdmin.events({
  'click #logout': function(e){
    e.preventDefault();
    Meteor.logout();
  }
});

Template.layout.rendered = function(){
  $(".button-collapse").sideNav({
    edge: 'left',
    closeOnClick: true
  });
};

Template.layout.events({
  'click #loginButton':function(e){
    e.preventDefault();
    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();
    Meteor.loginWithPassword(email,password,function(error){
      if(error){
        Materialize.toast(error.reason,4000);
      }
      else{
        $('#login-register-modal').closeModal();
        if(Meteor.user().roles.indexOf('funcionario')>=0){
          FlowRouter.go("home_funcionario");
        }
      }
    });
  },
  'click #logout': function(e){
    e.preventDefault();
    Meteor.logout();
  },
  'click #signupButton': function(e){
    e.preventDefault();
    var user = {};
    user.profile = {name: $("#signupName").val()};
    user.email = $("#signupEmail").val();
    user.password = $("#signupPassword").val();
    if(user.password===$("#signupConfirmPassword").val()){
      Accounts.createUser(user,function(error){
        if(error){
          Materialize.toast(error.reason,4000);
        }
        else{
          Materialize.toast("Registro exitoso",4000);
          $('#login-register-modal').closeModal();
        }
      });
    }
    else{
      Materialize.toast("Las contraseñas no coinciden",4000);
    }
  },
  'click #login': function(e){
    $('#login-register-modal').openModal();
    $('ul.tabs').tabs();
  },
  'click #signup': function(e){
    $('#login-register-modal').openModal();
    $('ul.tabs').tabs();
  },
  'click .omb_btn-facebook': function(e){
		e.preventDefault();
    Meteor.loginWithFacebook({
			requestPermissions: ['email', 'user_about_me', 'user_birthday', 'user_location', 'publish_pages', 'publish_actions']
		}, function (err) {
			if (err){
					console.log("error al login con facebook"+err);
			} else {
				console.log("login successfull");
        $('#login-register-modal').closeModal();
        if(Meteor.user().roles.indexOf('funcionario')>=0){
          FlowRouter.go("home_funcionario");
        }
			}
		});
	},
  'click .omb_btn-google': function(e){
    e.preventDefault();
    Meteor.loginWithGoogle({
			requestPermissions: ['email', 'profile']
		}, function (err) {
			if (err){
					console.log("error al login con google"+err);
			} else {
				console.log("login successfull");
        $('#login-register-modal').closeModal();
        if(Meteor.user().roles.indexOf('funcionario')>=0){
          FlowRouter.go("home_funcionario");
        }
			}
		});
  }
});
