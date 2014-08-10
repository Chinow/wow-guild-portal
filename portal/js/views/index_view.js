var $ = require("jquery"),
		Ember = require('ember');
		
App.IndexView = Ember.View.extend({
	templateName: 'index',

    didInsertElement: function() {
	    $('#raid-calendar').datepicker({
		      todayBtn: true,
		      language: "fr",
		      forceParse: false,
		      beforeShowDay: function (date){
		      if (date.getMonth() == (new Date()).getMonth())

		        switch (date.getDate()){
		          case 4:
		            return {
		              classes: 'raid'
		            };
		          case 8:
		            return {
		              classes: 'raid-wait'
		            };
		          case 21:
		            return "raid-valid";
		        }
		    }
		});
    }
});

