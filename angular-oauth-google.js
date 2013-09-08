
(function(window, angular, undefined) {'use strict';

var oauthGoogleModule = angular.module('AngularOauthGoogle', [])

  .controller('oauthGoogleCtrl', function($scope) {

    $scope.account = '';

    var isReady = false;
    var isAuthenticated = false;

    initialize();

    function initialize () {
      var firstScriptTag = document.getElementsByTagName('script')[0];

      loadScript('http://www.google.com/jsapi');
      loadScript('https://apis.google.com/js/client.js?onload=onJSClientLoad');

      function loadScript (url) {
        var tag = document.createElement('script');
        tag.src = url;
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    window.onJSClientLoad = function () {
      isReady = true;
    };

    $scope.signin = function (clientId, clientScope, immediate) {
      if (!isReady || isAuthenticated) {
        return;
      }

      clientId = '@@google_crednetial';
      clientScope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/youtube.readonly'
        // 'https://www.googleapis.com/auth/yt-analytics.readonly'
      ];

      gapi.auth.authorize({
        client_id: clientId,
        scope: clientScope,
        immediate: immediate || true
      }, handleAuthResult);
    };

    function handleAuthResult (authResult) {
      console.log(authResult);

      if (authResult) {
        console.log('Authenticated.');

        isAuthenticated = true;

        loadAPIClientInterfaces();
      } else {
        console.log('Failed.');
      }
    }

    function loadAPIClientInterfaces() {
      gapi.client.load('oauth2', 'v2', function() {
        var request = gapi.client.oauth2.userinfo.get();
        request.execute(function (res) {
          if (res.email) {
            $scope.account = res.email;
            $scope.$apply();
          }
        });
      });
    }

  });

})(window, window.angular);
