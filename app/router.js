import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('overview');
    this.route('assignments');
    this.route('members');
});

export default Router;
