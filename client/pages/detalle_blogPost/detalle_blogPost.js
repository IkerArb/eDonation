import{Blog} from '/lib/collections/blog.js'

Template.detalle_blogPost.rendered = function(){
  $('.brand-logo').text("Noticias y Avisos");

};

Template.detalle_blogPost.helpers({
  'titulo':function(){
    return Blog.findOne().titulo;
  },
  'imagen':function(){
    return Blog.findOne().pictures[0].url;
  },
  'contenido':function(){
    return Blog.findOne().contenido;
  },
  'hrefPagina': function(){
    return encodeURIComponent(FlowRouter.url(FlowRouter.current().path));
  }
});
