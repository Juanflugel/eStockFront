(function(){
  'use strict';
angular.module('companyModule',['services'])

.controller('companyCtrl',['$scope','shop',function ($scope,shop){
	console.log('Company view care verga');
	$scope.companyId = shop.getCompanyId();
	$scope.currentCompany = shop.getTotalCompanyInfo();

	$scope.menu = [{menuItem:'Employees'},{menuItem:'Filters'}]; //,{menuItem:'Providers'}
}])















.directive('companyMenuList', [function (){
  // Runs during compile
  return {
	restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
	// templateUrl: 'app_components/companyView/companyMenuList.html'
	templateUrl: 'companyView/companyMenuList.html'   

};
}]);

}());