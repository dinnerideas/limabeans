'use strict';

angular.module('starter.services', [])

.constant('FIREBASE_URL', 'https://dinner-ideas.firebaseio.com/')

.constant('BIGOVEN_URL', 'http://api.bigoven.com/recipes?&api_key=dvxFGZ6A9s7e7e3s4IIcZfX7MvmW44N2&rpp=200&pg=')

.factory('User', function($firebaseAuth, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var data = null;

  return {
    set: function(user) {
      data = user;
    },
    get: function() {
      return data;
    },
    login: function() {
      ref.authWithPassword({
        email    : user.email,
        password : user.password
      }, function(error, authData) {
        if (error) {
          console.log('Login Failed!', error);
        } else {
          console.log('Authenticated successfully with payload:', authData);
          $scope.$apply(function() {
            User.set(authData);
            $scope.user = User.get();
            console.log(User, User.get());
          });
        }
      });
    },
    loggedIn: function() {
      if (data) {
        return Object.keys(data).length > 0;
      } else {
        return false;
      }
    }
  };
})

.factory('Search', function(BIGOVEN_URL, $http) {
  var lastUsedPG = 1;
  return {
    page: function(num) {
      return $http.get(BIGOVEN_URL + num).success(function(data, status) {
        if (status === 200) {
          lastUsedPG = num;
        }
      }).error(function(data, status, headers, config) {
        console.log(data, status, headers, config);
      });
    },
    getNextPage: function() {
      this.page(lastUsedPG++);
    }
  };
})

.factory('Recipe', function(FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL + 'recipes');

  return {
    create: function(recipe) {
      console.log(recipe);
    }
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
