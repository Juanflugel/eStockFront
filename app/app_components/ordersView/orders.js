(function(){
  'use strict';

  angular.module('ordersModule',[])
  .controller('ordersCtrl',['$scope','shop',function ($scope,shop){
    
    $scope.firmaId = shop.getCompanyId();
    var query = {};
    query.companyId = $scope.firmaId;
    $scope.queryOrders = function(index,state){
                  query.orderState = state || 'open';  
                  shop.orders.query(query,function (data){
                    $scope.orders = data;
                    console.log(data);
                    $scope.orderInfo = data[index] || data[0] || [];
                    $scope.collection = $scope.orderInfo.orderedItems || [];
                    $scope.progressBardisable = true;
                    },function (error){
                        console.log(error);
                    });  
                };

     if ($scope.firmaId){
        $scope.queryOrders();
      }
     $scope.$on('companyInfoAvailable',function(){
        $scope.firmaId = shop.getCompanyId();
        console.log('from run');
        $scope.queryOrders();
     });
    

}])

  .directive('ordersListCard', ['shop',function (shop){
  // Runs during compile
  return {
	  restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
	//templateUrl: 'projectsView/projectListCard.html'
      templateUrl: 'ordersView/ordersListCard.html',
      link: function ($scope){
            
                $scope.progressBardisable = false;
                $scope.statusList = ['Pending','Ordered','Paid','Delivered'];   

                $scope.showOrderDetails = function(obj){
                    $scope.orderInfo = obj;
                    $scope.collection = $scope.orderInfo.orderedItems;
                };

                $scope.deleteOrder = function(order,index){

                var r = confirm('Are you sure to delete Order: '+ order.orderNumber);
                    if (r === true) {
                     shop.orders.remove({_id:order._id},function (data){
                        $scope.orders.splice(index,1);
                        alert('Order: '+ data.orderNumber +' successfully deleted');
                        $scope.queryOrders();
                     });
                    } else {
                        return;
                    }

                };

                $scope.editOrderObj = function(order){
                    var today = new Date().toString();
                    order.orderDeliveringDate = order.orderDeliveringDate ? new Date(order.orderDeliveringDate):new Date(today);                    
                    console.log(order,today);
                    $scope.obj = order;                    
                    $scope.editOrder = true;
                };

                $scope.updateOrder = function(order){
                    var orderId = order._id;
                    shop.ordersUpdate.update({_id:orderId},order,function (data){
                        console.log(data);
                        $scope.obj = {};
                        $scope.queryOrders(); 
                        $scope.editOrder = false;                       
                    });
                };

                $scope.closeOrder = function(order){
                    var idDocument = order._id;
                    order.orderState = 'closed';
                    shop.ordersUpdate.update({_id:idDocument},order,function (data){
                        console.log(data);
                        $scope.queryOrders();
                        
                    });
                };
 }    

};
}])

.directive('orderDetailsHeader', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    //templateUrl: 'app_components/ordersView/orderDetailsHeader.html'
    templateUrl: 'ordersView/orderDetailsHeader.html'    

};
}])
.directive('orderTable', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    //templateUrl: 'app_components/ordersView/orderTable.html',
    templateUrl: 'ordersView/orderTable.html',
    link: function($scope) {
      $scope.header = {itemCode:'Item Code',itemAmount:'Ordered Amount',itemName:'Name',itemBuyPrice:'Price',handle:'Handle'};
      $scope.order = function(predicate){
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
}    

};
}]);

}());