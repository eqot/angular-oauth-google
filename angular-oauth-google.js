
(function(window, angular, undefined) {'use strict';

angular.module('AngularOauthGoogle', [])
  .service('oauthGoogleService', function ($rootScope) {

    $rootScope.account = '';

    var isReady = false;
    var triedSignedIn = false;
    var isAuthenticated = false;

    var id = null;
    var scopes = null;

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

      if (triedSignedIn) {
        signIn();
      }
    };

    function signIn (immediate, clientId, clientScopes) {
      triedSignedIn = true;

      if (clientId) {
        id = clientId;
      }
      if (clientScopes) {
        scopes = clientScopes;
      }

      if (!isReady || isAuthenticated) {
        return;
      }

      gapi.auth.authorize({
        client_id: id,
        scope: scopes,
        immediate: immediate || true
      }, handleAuthResult);
    }

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
            $rootScope.account = res.email;
            $rootScope.$apply();
          }
        });
      });
    }

    return {
      signIn: signIn
    };
  })

  .directive('oauthGoogle', function (oauthGoogleService) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        oauthGoogleService.signIn(true, attrs.id, attrs.scopes.split(','));
      }
    };
  });

})(window, window.angular);
