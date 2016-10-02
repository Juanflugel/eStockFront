(function(){
  'use strict';

angular.module('companyFiltersModule',[])

.controller('filterCtrl',['$scope','shop',function ($scope,shop){
	
	$scope.filterTags = shop.getCompanyFilters();
	$scope.companyId = shop.getCompanyId();

	$scope.filtersDetails = function(obj){
		$scope.myFilters = obj.array;
		$scope.currentFilter = obj;
		$scope.showFilters = true;
		console.log('filters');

	};

	$scope.saveChangesInFilters = function(chip){
		console.log(chip);
	};

	$scope.pushFilter = function(chip){
		var query = {};
		query.companyId = $scope.companyId;
		query['companyItemFilters.queryObjKey']= $scope.currentFilter.queryObjKey;
		var tag = {};
		tag.toAdd = chip;
		shop.companyFiltersUpdate.update(query,tag,function (data){
			console.log(data);
		},function (error){
			console.log(error);
		});
	};

	$scope.removeFilter = function(chip){
		var query = {};
		query.companyId = $scope.companyId;
		query['companyItemFilters.queryObjKey']= $scope.currentFilter.queryObjKey;
		var tag = {};
		tag.toRemove = chip;
		shop.companyFiltersUpdate.update(query,tag,function (data){
			console.log(data);
		},function (error){
			console.log(error);
		});
	};

}]);


}());