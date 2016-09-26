import{Blog} from '/lib/collections/blog.js'

Template.blog.rendered = function(){
  $('ul.tabs').tabs();
  $('.brand-logo').text("Blog");
  $('.datepicker').pickadate({
   selectMonths: true, // Creates a dropdown to control month
   selectYears: 15, // Creates a dropdown of 15 years to control year
   onSet: function( arg ){
        if ( 'select' in arg ){ //prevent closing on selecting month/year
            this.close();
        }
    }
 });
};


Template.blog.helpers({

});

Template.blog.events({

});


Template.blog_search.helpers({
  'blogs': function(){
    var searchObj = {};
    if (Session.get('blogSearchN')) {
      searchObj.titulo = {$regex:".*"+Session.get('blogSearchN')+".*",$options:'i'};
    }
    if (Session.get('filtroInicioN') && !Session.get('filtroFinN')) {
      searchObj.createdAt={$gte:Session.get('filtroInicioN')};
    }
    if (Session.get('filtroFinN') && !Session.get('filtroInicioN')) {
      searchObj.createdAt={$lte:Session.get('filtroFinN')};
    }
    if (Session.get('filtroFinN') && Session.get('filtroInicioN')) {
      searchObj.createdAt={$gte:Session.get('filtroInicioN'),$lte:Session.get('filtroFinN')};
    }
      return Blog.find(searchObj);
  }
});
Template.blog_search.events({
  'change #fecha_desdeN':function(e){
    e.preventDefault();
    var fechainicio= new Date ($('#fecha_desdeN').val());
    Session.set('filtroInicioN',fechainicio);
  },
  'change #fecha_hastaN':function(e){
    e.preventDefault();
    var fechafin= new Date ($('#fecha_hastaN').val());
    Session.set('filtroFinN',fechafin);

  },
  'keyup #searchN':function(e){
    e.preventDefault();
    var blogSearch = $('#searchN').val();
    Session.set('blogSearchN',blogSearch);

  },
  'submit #searchN':function(e){
    e.preventDefault();
  },
});

Template.post.helpers({
  'date': function(){
    var date = this.createdAt;
    return date.toLocaleDateString();
  }
});
