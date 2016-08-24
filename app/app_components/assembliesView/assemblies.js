(function(){
  'use strict';
angular.module('assembliesModule',['services'])

.controller('assembliesCtrl',['$scope','shop',function ($scope,shop){
    var firmaId = 'RMB01';
    $scope.header = {itemCode:'Item Code',neededAmount:'Amount',itemName:'Name'};
    var query = {};
    query.companyId = firmaId;
    
    shop.assembly.query(function (data){
                $scope.assemblies = data;
                $scope.assemblyInfo = $scope.assemblies[0];
                $scope.collection = $scope.assemblyInfo.assemblyItems;
            },function (error){
                console.log(error);
            });


    // assembly details logic - once you select an assembly

    $scope.showAssemblyItems = function(obj){ // show all the items that belong to an assembly
        $scope.assemblyInfo = obj;
        $scope.collection = obj.assemblyItems;
    };

    $scope.editObj = function(obj){ // edit a item inside an assembly
        $scope.obj = obj;
        $scope.insertObjInAssembly = false;
        $scope.editObjInAssembly = true;
    };
    $scope.newObj = function(){ // insert a  new Item in an assembly
        $scope.obj = {};
        $scope.editObjInAssembly = false;
        $scope.insertObjInAssembly = true;
    };

    $scope.insertItemInAssembly = function(obj){ // query to the api to insert a new item
        console.log(obj);
        var query = {};
        query.companyId = firmaId;
        query.assemblyNumber = $scope.assemblyInfo.assemblyNumber;
        shop.assemblyUpdate.update(query,obj,function (data){
            console.log(data);
            $scope.assemblyInfo = data;
            $scope.collection = $scope.assemblyInfo.assemblyItems;
            $scope.insertObjInAssembly = false;
        },function (error){
            console.log(error);
        });
    };

    $scope.updateItemInAssembly = function(obj){
        var query = {};
        query.companyId = firmaId;
        query.assemblyNumber = $scope.assemblyInfo.assemblyNumber;
        query['assemblyItems._id'] = obj._id;

        shop.assemblyUpdate.update(query,obj,function (data){
            //console.log(data);
            $scope.editObjInAssembly = false;
        },function (error){
            console.log(error);
        });
    };

    $scope.deleteItemFromAssembly = function(obj){
        var r = confirm('Are you sure to delete Item: '+ obj.itemCode);
            if (r === true) {
                var query = {};
                query.companyId = firmaId;
                query.assemblyNumber = $scope.assemblyInfo.assemblyNumber;
                query.itemCode = obj.itemCode;
                console.log(query);
                shop.assemblyUpdate.update(query,obj,function (data){
                 $scope.collection.splice($scope.collection.indexOf(obj),1);
                },function (error){
                    console.log(error);
                });
            }
            else {
                return;
                }
                            
    };
    // assembly details logic - once you select an assembly

}])























.directive('assembliesListCard', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'app_components/assembliesView/assembliesListCard.html'    

  };
}])
.directive('assemblyTable', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'app_components/assembliesView/assemblyTable.html',
    link: function($scope) {
            $scope.order = function(predicate){
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            };
        }    

  };
}]);

}());