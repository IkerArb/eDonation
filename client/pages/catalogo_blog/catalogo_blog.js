import {Blog} from '/lib/collections/blog.js';
import {Schemas} from "/lib/collections/schema.js";

// Hooks para la form
AutoForm.hooks({
  catalogo_blog: {
    before:{
      method: function(doc){
        delete doc.pictures;
        return doc;
      }
    },
    after:{
      method: function(error, result) {
        var files = [];
        var fileInputs = $("[name*=pictures][type=file]");
        console.log(fileInputs);
        for(var j=0; j<fileInputs.length-1; j++){
          files.push(fileInputs[j].files);
        }
        for(var i in files){
          S3.upload({
                    files:files[i],
                    path: result
                },function(e,r){
    							if(e){
    								console.log(e);
    							}
    							else{
                    console.log(r);
                    Meteor.call('pushFileUrlsBlogPost',result,r, function(e,r){
                      console.log(Blog.findOne(result));
                    });
    							}
            });

        }
        $("input[type=text]").val("");
        $("textarea").val("");
      },

    },
    onSuccess: function(method, result) {
      $('#blogForm').toggle(800);
      $('#addBlogPost').toggle(800);
      Materialize.toast('El post se ha generado con exito',4000,'green');
    },

  },
  updateBlogPost: {
    before:{
      "method-update": function(doc){
        delete doc.$set.pictures;
        if(doc.$unset){
          delete doc.$unset.pictures;
        }
        console.log(doc);
        return doc;
      }
    },
    after:{
      "method-update": function(error, result) {
        var files = [];
        var fileInputs = $("[name*=pictures][type=file]");
        for(var j=0; j<fileInputs.length; j++){
          files.push(fileInputs[j].files);
        }
        for(var i in files){
          if(files[i].length>0){
            S3.upload({
                      files:files[i],
                      path: result
                  },function(e,r){
      							if(e){
      								console.log(e);
      							}
      							else{
                      Meteor.call('pushFileUrlsBlogPost',result,r, function(e,r){
                        console.log(Blog.findOne(result));
                      });
      							}
              });
          }
        }
      },

    },
    onSuccess: function(method, result) {
      Materialize.toast('El aviso se ha actualizado con exito',4000,'green');
    },

  }
});

Template.catalogo_blog.helpers({
  selectedBlogDoc:function () {
    return Blog.findOne(Session.get('selectedBlog'));
  },
});

Template.catalogo_blog.events({
  // Evento al dar click en button DELETE tabla de categorias
  "click .deleteBlogPost":function(e){
    e.preventDefault();
    var blog_id=$(e.target).attr('rel');
    var confirmAnswer = confirm('Seguro que quieres borrar el aviso?');
    if (confirmAnswer) {
      var imagenes = Blog.findOne(blog_id).pictures;
      for(var i in imagenes){
        S3.delete(imagenes[i].relative_url,function(e,r){
          console.log(e);
          console.log(r);
        });
      }
      Meteor.call('deleteBlogPost',blog_id);
      Materialize.toast('Se ha borrado el post.',4000,'red');
    }
  },
  // Evento al dar click en button SHOW tabla de puntos de interes
  "click .showBlogPost":function(e){
    e.preventDefault();
    var blog_id=$(e.target).attr('rel');
    Session.set('selectedBlog',blog_id);
    $('#modalUpdateBlogPost').openModal();
  },

  // Evento al dar click en boton de addAviso para desplegar o ocultar la form
  "click #addBlogPost":function(e){
    e.preventDefault();
    $('#blogForm').toggle(800);
    $('#addBlogPost').toggle(800);
  },
  "click #closeBlogForm":function(e){
    e.preventDefault();
    $('#blogForm').toggle(800);
    $('#addBlogPost').toggle(800);
  }
});

Template.pictureTemplateBlogPost.rendered=function(){
};

Template.pictureTemplateBlogPost.helpers({
});

Template.pictureTemplateBlogPost.events({
  "click .delete-image":function(e){
    console.log(this);
    e.preventDefault();
    var confirmAnswer=confirm('Seguro que quieres borrar la imagen?');
    if (confirmAnswer) {
      Meteor.call('deleteImageBlogPost',Session.get('selectedBlog'),this.relative_url);
      S3.delete(this.relative_url);
      Materialize.toast('Se ha borrado la imagen.',4000,'red');
    }
  }
});
