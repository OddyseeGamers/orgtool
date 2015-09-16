import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),

  initialize: Ember.on('init', function() {
      this.loadStore();
  }),

  loadStore: function() {
      console.debug("setup fixtures");
      var data = {
          units: [
              {
                  id: 1,
                  name: "Org",
                  type: "org",
                  desc: "some org",
                  color: "",
                  leaders: "",
                  pilots: "",
                  unit_ids: [2,3,4]
              }, {
                  id: 2,
                  name: "DIV1",
                  type: "division",
                  desc: "div1",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  unit_ids: []
              }, {
                  id: 3,
                  name: "DIV2",
                  type: "division",
                  desc: "div2",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  unit_ids: []
              }, {
                  id: 4,
                  name: "DIV3",
                  type: "division",
                  desc: "div3",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  unit_id: []
              }
          ]};


    this.store.pushPayload(data);
  }
});
