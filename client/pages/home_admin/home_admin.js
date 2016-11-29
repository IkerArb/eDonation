import {Pago} from "/lib/collections/pagos.js";

Template.home_admin.rendered = function(){

};

Template.home_admin.helpers({
  selector(){
    var searchObj = {};
    if (Session.get('searchText')) {
      searchObj._id = {$regex:".*"+Session.get('searchText')+".*",$options:'i'};
    }
    if (Session.get('fecha_desde') && !Session.get('fecha_hasta')) {
      searchObj.createdAt={$gte:Session.get('fecha_desde')};
    }
    if (Session.get('fecha_hasta') && !Session.get('fecha_desde')) {
      searchObj.createdAt={$lte:Session.get('fecha_hasta')};
    }
    if (Session.get('fecha_hasta') && Session.get('fecha_desde')) {
      searchObj.createdAt={$gte:Session.get('fecha_desde'),$lte:Session.get('fecha_hasta')};
    }
    return searchObj;
  },
  cantidadMeta(){
    return 500;
  },
  pagoSumatorias(){
    var searchObj = {};
    if (Session.get('searchText')) {
      searchObj._id = {$regex:".*"+Session.get('searchText')+".*",$options:'i'};
    }
    if (Session.get('fecha_desde') && !Session.get('fecha_hasta')) {
      searchObj.createdAt={$gte:Session.get('fecha_desde')};
    }
    if (Session.get('fecha_hasta') && !Session.get('fecha_desde')) {
      searchObj.createdAt={$lte:Session.get('fecha_hasta')};
    }
    if (Session.get('fecha_hasta') && Session.get('fecha_desde')) {
      searchObj.createdAt={$gte:Session.get('fecha_desde'),$lte:Session.get('fecha_hasta')};
    }
    var pagoSumatorias = {cantidadRecaudada:0,numeroDonaciones:0};
    var pagos = Pago.find(searchObj).fetch();
    for (var i in pagos) {
      pagoSumatorias.cantidadRecaudada+=pagos[i].amount;
      pagoSumatorias.numeroDonaciones+=1;
    }
    return pagoSumatorias;
  }
});

Template.home_admin.events({

});

Template.filterSearch.events({
  'change #fecha_desde':function(e){
    e.preventDefault();
    var fecha_desde = "";
    if(e.target.value){
      fecha_desde= new Date (e.target.value);
    }
    Session.set('fecha_desde',fecha_desde);
  },
  'change #fecha_hasta':function(e){
    e.preventDefault();
    var fecha_hasta ="";
    if(e.target.value){
      fecha_hasta= new Date (e.target.value);
    }
    Session.set('fecha_hasta',fecha_hasta);

  },
  'keyup #searchText':function(e){
    e.preventDefault();
    var searchText = $('#searchText').val();
    Session.set('searchText',searchText);

  },
  'submit #searchText':function(e){
    e.preventDefault();
  },
});
