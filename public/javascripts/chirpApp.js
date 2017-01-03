var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http, $location) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';

	$rootScope.signout = function(){
			console.log("sign out");
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
			$location.path('/login');
	};
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		.when('/about', {
			templateUrl: 'about.html',
			controller: 'aboutController'
		});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function(postService, $scope, $rootScope){
	$scope.posts = postService.query();
	var newPost = { title: '', text: '' , created: ''};
  //handle post from view
	$scope.post = function(){
		newPost.title = $scope.title;
		newPost.text = $scope.text;
		newPost.created = Date.now();
		postService.save(newPost, function(){
			$scope.posts = postService.query();
			newPost = { title: '', text: '', created: ''};
			$scope.title = '';
			$scope.text = '';
		})
	};

	$scope.deletePost = function(post){
		console.log("post: " + post._id);
		postService.delete(post, function(){
			$scope.posts = postService.query();
		});
	};
/*	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};

	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};*/
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
		console.log("user: " + $scope.user);
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
				console.log(data);
        //$rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
		console.log($scope.user);
    $http.post('/auth/signup', $scope.user).success(function(data){
			console.log(data);
      if(data.state == 'success'){
				console.log("success");
        $rootScope.authenticated = true;
        //$rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});

app.controller('aboutController', function(postService, $scope, $rootScope){

});
