angular.module('bellsapp').controller('MoreInfoCtrl', ['$scope', '$compile', '$q', 'ckConsole', '$route', '$routeParams', '$location', function($scope, $compile, $q, ckConsole, $route, $routeParams, $location){
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	
	$scope.backToMap = function(){
		$location.path('/map');
	};
	
	ckConsole.getExpandedData($route.current.params.itemId).then(function(val){
		$scope.item = val;
		$scope.hasImage = true	;
	});
	ckConsole.getForm($route.current.params.formId).then(function(val){
		$scope.mainForm = val;
	});
	
	var formIdFromType = {};
	$q.all({
		"Bell Tower Page Final": ckConsole.getForm("4a7f84a3-11b6-b459-c55f-1760ca6e1123")
	});
}]);

angular.module('bellsapp').directive('row', function ($compile, sharedProperties) {
    return {
        restrict: 'E',
        scope: {
            item: "="
        },
        link: function (scope, element, attrs) {
        	scope.sharedProperties = sharedProperties;
            var html ='<iframe name="bell tower" id="bell tower" width="100%" height="254" style="visibility:visible" ng-show = "item" src="{{sharedProperties.getImage(item)}}"></iframe><p ng-show="item">To rotate this panorama, either click and drag the image or click on this <a href = "http://bells.veniceprojectcenter.org/BellTowerControl.html">link</a> to rotate it from a mobile device.</p>';
            var e =$compile(html)(scope);
            element.replaceWith(e);
        }
    };
});

angular.module('bellsapp').service('sharedProperties', function($timeout) {
    
    return {
        getImage: function(item){
        	if(!item) return;
			var bellCode = item.data['Bell Tower ID'];
			imageFiles = { 'DONA': '/DONA_View.html','FORM': '/FORM_View.html','FRAR': '/FRAR_View.html', 'GERE': '/GERE_View.html', 'GIMA': '/GIMA_View.html','GIOB': '/GIOB_View.html', 'ORTO': '/ORTO_View.html', 'PIET': '/PIET_View.html', 'POLO': '/POLO_View.html','RAFF1': '/RAFF_View.html'};
			if(typeof imageFiles[bellCode] != 'undefined'){
				var panorama = imageFiles[bellCode];
				return imageFiles[bellCode];
			}
			else{
				return;
			}
	}
}});

