(function(){
	'use strict';
	angular.module('projectsAssemblyDetailModule',['services'])

	.controller('projectsAssemblyDetailCtrl',['$scope','handleProjects',function ($scope,handleProjects){
		
		$scope.currentProject = handleProjects.getCurrentProject();
		$scope.assemblies = $scope.currentProject.projectAssemblies;
		$scope.currentAssembly = handleProjects.getCurrentAssembly();
		$scope.collection = $scope.currentAssembly.assemblyItems;
		$scope.seeAssembliesDetails = function(obj){
			handleProjects.passAssembly(obj);
			$scope.currentAssembly = obj;
			$scope.collection = $scope.currentAssembly.assemblyItems;
		};

	}]);







}());