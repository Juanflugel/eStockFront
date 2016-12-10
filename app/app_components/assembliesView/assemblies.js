(function(){
  'use strict';
angular.module('assembliesModule',['services'])

.controller('assembliesCtrl',['$scope','shop','$location','$anchorScroll',function ($scope,shop,$location,$anchorScroll){
    
    var assemblyIndex = 0;
    
    $scope.header = {itemCode:'Item Code',neededAmount:'Amount',itemName:'Name'};  
    

    $scope.assembliesQuery = function(index){
        var query = {};
        query.companyId = $scope.firmaId;
        $scope.progressBardisable = false;
        shop.assembly.query(query,function (data){
                $scope.assemblies = data;
                $scope.assemblyInfo = $scope.assemblies[index] || $scope.assemblies[0];
                $scope.collectionA = $scope.assemblyInfo.assemblyItems;
                $scope.progressBardisable = true;
                // console.log(data.length);
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
        // console.log('From service');
        $scope.assembliesQuery();
    }
    $scope.$on("companyInfoAvailable",function(){ // to load filters and id without problems
        $scope.firmaId = shop.getCompanyId();
        $scope.assembliesQuery();
    });

    $scope.editAssembly = function(obj){ // open the form to update assembly info
        $scope.Objassembly = obj;
        $scope.Objassembly.subAssemblies = $scope.Objassembly.subAssemblies || [];
        $scope.editAssemblyInfo = true;
        $scope.gotoHash('top');
    };

    $scope.pushSubAssembly = function(subObj){
       $scope.Objassembly.subAssemblies.push(subObj);
       $scope.subObj = {};
    };
    

    $scope.updateAssemblyInfo = function(obj){ // update the info in the server
        $scope.progressBardisable = false;
        var idDocument = obj._id;
        obj.assemblyName = obj.assemblyName.toUpperCase();
        shop.assemblyUpdate.update({_id:idDocument},obj,function (data){
            console.log(data);
            $scope.editAssemblyInfo = false;
            $scope.progressBardisable = true;
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
                shop.assembly.remove(query,function (){
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

    $scope.showAssemblyItems = function(obj,index){ // show all the items that belong to an assembly
        assemblyIndex = index;
        $scope.assemblyInfo = obj;
        $scope.collectionA = obj.assemblyItems;
        $scope.gotoHash('top');
    };

    $scope.editObj = function(obj){ // edit a item inside an assembly
        $scope.obj = obj;
        $scope.insertObjInAssembly = false;
        $scope.editObjInAssembly = true;
        $scope.gotoHash('top');

    };
    $scope.newObj = function(){ // insert a  new Item in an assembly
        $scope.obj = {};
        $scope.editObjInAssembly = false;
        $scope.insertObjInAssembly = true;
        
    };

    $scope.updateItemInAssembly = function(obj){
        var query = {};
        query.companyId = $scope.firmaId;
        query.assemblyNumber = $scope.assemblyInfo.assemblyNumber;
        query['assemblyItems._id'] = obj._id;

        shop.assemblyUpdate.update(query,obj,function (){
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
                shop.assemblyUpdate.update(query,obj,function (){
                 $scope.collectionA.splice($scope.collectionA.indexOf(obj),1);
                },function (error){
                    console.log(error);
                });
            }
            else {
                return;
                }
                            
    };
    // assembly details logic - once you select an assembly



    $scope.refreshFilter = function(){ // filter for all intems to be inserted
        // collection here is setted in the headerSearch directive
        $scope.itemsToInsert =_.filter($scope.collection, function(obj){ return obj.insert === true; });
    };

    $scope.listOfitemsToInsertInAssembly = [];
    $scope.itemsToInsert = [];// to link with the directive

    $scope.insertItemInAssembly = function(){

        if($scope.itemsToInsert.length > 0){
            // just to show the query loading
            $scope.progressBardisable = false;
            // in case they have no property "item Assembled" is setted to false
            _.each($scope.itemsToInsert,function(obj){
                obj.itemAssembled = false;
            });
            $scope.listOfitemsToInsertInAssembly.push.apply($scope.listOfitemsToInsertInAssembly,$scope.itemsToInsert);
                        
            var updateQuery = {};
            updateQuery.companyId = $scope.companyId;
            updateQuery.assemblyNumber = $scope.assemblyInfo.assemblyNumber;
            shop.assemblyUpdate.update(updateQuery,$scope.listOfitemsToInsertInAssembly,function (){
                
                $scope.assembliesQuery(assemblyIndex);
                $scope.filterModel = {};
                $scope.itemsToInsert = [];
                $scope.itemsForAssembly = []; // just to clean de inserted items array
                $scope.search = ''; // just to clean the model when the insertion process ocurs
                $scope.collection = [];
                $scope.progressBardisable = true;
                $scope.insertObjInAssembly = false;

            },function (error){
                console.log(error);
            });
        }else{
            return;
        }
       
    };

    $scope.abortToInsertItemsInAssembly = function(){
        $scope.collection = [];
        $scope.search = '';
        $scope.insertObjInAssembly = false;
    };


    // assembly update logic - insert multiple items from stock

}])























.directive('assembliesListCard', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    //templateUrl: 'assembliesView/assembliesListCard.html'
    templateUrl: 'app_components/assembliesView/assembliesListCard.html'     

  };
}])
.directive('assemblyDetailsHeader', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    //templateUrl: 'assembliesView/assemblyDetailsHeader.html'
    templateUrl: 'app_components/assembliesView/assemblyDetailsHeader.html'     

  };
}])
.directive('assemblyTable', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'assembliesView/assemblyTable.html',
    //templateUrl: 'app_components/assembliesView/assemblyTable.html',
    link: function($scope) {
            $scope.order = function(predicate){
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            };
        }    

  };
}]);

}());