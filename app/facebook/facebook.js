'use strict';

angular.module('ngSocial.facebook', ['ngRoute', 'ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])
.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('Your App Id');
  $facebookProvider.setPermissions("email,public_profile, user_posts, publish_actions, user_photos,user_friends");
})

.run(function($rootScope){
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
})

.controller('FacebookCtrl', ['$scope', '$facebook',function($scope, $facebook) {
  $scope.isLoggedIn = false;
  $scope.login = function(){
    $facebook.login().then(function(){
      console.log("Logged In");
      $scope.isLoggedIn = true;
      refresh();
    },function(err){
      console.log(err);
    })
  }

  $scope.logout = function(){
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false;
      refresh();
    })
  }

  function refresh(){
    $facebook.api("/me").then(function(response){
      $scope.welcomeMsg = "Welcome " + response.name;
      $scope.isLoggedIn = true;
      $scope.userInfo = response;
      $facebook.api('/me/picture').then(function(response){
        $scope.picture = response.data.url;
        $facebook.api("/me/permissions").then(function(response){
          $scope.permissions = response.data;
          $facebook.api('/me/posts').then(function(response){
            console.log(response.data);
            $scope.posts = response.data;
            $facebook.api('/me/friends').then(function(response){
              console.log(response.data);
              $scope.friends = response.data;
            })
          })
        })
      })
    }, function(error){
      $scope.welcomeMsg = "Please Log In"
    })
  }

  $scope.poststatus = function(){
    var body = this.body
    $facebook.api('/me/feed', 'post', {message: body}).then(function(){
      $scope.msg = "thanks for posting";
      refresh();
      body = "";
    })
  }

  $scope.likes = function(id){
    console.log("clicked");
    $facebook.api(id + '/likes').then(function(response){
      console.log(response.data);
      $scope.postCount = response.data;
      $scope.postCountLength = a.length;
    })
  }

  refresh();
}]);