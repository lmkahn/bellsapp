angular.module('bellsapp').controller('MapCtrl', ['$scope', '$compile', '$q', 'ckConsole', 'ckConsoleMap', '$location', function($scope, $compile, $q, ckConsole, ckConsoleMap, $location){
	var htmlContent = '<span><div ng-include src="\'views/infopopup.html\'"></div></span>';
	var compiledPopup = $compile(htmlContent)($scope);
	$scope.infoPopup = L.popup().setContent(compiledPopup[0]);
		
	$( document ).ready(function() {
		$('#loadingPanel').css('background-color','rgba(0,0,0,0.5)');
		$('#spinner').spin('large', '#fff');
		
		$scope.map = L.map("map-canvas", {minZoom: 14}).setView([45.436 , 12.334], 14);
		$scope.baseLayer = new L.TileLayer(
			'http://{s}.tiles.mapbox.com/v3/bennlich.map-8ds9rdrc/{z}/{x}/{y}.png',
			{ attribution: 'Map tiles Â© MapBox' }
			).addTo($scope.map);
		L.control.scale().addTo($scope.map);
		
		$scope.layerControl = L.control.layers({"Map": $scope.baseLayer}, {}).addTo($scope.map);

		var names = {
			"Bell Tower Page Final": "Bell Towers",
		};
		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click', showInfoBox);
			$scope.layerControl.addOverlay(layer.getLayer(), names[groupname]);
			
			$('#loadingPanel').hide();
			$('#spinner').spin(false);
		}).then(function(map){
			console.log(map);
			$('#loadingPanel').hide();
			$('#spinner').spin(false);
		});


		
		function showInfoBox(e, member, marker, layer){
			$scope.popupLayer= layer;
			$scope.popupItem = member;
			$scope.$apply();//make sure to update popup before displaying it
			$scope.infoPopup.setLatLng(e.latlng).openOn($scope.map);
		}
		
		$scope.showMoreInfo = function(){
			$location.path('/moreInfo/'+$scope.popupLayer.properties.moreLink.id+'/'+$scope.popupItem.birth_certificate.ckID);
		}
		
		$scope.visitVenipedia = function(){
			var pageTitle = $scope.popupItem.data['Page name'];
			window.open("http://venipedia.org/wiki/index.php?title="+pageTitle);
		}

		$scope.playSound = function(){
			return new Audio($scope.getSound($scope.popupItem)).play();
		}

		$scope.getSound = function(popupItem){
			if(!popupItem) return;
			var bellCode = $scope.popupItem.data['Bell Tower ID'];
			audioFiles = { 'APON': '../Sounds/APONC3_2012_audio_hitonce.mp3', 'BART': '../Sounds/BARTC1_audio.mp3', 'GIMA': '../Sounds/GIMA_2012_C1.mp3','GIOB': '../Sounds/GIOB_2012_C1.mp3', 'MARC': '../Sounds/MARCCC_2012_audio.mp3', 'MICH': '../Sounds/MICHC1_audio.mp3', 'RAFF1': '../Sounds/RAFF_audio.mp3', 'SALV': '../Sounds/SALVC1_audio.mp3', 'STAE': '../Sounds/STAEC1_audio.mp3', 'VIGN': '../Sounds/VIGNCC_audio.mp3'};
			if(typeof audioFiles[bellCode] != 'undefined'){
				return audioFiles[bellCode];
			}
			else{
				return false;
			}
		}


		/* Displays question mark and vpc logo */
			function createBrandBox(){
				var info = L.control({position: "bottomleft"});
				info.onAdd = function (map) {
					var htmlContent = '<div class="info" style="width:auto;">'+
						'<span ng-click="showAbout()"><img src="about.png" style="cursor:pointer;padding-right:7px;"></span>'+
						'<a href="http://veniceprojectcenter.org" target="_blank"><img src="vpc25logo.png"></a>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}

			function createLegendBox(){
				var info = L.control({position: "bottomright"});
				info.onAdd = function (map) {
					var htmlContent = '<div style="padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.9);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px; width: 200px;"class="info"><h4>Bell Tower Information</h4>'+
									  '<div><img src="../belltower6_red.png"><span style="vertical-align:middle;margin-left:2px;">Audio and View</span></div>'+
									  '<div><img src="../belltower6_orange.png"><span style="vertical-align:middle;margin-left:2px;">View</span></div>'+
									  '<div><img src="../belltower6_yellow.png"><span style="vertical-align:middle;margin-left:2px;">Audio</span></div>'+
									  '<div><img src="../belltower6_white.png"><span style="vertical-align:middle;margin-left:2px;">No Audio or View</span></div>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}
			
			$scope.showAbout = function (){
				$('#aboutPanel').show();
			}
			$scope.hideAbout = function (){
				$('#aboutPanel').hide();
			}

			createBrandBox().addTo($scope.map);
			createLegendBox().addTo($scope.map);
			$('#aboutPanel').hide();
	});
}]);