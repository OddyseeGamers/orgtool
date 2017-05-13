import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  classNames: ['template-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  showDialog: false,

//   hasType: Ember.computed.notEmpty("itemType.name"),
//   hasTypename: Ember.computed.notEmpty("itemType.typeName"),
//   requiredFields: Ember.computed.and("hasType", "hasTypename"),
  requiredFields: true,

  setup: Ember.on('init', function() {
    var self = this;
    get(this, 'store').findAll('category').then(function(cats) {
      set(self, "cats", cats);
    });
  }),

  actions: {
    setParent: function(cat) {
        set(this, "template.category", cat);
    },

    deleteTemplate: function(template) {
      this.get('onConfirm')(template);
    },

    saveTempate: function(template) {
      debug("save ctemplate")
      var self = this;
      if (template) {
        template.save().then(function(ntemplate) {
          self.set('template', null);
          self.set('showDialog', false);
          get(self, "session").log("template", "template " + ntemplate.get("name") + " saved");
        }).catch(function(err) {
          get(self, "session").log("error", "could not save template " + template.get("name"));
          Ember.Logger.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },

    close: function() {
      var template = get(this, 'template');
      var self = this;
      if (!Ember.isEmpty(template)) {
        if (!Ember.isEmpty(template.get("id"))) {
          template.reload();
        } else if (template.get("isNew")) {
          var self = this;
          template.destroyRecord().then(function(ntemplate) {
            get(self, "session").log("template", "template " + ntemplate.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not save template " + template.get("name"));
            Ember.Logger.debug("error deleting template", err);
          });
        }
      }
      this.set('showDialog', false);
      this.set('template', null);
    },
  }
});
