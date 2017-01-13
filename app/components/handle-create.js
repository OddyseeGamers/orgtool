import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['handle-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  showDialog: false,

  types: [
      { type: "rsi", desc: "RSI", img: "https://robertsspaceindustries.com/media/tb6ui8j38wwscr/icon/RSI.png" },
      { type: "discord", desc: "Discord", img: "http://vignette3.wikia.nocookie.net/siivagunner/images/9/9f/Discord_icon.svg" },
      { type: "steam", desc: "Steam", img: "http://icons.iconarchive.com/icons/martz90/circle/24/steam-icon.png" },
      { type: "custom", desc: "", img: "" },
  ],

  setup: Ember.on('init', function() {
  }),

  actions: {
    setType: function(type) {
      var handle = get(this, "handle");
      if (handle) {
        console.debug("set type", type.type, "-", type);
  //       console.debug("set type", type);
        set(handle, "type", type.type);
      }
    },

    saveHandle: function() {
      var handle = get(this, "handle");
      if (handle) {
        var self = this;
        handle.save().then(function(nhandle) {
          self.set('handle', null);
          self.set('showDialog', false);
          get(self, "session").log("handle", "handle " + nhandle.get("type") + " saved");
        }).catch(function(err) {
          get(self, "session").log("error", "could not save handle " + handle.get("type"));
          console.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },

    
    deleteHandle: function() {
      var handle = get(this, "handle");
      if (handle) {
        var self = this;
        handle.destroyRecord().then(function() {
          self.set('handle', null);
          self.set('showDialog', false);
          get(self, "session").log("handle", "handle deleted");
        }).catch(function(err) {
          get(self, "session").log("error", "could not delete handle " + handle.get("type"));
          console.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },


    close: function() {
      /*
      var item = get(this, 'item');
      if (!Ember.isEmpty(item)) {
        if (!Ember.isEmpty(item.get("id"))) {
          item.reload();
        } else if (item.get("isNew")) {
          var self = this;
          item.destroyRecord().then(function(nitem) {
            get(self, "session").log("item", "item " + nitem.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not save item " + nitem.get("name"));
            console.debug("error melting", err);
          });
        }

        if (!Ember.isEmpty(item.get("member")) && !Ember.isEmpty(item.get("member").get("items"))) {
//         console.debug(">>> RELOAD  MEMBER");
//           item.get("member").get("items").reload();
        } 

      }*/
      this.set('showDialog', false);
      this.set('handle', null);
    },
  }
});
