(function(){
  'use strict';
/**
*  Module
*
* Description
*/

angular.module('menuModule', [])

.controller('menuCtrl', ['$scope','$timeout','$mdSidenav','$log',function ($scope,$timeout, $mdSidenav, $log){
	
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  
  $scope.isOpenRight = function(){
	return $mdSidenav('right').isOpen();
  };

  function debounce(func, wait) {
	var timer;
	return function debounced() {
	  var context = $scope,
	  args = Array.prototype.slice.call(arguments);
	  $timeout.cancel(timer);
	  timer = $timeout(function() {
		timer = undefined;
		func.apply(context, args);
	  }, wait || 10);
	};
  }
	/**
	 * Build handler to open/close a SideNav; when animation finishes
	 * report completion in console
	 */
	 function buildDelayedToggler(navID) {
	  return debounce(function() {
		// Component lookup should always be available since we are not using `ng-if`
		$mdSidenav(navID)
		.toggle()
		.then(function () {
			// $log.debug("toggle " + navID + " is done");
		  });
	  }, 200);
	}
	function buildToggler(navID) {
	  return function() {
		// Component lookup should always be available since we are not using `ng-if`
		$mdSidenav(navID)
		.toggle()
		.then(function () {
			// $log.debug("toggle " + navID + " is done");
		  });
	  };
	}


	$scope.close = function () {
	  // Component lookup should always be available since we are not using `ng-if`
	  $mdSidenav('left').close()
	  .then(function () {
		$log.debug("close RIGHT is done");
	  });
	};


	
  }]);
}());