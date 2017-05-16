

var myApp = angular.module('myApp', ['localstorage-countdown-timer'])

// Your controller
.controller('GenericCtrl', ['$rootScope', '$scope', 'CountDownTimer', function ($rootScope, $scope, CountDownTimer) {
    $scope.properties = {
        counter:  100,
        interval: 1000,
        id:       "CountDownTest"
    };

    
    // Timer functionality
    $scope.reload = function() {
        $scope.AppTimer = new CountDownTimer($scope.properties);
        update_timer_info();
    }

    $scope.recreate = function () {
        if ( $scope.AppTimer )
            $scope.AppTimer.remove();

        $scope.AppTimer = new CountDownTimer($scope.properties);
    }

    $scope.resume = function() {
        $scope.AppTimer.start();
    }

    var update_timer_info = function() {
        if ( $scope.AppTimer ) {
            $scope.TimerRunning = $scope.AppTimer.getInfo();
        }
    }

    // Events
    $scope.$on('CountDownTimerChangeEvent', function () {
        update_timer_info();
    });
}]);

