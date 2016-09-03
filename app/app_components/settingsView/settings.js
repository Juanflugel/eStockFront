(function(){
  'use strict';
angular.module('settingsModule',[])

.controller('settingsCtrl',['$scope','shop','handleProjects',function ($scope,shop,handleProjects) {
    $scope.createAssembly = false;
    var query = {itemType:'SCHRAUBE'};

    $scope.loadFilter = function(){
        $scope.firmaId = shop.getCompanyId();
        $scope.filterBy = shop.getCompanyFilters();// cargando los filtros de la Empresa
        $scope.assembliesList = $scope.filterBy[3].array; // lista de assemblies
        $scope.providersList = $scope.filterBy[1].array; // lista de proveedores
    };
    // Retrieve data from API the whole list without filter
    $scope.queryData = function (){
        shop.items.query(query,function (data){
            // console.log(query);
            $scope.collection = data; // show the results
            var codesArray = handleProjects.getJustCode($scope.collection); // to consult all inserted items
            codesArray.push('0');
            $scope.insertedItems(codesArray);
        },function (error){
            console.log(error);
        });
    };
    
    $scope.refresh = function(){
        $scope.loadFilter();
        query.companyId = $scope.firmaId;
        $scope.queryData();
    };

    $scope.firmaId = shop.getCompanyId();
    if ($scope.firmaId) { // to load filters and Id
        // console.log('from service');
        $scope.refresh();
    }

    $scope.$on("companyInfoAvailable",function(){ // to load filters and id without problems
        // console.log('pinki winki');
        $scope.refresh();
        
    });

        

    $scope.queryByFilter = function(){ // function to query by any registerd filter
        var j = {};
        j[$scope.filterModel.queryObjKey] = $scope.queryTag;
        query = j;
        query.companyId = $scope.firmaId;
        $scope.queryData();
    };

    $scope.queryByCode = function(){ // funcion para poder buscar una pieza cualquiera por codigo desde el input principal
                query = {};
                query.companyId = $scope.firmaId;
                query.itemCode = $scope.search;
                shop.itemsCode.query(query,function (data){
                    $scope.collection = data;
                    var codesArray = handleProjects.getJustCode($scope.collection);
                    codesArray.push('0');
                    $scope.insertedItems(codesArray);
            },function (error){
                console.log(error);
            });         
        
    };
    $scope.insertedItems = function(codesArray){
        var q = {}; //  prepare query to search i all open proyects
        q.companyId = $scope.firmaId;
        q.projectState = 'open';
        q.codesArray = codesArray;
        shop.itemsInserted.query(q,function (data){
            handleProjects.addInsertedAmount($scope.collection,data);
            // console.log('todo bien');

        },function (error){
            console.log(error);
        });
    };

    // table functionality

    $scope.header = {itemCode:'Item Code',itemAmount:'Stock',insertedAmount:'Assembled' ,itemType:'Type',itemName:'Name',itemBuyPrice:'Price'};
            // order by header Item
    
            // edit a Object displayed on the table
    $scope.editObj = function(item){
                item.itemLastDate = new Date(item.itemLastDate); // string to Date obj      
                $scope.obj = item;
                $scope.createAssembly = false;
                $scope.newItem = false;
                $scope.viewItem = false;
                $scope.justInfo = false;
                $scope.editItem = true;
            };
            // just display the Object Information
    $scope.readObj = function(item){
                item.itemLastDate = new Date(item.itemLastDate);// string to Date obj
                $scope.obj = item;
                $scope.createAssembly = false;
                $scope.newItem = false;
                $scope.editItem = false;
                $scope.justInfo = true;
                $scope.viewItem = true;
                
            };

    $scope.deleteObj = function(item,index){

                var r = confirm('Are you sure to delete Item: '+ item.itemName);
                    if (r === true) {
                     shop.items.remove({_id:item._id},function (data){
                        $scope.collection.splice(index,1);
                        alert('Item: '+ data.itemName+' successfully deleted');
                        $scope.refresh();
                     });
                    } else {
                        return;
                    }

            };

    $scope.createObj = function(obj){
                    obj.companyId = $scope.firmaId;
                    shop.items.save(obj,function (data){
                        if(data){
                            $scope.obj = {};
                        $scope.newItem = false;
                        }
                        
                        // console.log('objeto guardado plenamente');
                    },function (error){
                        console.log(error);
                    });
    };  

    $scope.updateObj = function(obj){
                    var idDocument = obj._id;
                    shop.itemidUpdate.update({_id:idDocument},obj,function (){           
                         $scope.editItem = false;               
                         }, function (error){
                            alert('The item amount was not updated:'+error);
                         });
    };
    // table functionality

    // assembly functionality 

    $scope.newAssembly = function(){
        $scope.createAssembly = true;
        $scope.newItem = false;
        $scope.viewItem = false;
        $scope.justInfo = false;
        $scope.editItem = false;
    };

    $scope.itemsNewAssembly = [];

    $scope.refreshFilter = function(){
    $scope.itemsToInsert =_.filter($scope.collection, function(obj){ return obj.insert === true; });
    };

    $scope.insertItemInAssembly = function(){
        $scope.itemsNewAssembly.push.apply($scope.itemsNewAssembly,$scope.itemsToInsert);
    };

    $scope.createNewAssembly = function(){ // funcion para crear nuevo emsamble desde la vista configraciones
        var obj= {};
        obj.assemblyName = $scope.assembly.projectName;
        obj.assemblyNumber = $scope.assembly.projectNumber;
        obj.assemblyItems = $scope.itemsNewAssembly;
        obj.companyId = $scope.firmaId;

        if(obj.assemblyName){

            shop.assembly.save(obj,function (data){
                console.log('todo bien primo se creo esa monda'+ data);
            },function (err){
                alert('error'+ err);
            });

            $scope.createAssembly = false;

        }   
    };

}])































.directive('newAssemblyHeader', [function (){
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment    
        // templateUrl: 'app_components/settingsView/newAssemblyHeader.html'
        templateUrl: 'settingsView/newAssemblyHeader.html'
    };
}])
.directive('settingsViewHeader', [function (){
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        // templateUrl: 'app_components/settingsView/settingsViewHeader.html'      
        templateUrl: 'settingsView/settingsViewHeader.html'
    };
}])
.directive('iForm', [function (){
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        // templateUrl: 'app_components/settingsView/iForm.html'
        templateUrl:'settingsView/iForm.html'    

    };
}])
.directive('contenteditable', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                // view -> model
                elm.bind('blur', function() {
                    scope.$apply(function() {
                        ctrl.$setViewValue(elm.html());
                    });
                });

                // model -> view
                ctrl.$render = function() {
                    elm.html(ctrl.$viewValue);
                };

                // load init value from DOM
                //ctrl.$setViewValue(elm.html());
            }
        };
    })
.directive('iTable', [function (){
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        // templateUrl: 'app_components/settingsView/itable.html', 
        templateUrl:'settingsView/itable.html',  
        link: function($scope) {
            $scope.order = function(predicate){
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            };
        }
    };
}]);
}());