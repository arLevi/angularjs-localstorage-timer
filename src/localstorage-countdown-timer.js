
// Helpers
function ObjectAssign( obj_to, obj_from) {
  // Implementing custom Object.assign()
  for (var key in obj_from) {  
    var value = obj_from[key];

    obj_to[key] = value;    
  }
  
}

angular.module('local-storage', [])
.service('LocalStorage', ['$window', '$rootScope', function($window, $rootScope) {
    var SERVICE = "[LocalStorage]";
    var DEBUG   = false;        // Throw console msgs ? true/false

    var LocalStorage = function(key) {
        this.key    = key;      // They key in which we'll seek our data in

        if ( DEBUG )
            console.log(SERVICE, "[init]");
    };

    LocalStorage.prototype = {
        get: function() {
            // Get data
            var self = this;
            var data = JSON.parse( $window.localStorage && $window.localStorage.getItem(self.key) );

            if ( DEBUG )
                console.log(SERVICE, "[get]", self.key, "=", data);

            return data;
        },

        set: function(data) {
            // Save
            var self = this;

            if ( DEBUG )
                console.log(SERVICE, "[set]", self.key, "=", data);

            $window.localStorage && $window.localStorage.setItem(self.key, JSON.stringify(data));
            return self;
        },

        removeItem: function(key) {
            var self = this;

            $window.localStorage && $window.localStorage.removeItem(key);
            return self;
        }
    };

    return LocalStorage;
}]);

angular.module('localstorage-countdown-timer', ['local-storage'])
.factory('CountDownTimer', ['$rootScope', 'LocalStorage', '$timeout', function ($rootScope, LocalStorage, $timeout) {
    var SERVICE     = "[CountDownTimer]";
    var _STORAGE    = null;
    var DEBUG       = false;

    // Timer Private Variable
    // Properties - we define here our defaults, during init - we fill from LocalStorage
    var _timer = null;
    var properties = {
        id:             "CountDownTimer",
        counter:        60,
        interval:       1000,
        last_updated:   new Date()
    };
    
    var _timerCtrl  = function(){
        if (properties.counter > 0) {            
            _timer = $timeout(_timerCtrl, properties.interval);
            properties.last_updated = new Date();            
            properties.counter--;

            // Save data to LS
            save();

        } else {

            // Raise an exception, our timer has ended
            $rootScope.$broadcast('CountDownTimerEndEvent');
        }
    }

    var save = function () {
        // Save all data into Storage
        if ( DEBUG )
            console.log(SERVICE, "[save] properties=", properties);

        ObjectAssign(self, properties);
        _STORAGE.set(properties);

        $rootScope.$broadcast('CountDownTimerChangeEvent');
    }

    var CountDownTimer = function (_properties) {
        // New Counter OR Continue Old Counter
        // - New counter for apps that just started
        // - Old counter for apps that:
        //      - Got back from background
        //      - Page was refreshed

        if ( ! _STORAGE )
            _STORAGE = new LocalStorage(_properties.id || properties.id );

        // Do we have something stored in LocalStorage ?
        var timer_storage = _STORAGE.get();
        if ( timer_storage ) {

            // We have an old timer, lets check its existance            
            properties = timer_storage;
            ObjectAssign(self, timer_storage);

        } else {

            // Was a custom properties requested ?
            if ( _properties )
                ObjectAssign(properties, _properties);

            // Create a new Timer
            properties.orig_data = {
                counter:    properties.counter,
                interval:   properties.interval,
            }
            ObjectAssign(self, properties);
        }

        if ( DEBUG)
            console.warn(SERVICE, "New Timer Has Been Created");

        save();
    };

    // Prototype
    CountDownTimer.prototype = {

        start: function () {
            var interval = properties.interval;

            $timeout.cancel(_timer);
            _timer = $timeout(_timerCtrl, interval);

            if ( DEBUG ) 
                console.log(SERVICE, "[start] starting with interval:", interval);
        },

        stop: function () {
            $timeout.cancel(_timer);

            if ( DEBUG )
                console.log(SERVICE, "[stop]");
        },

        getInfo: function() {
            return properties;
        },

        getCounter: function () {
            return properties.counter;
        },

        getLastUpdate: function () {
            var self = this;
            return new Date(properties.last_updated);
        },

        update: function(key, value) {
            // Update global properties
            properties[key] = value;
        },

        restart: function () {
            var self = this;
            var original_props = properties.orig_data;

            if ( DEBUG )
                console.log(SERVICE, "[restart] original counter:", original_props.counter)

            ObjectAssign(properties, original_props);
            save();

            $timeout.cancel(_timer);
            _timer = $timeout(_timerCtrl, properties.interval);
        },

        remove: function() {
            // Removing the timer from LS
            var timer_id = properties.id;

            if ( timer_id ) {
                if ( DEBUG ) 
                    console.log(SERVICE, "[remove] Removing timer", timer_id);

                _STORAGE.removeItem(timer_id);
            }
        },

        save: save        
    };

    return CountDownTimer;
}]);
