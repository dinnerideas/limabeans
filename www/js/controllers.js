'use strict';

angular.module('starter.controllers', [])

.constant('FIREBASE_URL', 'https://dinner-ideas.firebaseio.com/')

.controller('DashCtrl', function($scope, Search) {
  $scope.search = function() {
    Search.page(1).success(function(data) {
      $scope.recipes = data.Results;
    });
  };
})

.controller('MealsCtrl', function($scope, $ionicPopup, $timeout, Search) {
  $scope.showPopup = function() {
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.days">',
    title: 'Number of Days',
    subTitle: 'How many days you want to plan meals for',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.days) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.days;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
    myPopup.close();
  });
 };
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('UserCtrl', function($scope, $rootScope, $firebaseAuth, FIREBASE_URL, User, $state, $ionicLoading) {

  // Get a reference to the Firebase
  var ref = new Firebase(FIREBASE_URL);

  $scope.signup = function(user) {
    if (user.password === user.passwordConfirmation) {
      ref.createUser({
        email    : user.email,
        password : user.password
      }, function(error, userData) {
        if (error) {
          console.log('Error creating user:', error);
        } else {
          console.log('Successfully created user account with uid:', userData.uid);
          var refUser = ref.child('users').child(userData.uid);
          refUser.set({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }, function(error) {
            if (error) {
              console.log('There was an error Synchronizing: ' + error);
            } else {
              console.log('Synchronization succeeded.');
              $scope.login(user);
              $state.go('tab.meals');
            }
          });
        }
      });
    } else {
      // Password and Confirmation do not match
      console.log('Password & Confirmation do not match!');
    }
  };

  $scope.login = function(user) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    ref.authWithPassword({
      email    : user.email,
      password : user.password
    }, function(error, authData) {
      if (error) {
        $ionicLoading.hide();
        console.log('Login Failed!', error);
      } else {
        $scope.$apply(function() {
          User.set(authData);
          $rootScope.user = User.get();
        });
      }
    });
  };

  $scope.logout = function() {
    ref.unauth();
    $scope.user = {};
    $scope.loginData = {};
    $state.go('login');
  };

  ref.onAuth(function(authData) {
    if (authData) {
      $scope.user = authData;
      var userAuth = ref.child('users').child($scope.user.uid);
      userAuth.on('value', function(data) {
        angular.extend($scope.user, data.val());
        User.set($scope.user);
        if (User.loggedIn()) {
          $ionicLoading.hide();
          $state.go('tab.meals');
        }
      });
    }
  });

});

