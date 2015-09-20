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
                  name: "UEE",
                  type: "org",
                  desc: "United Empire of Earth",
                  color: "",
                  leaders: "",
                  pilots: "",
                  children_ids: [2,3,4]
              }, {
                  id: 2,
                  name: "Advocacy",
                  type: "division",
                  desc: "The Advocacy",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  children_ids: []
              }, {
                  id: 3,
                  name: "Military",
                  type: "division",
                  desc: "The Military",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  children_ids: [5, 6, 7]
              }, {
                  id: 4,
                  name: "Senate",
                  type: "division",
                  desc: "The Senate",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
              }, {
                  id: 5,
                  name: "Army",
                  type: "unit",
                  desc: "The Army",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 3,
              }, {
                  id: 6,
                  name: "Marines",
                  type: "unit",
                  desc: "The Marines",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 3,
              }, {
                  id: 7,
                  name: "Navy",
                  type: "unit",
                  desc: "The Navy",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 3,
                  children_id: []
              }
          ]};


    this.store.pushPayload(data);
  }
});
