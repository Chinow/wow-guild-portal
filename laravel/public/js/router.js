
App.Router.map(function() {
  this.route('articles');
  this.route('photos');
  this.route('logout');
});

App.ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, context) {
    controller.reset();
  }
});

App.AuthenticatedRoute = Ember.Route.extend({

  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLogged')) {
      this.controllerFor('application').set('errorMessage', "Veuillez vous connecter")
      this.transitionTo('/');
    }
  },


  getJSONWithToken: function(url) {
    if (!this.controllerFor('application').get('isLogged')) {
      this.controllerFor('application').set('errorMessage', "Veuillez vous connecter")
      
    }else
      return $.getJSON(url);
  },


});

App.ArticlesRoute = App.AuthenticatedRoute.extend({
  model: function() {
    return this.getJSONWithToken('/users');
  },

});

App.PhotosRoute = App.AuthenticatedRoute.extend({
  model: function() {
    return this.getJSONWithToken('/users');
  },

});