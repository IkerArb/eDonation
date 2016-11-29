
// Hooks para la form
AutoForm.hooks({
  catalogo_alta_user: {
    before:{

    },
    after:{
      method: function(error, result) {

      },

    },
    onSuccess: function(method, result) {
      $('#userForm').toggle(800);
      $('#addUser').toggle(800);
      Materialize.toast('El usuario se ha generado con exito',4000,'green');
    },

  },
});

Template.configuracion.rendered=function(){
  $('ul.tabs').tabs();
  $('.tooltipped').tooltip({delay: 50});
};

Template.configuracion.helpers({
  selectedUserDoc: function(){
    return Meteor.users.findOne({_id: Session.get("selectedUser")});
  }
});

Template.configuracion.events({
  "click .deleteUser":function(e){
    e.preventDefault();
    var user_id=$(e.target).attr('rel');
    var confirmAnswer = confirm('Seguro que quieres borrar el usuario?');
    if (confirmAnswer) {
      Meteor.call('deleteUser',user_id);
      Materialize.toast('Se ha borrado el usuario.',4000,'red');
    }
  },
  "click .restauraUser":function(e){
    e.preventDefault();
    var user_id=$(e.target).attr('rel');
    var confirmAnswer = confirm('Seguro que quieres restaurar el usuario?');
    if (confirmAnswer) {
      Meteor.call('restoreUser',user_id);
      Materialize.toast('Se ha restaurado el usuario.',4000);
    }
  },
  // Evento al dar click en button SHOW tabla de puntos de interes
  "click .showUser":function(e){
    e.preventDefault();
    var user_id=$(e.target).attr('rel');
    Session.set('selectedUser',user_id);
    $('#modalUpdateUser').openModal();
  },

  // Evento al dar click en boton de addUser para desplegar o ocultar la form
  "click #addUser":function(e){
    e.preventDefault();
    $('#userForm').toggle(800);
    $('#addUser').toggle(800);
  },
  "click #closeUser":function(e){
    e.preventDefault();
    $('#userForm').toggle(800);
    $('#addUser').toggle(800);
  },
});
