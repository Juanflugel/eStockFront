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
                $scope.collection = $scope.assemblyInfo.assemblyItems;
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
        $scope.editAssemblyInfo = true;
        $scope.gotoHash('top');
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
        $scope.collection = obj.assemblyItems;
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

    $scope.insertItemInAssembly = function(obj){ // query to the api to insert a new item
        
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

    // assembly update logic - insert multiple items from stock
    $scope.filterModel = {};
    $scope.queryByCode = function(){ // funcion para poder buscar una pieza cualquiera por codigo desde el input principal
                var query = {};
                query.companyId = $scope.firmaId;
                query.string = $scope.search;
                shop.itemsCodeOrName.query(query,function (data){
                    $scope.itemsForAssembly = data;
                    
            },function (error){
                console.log(error);
            });         
        
    };
    
    $scope.loadFilter = function(){
        $scope.filterBy = shop.getCompanyFilters();// cargando los filtros de la Empresa
        $scope.assembliesList = $scope.filterBy[3].array; // lista de assemblies
        $scope.providersList = $scope.filterBy[1].array; // lista de proveedores
    };

    $scope.queryByFilter = function(){ // function to query by any registerd filter
        var j = {};
        j[$scope.filterModel.queryObjKey] = $scope.queryTag;
        var query = j;
        query.companyId = $scope.firmaId;
        shop.items.query(query,function (data){
            $scope.itemsForAssembly  = data; // show the results
        },function (error){
            console.log(error);
        });
    };

    $scope.refreshFilter = function(){ // filter for all intems to be inserted
        $scope.itemsToInsert =_.filter($scope.itemsForAssembly, function(obj){ return obj.insert === true; });
    };

    $scope.listOfitemsToInsertInAssembly = [];
    $scope.itemsToInsert = [];

    $scope.insertItemInAssembly = function(){
        if($scope.itemsToInsert.length > 0){
            $scope.progressBardisable = false;
            _.each($scope.itemsToInsert,function(obj){
                obj.itemAssembled = false;
            });
            $scope.listOfitemsToInsertInAssembly.push.apply($scope.listOfitemsToInsertInAssembly,$scope.itemsToInsert);
                        
            var updateQuery = {};
            updateQuery.companyId = $scope.companyId;
            updateQuery.assemblyNumber = $scope.assemblyInfo.assemblyNumber;
            shop.assemblyUpdate.update(updateQuery,$scope.listOfitemsToInsertInAssembly,function (){
                console.log('listo el pollo');
                //$scope.queryByFilter();
                $scope.assembliesQuery(assemblyIndex);
                $scope.filterModel = {};
                $scope.itemsToInsert = [];
                $scope.itemsForAssembly = []; // just to clean de inserted items array
                $scope.search = ''; // just to clean the model when the insertion process ocurs
                $scope.progressBardisable = true;
                $scope.insertObjInAssembly = false;
            },function (error){
                console.log(error);
            });
        }else{
            return;
        }
       
    };


    // assembly update logic - insert multiple items from stock

}])























.directive('assembliesListCard', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'assembliesView/assembliesListCard.html'
    // templateUrl: 'app_components/assembliesView/assembliesListCard.html'     

  };
}])
.directive('assemblyDetailsHeader', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'assembliesView/assemblyDetailsHeader.html'
    // templateUrl: 'app_components/assembliesView/assemblyDetailsHeader.html'     

  };
}])
.directive('assemblyTable', [function (){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'assembliesView/assemblyTable.html',
    // templateUrl: 'app_components/assembliesView/assemblyTable.html',
    link: function($scope) {
            $scope.order = function(predicate){
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            };
        }    

  };
}]);

}());