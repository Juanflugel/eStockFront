(function(){
	'use strict';
	angular.module('projectsDetailsModule',['services'])
	.controller('ProjectDetailsCtrl',['$scope','shop','handleProjects',function ($scope,shop,handleProjects){



		// assemblies in projects logic


		$scope.callAssemblies = function(){
			var query = {};
			query.companyId = $scope.firmaId;
			shop.assembly.query(query,function (data){
				$scope.collection = data;
			},function (error){
				console.log(error);
			});
		};

		$scope.showAssemblies = function(){
			$scope.callAssemblies();
			$scope.insertNewAssembly = true;
		};

		$scope.header = {assemblyName:'Assembly Name',assemblyNumber:'Assembly Number',numberOfparts:'Parts'};
		$scope.refreshFilter = function(){
			$scope.assembliesToInsert =_.filter($scope.collection, function(obj){ return obj.insert === true; });
		};
		$scope.insertarAssemnliesInProject = function(){
			$scope.progressBarInsertAssemblydisable = false;
			var projectId = $scope.projectInfo._id;
			var assembliesCollection = $scope.assembliesToInsert;
				// console.log('aqui voy a llamar a la api para guardar esa monda');
				shop.projectUpdate.update({_id:projectId},assembliesCollection,function (){
					$scope.assembliesToInsert=[];
					$scope.callAssemblies();   
					var  indexOfProject = $scope.projects.indexOf($scope.projectInfo);      
					$scope.projectQuery(indexOfProject);
					$scope.insertNewAssembly = false;
					// $scope.progressBarInsertAssemblydisable = true;
				},function (error){
					console.log(error);
				});
			};

			$scope.passAssembly = function(obj){
				console.log(obj);
				handleProjects.passAssembly(obj);
				handleProjects.passProject($scope.projectInfo);
			};


			



  // assemblies in projects logic


}]);

}());