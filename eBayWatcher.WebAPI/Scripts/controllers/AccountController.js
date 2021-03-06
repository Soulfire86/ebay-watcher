﻿
eBayWatcher.controller('AccountController', ['$scope', '$http', 'DataService', function ($scope, $http, DataService) {

    $scope.loading = true;
    $scope.loginStep = 'StartingSession'; // StartingSession, AwaitingLogin, LoggedIn
    $scope.eBayLoginUrl = '';

    $scope.getState = function () {
        $scope.loading = true;
        if (!getCookie('eBayWatcherSession') || !getCookie('eBayWatcherLoginUrl')) {
            // If no session is found, start a new session
            $scope.startLogin();
        }
        else {
            $scope.loginStep = 'AwaitingLogin';
            $scope.eBayLoginUrl = getCookie('eBayWatcherLoginUrl');
            if (!getCookie('eBayWatcherToken') || !getCookie('eBayWatcherUsername')) {
                // If no token is found, check to see if one is waiting
                $scope.confirmLogin();
            }
            else {
                setLoggedIn();
                $scope.loading = false;
            }
        }
    }

    function setLoggedIn() {
        // Set up all requests to pass the token and username along as HTTP Headers
        $http.defaults.headers.common.eBayWatcherToken = getCookie('eBayWatcherToken');
        $http.defaults.headers.common.eBayWatcherUsername = getCookie('eBayWatcherUsername');
        $scope.loginStep = 'LoggedIn';
    }

    $scope.startLogin = function () {
        $http.post(DataService.baseUrl + '/Account')
            .then(function (response) {
                console.log('Got new session id ' + response.data.SessionId);
                setCookie('eBayWatcherSession', response.data.SessionId);
                setCookie('eBayWatcherLoginUrl', response.data.LoginUrl);
                $scope.loginStep = 'AwaitingLogin';
                $scope.loading = false;
                $scope.eBayLoginUrl = response.data.LoginUrl;
            }, function (response) {
                // Error
                $scope.loading = false;
            });
    };
    $scope.confirmLogin = function () {
        $scope.loading = true;
        $http.post(DataService.baseUrl + '/Account/ConfirmLogin', { sessionId: getCookie('eBayWatcherSession') })
            .then(function (response) {
                console.log('Got token ' + response.data.Token + ' for user ' + response.data.Username);
                setCookie('eBayWatcherToken', response.data.Token);
                setCookie('eBayWatcherUsername', response.data.Username);

                setLoggedIn();

                $scope.loading = false;
            }, function (response) {
                // Error
                $scope.loading = false;
                $scope.eBayLoginUrl = getCookie('eBayWatcherLoginUrl');
            });
    };

    $scope.getStatusMessage = function () {
        if ($scope.loginStep === 'AwaitingLogin') {
            return 'Not logged in';
        }
        else {
            return 'Logged in as ' + getCookie('eBayWatcherUsername');
        }
    };

    $scope.getState();

    $scope.logOut = function () {
        setCookie('eBayWatcherSession', '');
        setCookie('eBayWatcherToken', '');
        setCookie('eBayWatcherLoginUrl', '');
        setCookie('eBayWatcherUsername', '');
        $scope.loginStep = 'StartingSession';
        $scope.getState();
    };

}]);
