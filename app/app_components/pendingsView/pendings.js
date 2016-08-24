(function(){
  'use strict';
angular.module('pendingsModule',[])

.controller('pendingsCtrl', ['$scope','shop','handleProjects',function ($scope,shop,handleProjects){
// table set up
$scope.header = {itemCode:'Item Code',itemAmount:'Stock',itemType:'Type',itemName:'Name',itemBuyPrice:'Price',itemProvider:'Provider'};

var query = {};
query.companyId = 'RMB01';
query.projectState = 'open';

$scope.filtrar = {itemType:'SCHRAUBE'};
$scope.queryItems = function(){
		var j = {};
		j[$scope.filterModel.queryObjKey] = $scope.queryTag;
		console.log(j);		
		$scope.filtrar = j;
};	

	shop.prueba.query(query,function (data){
		console.log(data.length,new Date(),query);
		$scope.collection = data;
		$scope.filterBy = shop.getCompanyFilters(); // tomar los filtros que usa la empresa

	},function (error){
		console.log(error);
	});


	
	
}])









.directive('pendingsViewHeader', [function (){
	// Runs during compile
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app_components/pendingsView/pendingsViewHeader.html'		

	};
}])
.directive('pendingsTable', [function (){
	// Runs during compile
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app_components/pendingsView/pendingsTable.html',
		link: function($scope) {
			$scope.order = function(predicate){
				$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
				$scope.predicate = predicate;
			};
		}		

	};
}]);
}());