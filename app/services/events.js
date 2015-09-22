import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  initialize: Ember.on('init', function() {
    console.debug("init event service");
  })
});
