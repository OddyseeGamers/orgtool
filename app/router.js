import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
//     this.route('overview');
    this.route('overview', { resetNamespace: true }, function() {
      this.route('unit', { path: '/:unit_id' }, function() {
      });
    });


    this.route('members', { resetNamespace: true }, function() {
      this.route('member', { path: '/:member_id' }, function() {
      });
    });

    this.route('ships');

    this.route('assets');

    this.route('settings', { resetNamespace: true }, function() {
      this.route('ships');
    });
});

export default Router;
