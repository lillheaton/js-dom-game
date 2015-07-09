require.config({
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'events': '../submodules/events/src/events',
    'classy': '../submodules/classy/src/classy',
    'victor': '../bower_components/victor/build/victor'
  }
});

require(['platfy'], function(Platfy) {
  window.app = new Platfy();
});