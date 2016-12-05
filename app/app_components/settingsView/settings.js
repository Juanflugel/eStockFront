(function(){
  'use strict';
angular.module('settingsModule',[])

.controller('settingsCtrl',['$scope','shop','handleProjects','$location','$anchorScroll',function ($scope,shop,handleProjects,$location,$anchorScroll) {
    
    $scope.dashBoard = true; //just to know if the order directives should use the insert funtions
    $scope.gotoHash = function(x) {
      var newHash = x;
      if ($location.hash() !== newHash) {
        $location.hash(x);
      } else {        
        $anchorScroll();
      }
    };

    $scope.createAssembly = false;

    var query = {itemType:'SCHRAUBE'};

    $scope.loadFilter = function(){
        $scope.firmaId = shop.getCompanyId();
    };

    $scope.queryData = function (query){
        shop.items.query(query,function (data){
            console.log(query);
            $scope.collection = data; // show the results
            
            var codesArray = handleProjects.getJustCode($scope.collection);
            codesArray.push('0');
            $scope.addInsertedAndPendingsAmounts(codesArray); 
        },function (error){
            console.log(error);
        });
    };
    // Retrieve data from API the whole list without filter
        
    $scope.refresh = function(){
        $scope.loadFilter();
        query.companyId = $scope.firmaId;
        $scope.queryData(query);
    };

    $scope.firmaId = shop.getCompanyId();

    if ($scope.firmaId) { // to load filters and Id
        
        $scope.refresh();
    }

    $scope.$on("companyInfoAvailable",function(){ // to load filters and id without problems
        $scope.refresh();        
    });

    $scope.addInsertedAndPendingsAmounts = function(codesArray){ // call all items inserted and the ones need to be assembled in open projects
        var q = {}; //  prepare query to search in all open proyects
        q.companyId = $scope.firmaId;
        q.projectState = 'open';
        q.codesArray = codesArray;
        shop.totalInsertedAndPending.query(q,function (data){
            handleProjects.addResumeInsertedAndPending($scope.collection,data);
        },function (error){
            console.log(error);
        });
    };   

    // table functionality

    $scope.header = {itemCode:'Item Code',itemAmount:'Stock',neto:'Neto',insertedAmount:'Assembled',totalPendingAmount:'Pending',itemType:'Type',itemName:'Name'};
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
                $scope.gotoHash('top');
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
                $scope.gotoHash('top');
                
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

        },function (error){
            console.log(error);
        });
    };  

    $scope.updateObj = function(obj){
        var idDocument = obj._id;
        shop.itemidUpdate.update({_id:idDocument},obj,function (){           
            $scope.editItem = false;               
            },function (error){
            alert('The item amount was not updated:'+ error);
        });
    };

    $scope.newitem = function(){
        $scope.obj = {};
        $scope.createAssembly = false;
        $scope.editItem = false;
        $scope.justInfo = false;
        $scope.viewItem = false;
        $scope.newItem = true;
        console.log($scope.obj);
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

    $scope.refreshFilter = function(){ // filter for all intems to be inserted
        $scope.itemsToInsert =_.filter($scope.collection, function(obj){ return obj.insert === true; });
    };

    $scope.insertItemInAssembly = function(){
        if($scope.itemsToInsert.length > 0){
            _.each($scope.itemsToInsert,function(obj){
                obj.itemAssembled = false;
            });
            $scope.itemsNewAssembly.push.apply($scope.itemsNewAssembly,$scope.itemsToInsert);
            $scope.refresh();
            $scope.itemsToInsert =[];
        }else{
            return;
        }
       
    };

    $scope.createNewAssembly = function(){ // funcion para crear nuevo emsamble desde la vista configraciones
        var obj = {};
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
        //templateUrl: 'app_components/settingsView/settingsViewHeader.html'      
        templateUrl: 'settingsView/settingsViewHeader.html'
    };
}])
.directive('iForm', [function (){
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        // templateUrl: 'app_components/settingsView/iForm.html'
        templateUrl:'settingsView/iForm.html',
         link: function() {
           
        }    

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
        //templateUrl: 'app_components/settingsView/itable.html', 
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