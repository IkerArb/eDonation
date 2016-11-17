Template.home_admin.rendered = function(){

};

Template.home_admin.helpers({
  selector(){
    var inicio;
    var fin;
    if(Session.get('year')){
      if(Session.get('month')){
        if(Session.get('month')===11){
          inicio = new Date(Session.get('year'),Session.get('month'));
          fin = new Date(Session.get('year')+1,0);
          return {createdAt:{$gte:inicio,$lte:fin}};
        }
        inicio = new Date(Session.get('year'),Session.get('month'));
        fin = new Date(Session.get('year'),Session.get('month')+1);
        return {createdAt:{$gte:inicio,$lte:fin}};
      }
      inicio = new Date(Session.get('year'),0);
      fin = new Date(Session.get('year')+1,0);
      console.log(inicio);
      console.log(fin);
      return {createdAt:{$gte:inicio,$lte:fin}};
    }
    return {};
  }
});

Template.home_admin.events({
  "change #mesFiltrado": function(e){
    Session.set("month",Number(e.target.value));
  },
  "change #anioFiltrado": function(e){
    Session.set("year",Number(e.target.value));
  }
});
