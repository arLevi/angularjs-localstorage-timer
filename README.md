## AngulsrJS LocalStorage CountDown Timer

> A countdown timer that write the data into the localStorage of the browser.
> It's being used incase of:
> -You want to refresh the page and continue from where you left off.
> -You want to get notified when the time is up ( Event ) and trigger something.

```shell
$ npm install --save angularjs-localstorage-timer
```

## Usage example
A full-featured working example can be found under the `node_modules/angularjs-localstorage-timer/src/index.html` directory.

```html
<!-- In your HTML file ( index.html ) -->
<script src="node_modules/dist/localstorage-countdown-timer.min.js"></script>
```

```javascript
// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['localstorage-countdown-timer'])
```

```javascript
// Inside your controller...
.controller('GenericCtrl', ['$scope', 'CountDownTimer', function ($scope, CountDownTimer) {
  // Create new Timer object
  $scope.AppTimer = new CountDownTimer({
    id:       "CountDownTimer",
    counter:  60,
    interval: 1000
  });
}]);
```

## Events
```javascript
.controller('GenericCtrl', ['$rootScope', '$scope', 'CountDownTimer', function ($rootScope, $scope, CountDownTimer) {
    // Inside your controller...
    $scope.AppTimer = new CountDownTimer({ ... parameters from above ... });

    $scope.$on('CountDownTimerChangeEvent', function () {
        // Event that is triggered on every $interval ( 1000 - every 1s )
        // ... do code here ...
    });

    $scope.$on('CountDownTimerEndEvent', function () {
        // Event that is triggered when the timer reaches zero (0)
        // ... do code here ...
    });
}]);
```

## Timer Functions
### .start()
Stop the timer

```html
<button ng-click="AppTimer.start()"> Start </button>
```

### .stop()
Starting/Resuming the timer.

```html
<button ng-click="AppTimer.start()"> Start </button>
```

### .restart()
Restart the timer with the values given when creating the timer.
Timer won't start running, need to use `start()`
```html
<button ng-click="AppTimer.restart()"> Restart </button>
```

### .update()
Update one of the parameters given to the `new CountDownTimer()`'s properties ( id, counter etc .. )
The update action will save the values into `LocalStorage` as well, but won't restart the timer.
Timer won't start running, need to use `start()`
```html
<button ng-click="AppTimer.update('counter', 120)"> Update </button>
```

## Timer Information
### .getCounter()
Will return the exiting counter value
```javascript
$scope.counter = $scope.AppTimer.getCounter();
```

### .getLastUpdate()
Will return the "last updated" value that the timer has stored.
The value is a `Date()` object.
```javascript
$scope.lastUpdate = $scope.AppTimer.getLastUpdate();
```

### .getInfo()
Return as `JSON` all the possible information stored in `LocalStorage`.
Meaning the `counter`, `last_updated`, the timer's `id` etc ..
```javascript
$scope.counter = $scope.AppTimer.getCounter();
```

## Timer LocalStorage Actions

### .reload()
So the `reload()` isn't really there ... we need to write it on our own in our `controller` as:
If `$scope.properties.id` - is already found in `LocalStorage` - the timer will be reloaded with the last counter.
But if the `id` isn't found, it will create a new timer.

```javascript
    $scope.reload = function() {
        $scope.AppTimer = new CountDownTimer($scope.properties);
        update_timer_info();
    }
```

### .remove()
Removing the timer **entirly** from `LocalStorage`.
Remember that in order to continue from where we left off - the timer is always there ...

```javascript
$scope.AppTimer.remove();
```
