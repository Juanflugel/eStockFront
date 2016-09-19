(function(){
  'use strict';

angular.module('companyFiltersModule',[])

.controller('filterCtrl',['$scope','shop',function ($scope,shop){
	$scope.filterTags = shop.getCompanyFilters();

	$scope.filtersDetails = function(obj){
		$scope.myFilters = obj.array;
		$scope.currentFilter = obj;
		$scope.showFilters = true;
		console.log('filters');

	};

	$scope.saveChangesInFilters = function(){
		console.log($scope.myFilters);
	}; 

}]);


}());