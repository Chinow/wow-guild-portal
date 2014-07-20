App = Ember.Application.create();


// Routes
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
    }
  },


  getJSONWithToken: function(url) {
    if (!this.controllerFor('application').get('isLogged')) {
      this.controllerFor('application').set('errorMessage', "Veuillez vous connecter")
      return []
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

// Controllers
App.ApplicationController = Ember.Controller.extend({
  actions: {
    login: function() {
      var self = this, data = this.getProperties('username', 'password');

      // Clear out any error messages.
      this.set('errorMessage', null);

      $.post('/login', data).then(function(response) {

      self.set('errorMessage', response.message);
        if (response.success) {
          alert('Login succeeded!');
          self.set('token', response.user.remember_token);
          self.set('user', response.user);

          var attemptedTransition = self.get('attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            self.set('attemptedTransition', null);
          } else {
            // Redirect to 'articles' by default.
            self.transitionToRoute('articles');
            self.set('isLogged',true)
          }
        }else{
           self.set('isLogged',false)
        }
      });
    }
  },
  logout:function(){
    $.get("/login/logout")
    this.set('isLogged',false)
  },
  init: function() { 
    var self = this;
    $.ajax({
      url: "/login/logged",
      dataType: 'json',
      async: false,
    }).then(function(response) {
      if (response)
      {
        self.set('user', response);
        self.set('isLogged', true);
      }
    })
  /*  $.get("/login/logged").then(function(response) {
          if (response)
            self.set('isLogged', true);
    })*/
  },
  reset: function() {
    this.setProperties({
      username: "",
      password: "",
      errorMessage: ""
    });
  },

  token: localStorage.token,
  tokenChanged: function() {
    localStorage.token = this.get('token');
  }.observes('token'),

  isLogged: false,

});
