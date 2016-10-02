(function(){
	'use strict';
	angular.module('projectsAssemblyDetailModule',['services'])

	.controller('projectsAssemblyDetailCtrl',['$scope','handleProjects','shop',function ($scope,handleProjects,shop){
		
		
		$scope.header = {itemStatus:'Status',itemCode:'Item Code',neededAmount:'Amount',itemName:'Name'};
		$scope.currentProject = handleProjects.getCurrentProject(); 
		$scope.assemblies = $scope.currentProject.projectAssemblies; // assembly collection
		$scope.currentAssembly = handleProjects.getCurrentAssembly(); // the assembly Obj
		$scope.collection = $scope.currentAssembly.assemblyItems; // table to show items in assembly in a project

		$scope.seeAssembliesDetails = function(obj){
			handleProjects.passAssembly(obj);
			$scope.currentAssembly = obj;
			$scope.collection = $scope.currentAssembly.assemblyItems;
			console.log($scope.collection.length);
		};

		$scope.order = function(predicate){
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.passObjToEdit = function(obj){
        	$scope.obj = obj;
        	$scope.editObjInAssemblyProject = true;
        };

        $scope.updateItems = function(){
        	var query = {};
        	query._id = $scope.currentProject._id;
        	query['projectAssemblies._id'] = $scope.currentAssembly._id;
        	shop.pruebaUpdate.update(query,$scope.collection,function (){
        		console.log('items updated');
        	},function (error){
        		console.log(error);
        	});
        };

	}]);







}());