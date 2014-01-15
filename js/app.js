angular.module('bellsapp', ['uiSlider', 'ckServices', 'ngRoute', 'ngAnimate'])
	.config(function($routeProvider, $locationProvider, $rootScopeProvider) {
		$routeProvider.when('/map', {
			templateUrl: 'views/map.html',
			controller: 'MapCtrl'
		});
		$routeProvider.when('/moreInfo/:formId/:itemId', {
			templateUrl: 'views/moreInfo.html',
			controller: 'MoreInfoCtrl'
		});
		$routeProvider.otherwise({
			redirectTo: '/map'
		});
		$rootScopeProvider.digestTtl(30);
	})
	.run(['$location', '$rootScope', 'ckConsole', function($location, $rootScope, ckConsole) {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			if(current.$$route){
				switch(current.$$route.controller){
				case 'MapCtrl':
					document.title = "Venice Bells Map";
					break;
				case 'MoreInfoCtrl':
					ckConsole.getData(current.params.itemId).then(function(item){
						document.title = item.data.Title;
					});
					break;
				default:
				document.title = "Venice Bells";
					break;
				}
			}
		});
	}]);