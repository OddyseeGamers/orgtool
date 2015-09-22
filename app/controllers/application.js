import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  showBreadPath: true,

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
                  type: "department",
                  desc: "The Advocacy",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  children_ids: []
              }, {
                  id: 3,
                  name: "Military",
                  type: "department",
                  desc: "The Military",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
                  children_ids: [5, 6, 7]
              }, {
                  id: 4,
                  name: "Senate",
                  type: "department",
                  desc: "The Senate",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 1,
              }, {
                  id: 5,
                  name: "Army",
                  type: "division",
                  desc: "The Army",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 3,
              }, {
                  id: 6,
                  name: "Marines",
                  type: "division",
                  desc: "The Marines",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 3,
              }, {
                  id: 7,
                  name: "Navy",
                  type: "division",
                  desc: "The Navy",
                  color: "",
                  leaders: "",
                  pilots: "",

                  children_ids: [8,9, 10],
                  parent: 3,
              }, {
                  id: 8,
                  name: "18th Fleet",
                  type: "fleet",
                  desc: "18th Battle Fleet",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 7,
              }, {
                  id: 9,
                  name: "2nd Fleet",
                  type: "fleet",
                  desc: "2nd Fleet",
                  color: "",
                  leaders: "",
                  pilots: "",

                  children_ids: [11],
                  parent: 7,
              }, {
                  id: 10,
                  name: "33rd Fleet",
                  type: "fleet",
                  desc: "33rd Fleet",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 7,
              }, {
                  id: 11,
                  name: "Squadron 42",
                  type: "squadron",
                  desc: "Squadron 4",
                  color: "",
                  leaders: "",
                  pilots: "",

                  parent: 9,
              }
          ]};


    this.store.pushPayload(data);
  }
});
