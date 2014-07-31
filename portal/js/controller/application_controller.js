var $ = require("jquery"),
    Ember = require('ember');

App.ApplicationController = Ember.Controller.extend({
  actions: {
    login: function() {

      var self = this, data = this.getProperties('username', 'password');

      // Clear out any error messages.
      this.set('errorMessage', null);

      $.post('/login', data).then(function(response) {

      self.set('errorMessage', response.message);
        if (response.success) {
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
    this.transitionToRoute('/');
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
    $('#raid-calendar').datepicker({
	    todayBtn: true,
	    language: "fr",
	    forceParse: false
	   });
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