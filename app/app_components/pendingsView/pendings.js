(function(){
	'use strict';
	angular.module('pendingsModule',[])

	.controller('pendingsCtrl', ['$scope','shop','handleProjects',function ($scope,shop,handleProjects){
	// table set up
	$scope.header = {itemCode:'Item Code',itemAmount:'Stock',itemNeed:'Remain',itemType:'Type',itemName:'Name',itemBuyPrice:'Price',itemProvider:'Provider'};
	$scope.progressBardisable = true;
	$scope.newBuyOrder = false;
	$scope.firmaId = shop.getCompanyId();
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

	$scope.toDownload = [];

	$scope.queryPendings = function(){
		console.log($scope.firmaId);
		shop.prueba.query(query,function (data){
		
		$scope.collection = data;
		$scope.filterBy = shop.getCompanyFilters();
	    $scope.providers = $scope.filterBy[1].array;
		//console.log($scope.providers);

		var l = $scope.collection.length;		
		for (var i=0; i<l;i++){
			// Guarantiee that objects are ordered according CSV before download
			var obj = handleProjects.orderObjects($scope.collection[i]); 
			$scope.toDownload.push(obj);
		}

	},function (error){
		console.log(error);
	});
	};

	if($scope.firmaId){
			//console.log('from service');
			$scope.queryPendings(); // to call all projects
		}
	$scope.$on('companyInfoAvailable',function(){
			$scope.firmaId = shop.getCompanyId();
			//console.log('from run');
			$scope.queryPendings();
	});

	
	

	$scope.newOrder = function(){
		$scope.newBuyOrder = true;
		console.log($scope.newBuyOrder);

		shop.project.query(query,function (data){
			var projectsArrayNumber =[];
			_.each(data,function(obj){
				projectsArrayNumber.push(obj.projectNumber);
				$scope.items = projectsArrayNumber;
			});


		},function (error){
			console.log(error);
		});
	};

	// order creation

	$scope.filterItemsToOrder = function(){ // items to be bougth 
		$scope.itemsNewOrder = _.filter($scope.collection,function(obj){
			return obj.order === true;
		});

		// console.log($scope.itemsNewOrder);
	};

	// create New Order

	$scope.createNewOrder = function(obj){
		$scope.progressBardisable = false;
		obj.projectNumbers = $scope.selected ;
		obj.orderedItems = $scope.itemsNewOrder;
		obj.companyId = $scope.firmaId;
		obj.orderState = 'open';
		obj.orderStatus = 'Ordered';
		console.log(obj);
		shop.orders.save(obj,function (){
			$scope.selected = [];
			$scope.queryPendings();
			$scope.itemsNewOrder =[];
			$scope.progressBardisable = true;			
			$scope.newBuyOrder = false;
		},function (error){
			console.log(error);
		});
	};



	
	
    $scope.selected = [];

	 $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
          console.log($scope.selected);
        }
        else {
          list.push(item);
          console.log($scope.selected);
        }
      };

      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };

	}])









	.directive('pendingsViewHeader', [function (){
	// Runs during compile
		return {
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'pendingsView/pendingsViewHeader.html'
			// templateUrl: 'app_components/pendingsView/pendingsViewHeader.html'		

		};
	}])
	.directive('newOrderHeader', [function (){
	// Runs durng compile
		return {
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'pendingsView/newOrderHeader.html'
			// templateUrl: 'app_components/pendingsView/newOrderHeader.html'		

		};
	}])
	.directive('pendingsTable', [function (){
	// Runs during compile
		return {
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'pendingsView/pendingsTable.html',
			// templateUrl: 'app_components/pendingsView/pendingsTable.html',
			link: function($scope) {
				$scope.order = function(predicate){
					$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
					$scope.predicate = predicate;
				};
			}		

		};
	}]);
}());