(function(){
  'use strict';
angular.module('settingsModule',[])

.controller('settingsCtrl',['$scope','shop',function ($scope,shop) {
	$scope.firmaId = 'RMB01';
	$scope.filterBy = shop.getCompanyFilters();// cargando los filtros de la Empresa
	$scope.assembliesList = $scope.filterBy[3].array; // lista de assemblies
	$scope.providersList = $scope.filterBy[1].array; // lista de proveedores

	var query = {itemType:'SCHRAUBE'};

	$scope.queryByFilter = function(){ // function to query by any registerd filter
		var j = {};
		j[$scope.filterModel.queryObjKey] = $scope.queryTag;
		query = j;
		query.companyId = $scope.firmaId;
		$scope.queryData();
	};	

	// Retrieve data from API the whole list without filter
	$scope.queryData = function (){
		shop.items.query(query,function (data){
			$scope.collection = data; // show the results
		},function (error){
			console.log(error);
		});
	};
	$scope.queryData();

	$scope.queryByCode = function(){ // funcion para poder buscar una pieza cualquiera por codigo desde el input principal
				query = {};
				query.companyId = $scope.firmaId;
				query.itemCode = $scope.search;
				shop.itemsCode.query(query,function (data){
					$scope.collection = data;
					// var codesArray = handleProjects.getJustCode($scope.collection);
					// codesArray.push('0');
					// $scope.insertedItems(codesArray);
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
	// table functionality

	// form Funtionality

	$scope.createObj = function(obj){
					obj.companyId = $scope.firmaId;
					shop.items.save(obj,function (data){
						$scope.obj = {};
						$scope.newItem = false;
						// console.log('objeto guardado plenamente');
					},function (error){
						console.log(error);
					});
	};	

	$scope.updateObj = function(obj){
					var idDocument = obj._id;
					shop.itemidUpdate.update({_id:idDocument},obj,function(data){
						 // console.log('res:',data);			 
						 $scope.editItem = false;			 	
						 }, function(error){
							alert('The item amount was not updated');
						 });
	};
	// form Funtionality

}])






































.directive('settingsViewHeader', [function (){
	// Runs during compile
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app_components/settingsView/settingsViewHeader.html'		

	};
}])
.directive('iForm', [function (){
	// Runs during compile
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app_components/settingsView/iForm.html'		

	};
}])
.directive('iTable', [function (){
	// Runs during compile
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app_components/settingsView/itable.html',		
		link: function($scope) {
			$scope.order = function(predicate){
				$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
				$scope.predicate = predicate;
			};
		}
	};
}]);
}());