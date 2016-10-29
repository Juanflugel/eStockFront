(function(){
  'use strict';

  angular.module('ordersModule',[])
  .controller('ordersCtrl',['$scope',function ($scope){
  		console.log('orders controller');
  }])

  .directive('ordersListCard', ['shop',function (shop){
  // Runs during compile
  return {
	restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
	//templateUrl: 'projectsView/projectListCard.html'
	 templateUrl: 'app_components/ordersView/ordersListCard.html',
	 link: function ($scope){
	 	$scope.progressBardisable = false;
	 	shop.orders.query(function (data){
	 		$scope.orders = data;
	 		console.log(data);
	 		$scope.progressBardisable = true;
	 	},function (error){});

	 	$scope.showOrderDetails = function(obj){
	 		$scope.orderInfo = obj;
	 		$scope.collection = $scope.orderInfo.orderedItems;
	 	};
	 }    

	};
 }])

  .directive('orderDetailsHeader', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'app_components/ordersView/orderDetailsHeader.html'     

  };
}])
.directive('orderTable', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'app_components/ordersView/orderTable.html',
    link: function($scope) {
    		$scope.header = {itemCode:'Item Code',itemAmount:'Ordered Amount',itemName:'Name',itemBuyPrice:'Price',itemProvider:'Provider'};
            $scope.order = function(predicate){
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            };
        }    

  };
}]);

  }());