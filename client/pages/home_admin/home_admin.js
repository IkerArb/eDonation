Template.home_admin.rendered = function(){
  Session.set('month',10);
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
      inicio = new Date(Session.get('year'));
      fin = new Date(Session.get('year')+1);
      return {createdAt:{$gte:inicio,$lte:fin}};
    }
    return {};
  }
});
