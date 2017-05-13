import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
    this.route('login');

    this.route('overview', { resetNamespace: true }, function() {
      this.route('unit', { path: '/:unit_id' }, function() {
      });
    });

    this.route('players', { resetNamespace: true }, function() {
      this.route('player', { path: '/:player_id' }, function() {
        this.route('general');
        this.route('stats');
        this.route('items');
      });
    });

    this.route('users', { resetNamespace: true }, function() {
      this.route('user', { path: '/:user_id' }, function() {
      });
    });

    this.route('lfg');
    this.route('log');

    this.route('settings', { resetNamespace: true }, function() {
      this.route('items');
      this.route('rewards');
    });

});

export default Router;
