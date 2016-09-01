(function(){
  'use strict';
angular.module('assembliesModule',['services'])

.controller('assembliesCtrl',['$scope','shop','$location','$anchorScroll',function ($scope,shop,$location,$anchorScroll){
    
    
    $scope.header = {itemCode:'Item Code',neededAmount:'Amount',itemName:'Name'};  
    

    $scope.assembliesQuery = function(){
        var query ={};
        query.companyId = $scope.firmaId;
        $scope.progressBardisable = false;
        shop.assembly.query(query,function (data){
                $scope.assemblies = data;
                $scope.assemblyInfo = $scope.assemblies[0];
                $scope.collection = $scope.assemblyInfo.assemblyItems;
                $scope.progressBardisable = true;
                console.log(data.length);
            },function (error){
                console.log(error);
            });

    };

    $scope.gotoHash = function(x) {
      var newHash = x;
      if ($location.hash() !== newHash) {
        $location.hash(x);
      } else {
        
        $anchorScroll();
      }
    };
    
    $scope.firmaId = shop.getCompanyId();

    if($scope.firmaId){
        console.log('From service');
        $scope.assembliesQuery();
    }
    $scope.$on("companyInfoAvailable",function(){ // to load filters and id without problems
        $scope.firmaId = shop.getCompanyId();
        $scope.assembliesQuery();
    });

    $scope.editAssembly = function(obj){ // open the form to update assembly info
        $scope.Objassembly = obj;
        $scope.editAssemblyInfo = true;
        $scope.gotoHash('assemblyForm');
        
    };
    $scope.closeForm = function(){
        $location.hash('top');
        $anchorScroll('top');
    };

    $scope.updateAssemblyInfo = function(obj){ // update the info in the server
        var idDocument = obj._id;
        obj.assemblyName = obj.assemblyName.toUpperCase();
        shop.assemblyUpdate.update({_id:idDocument},obj,function (data){
            console.log(data);
            $scope.editAssemblyInfo = false;
        },function (error){
            alert(error);
        });
    };

    $scope.createAssembly = function(obj){
        obj.companyId = $scope.firmaId;
        shop.assembly.save(obj,function (data){
        console.log(data);
        $scope.startNewAssembly = false; // ng-show
        $scope.assembliesQuery();
        });
    };

    $scope.deleteAssembly = function(obj){

        var r = confirm('Are you sure to delete Assembly: '+ obj.assemblyName);
            if (r === true) {
                var query = {};
                query.companyId = $scope.firmaId;
                query._id = obj._id;
                console.log(query);
                shop.assembly.remove(query,function (data){
                 $scope.assembliesQuery();
                },function (error){
                    console.log(error);
                });
            }
            else {
                return;
                }

    };


    // assembly details logic - once you select an assembly

    $scope.showAssemblyItems = function(obj){ // show all the items that belong to an assembly
        $scope.assemblyInfo = obj;
        $scope.collection = obj.assemblyItems;
        $scope.gotoHash('assemblyForm');
    };

    $scope.editObj = function(obj){ // edit a item inside an assembly
        $scope.obj = obj;
        $scope.insertObjInAssembly = false;
        $scope.editObjInAssembly = true;
        $scope.gotoHash('assemblyForm');

    };
    $scope.newObj = function(){ // insert a  new Item in an assembly
        $scope.obj = {};
        $scope.editObjInAssembly = false;
        $scope.insertObjInAssembly = true;
    };

    $scope.insertItemInAssembly = function(obj){ // query to the api to insert a new item
        console.log(obj);
        var query = {};
        query.companyId = $scope.firmaId;
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
        query.companyId = $scope.firmaId;
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
                query.companyId = $scope.firmaId;
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
    // templateUrl: 'assembliesView/assembliesListCard.html'
    templateUrl: 'app_components/assembliesView/assembliesListCard.html'     

  };
}])
.directive('assemblyDetailsHeader', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    // templateUrl: 'assembliesView/assembliesListCard.html'
    templateUrl: 'app_components/assembliesView/assemblyDetailsHeader.html'     

  };
}])
.directive('assemblyTable', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    // templateUrl: 'assembliesView/assemblyTable.html',
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