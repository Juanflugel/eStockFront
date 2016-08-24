(function(){
  'use strict';
angular.module('projectsModule',['services'])

.controller('projectsCtrl',['$scope','shop',function ($scope,shop){

$scope.projectQuery = function(index){
	shop.project.query({},function (data){

	$scope.projects = data;
	$scope.projectInfo = $scope.projects[index]|| $scope.projects[0];
	$scope.projectsAssemblies = $scope.projectInfo.projectAssemblies;
	$scope.showProjectAssemblies($scope.projectInfo);

 	},function (error){});
};
$scope.projectQuery(); // to call all projects


$scope.showProjectAssemblies = function (project) {
  
  $scope.projectInfo = project;
  $scope.projectsAssemblies = $scope.projectInfo.projectAssemblies;

  _.each($scope.projectsAssemblies,function (obj) {
		// console.log(obj);
		var arrayItems = obj.assemblyItems;
		// console.log(arrayItems.length);      
		var noInserted = _.reject(arrayItems,function (objFromArray){ // to show porcentage done
				return objFromArray.itemAssembled === true;
		});
		obj.pendingToBeAssembled = noInserted.length;
		obj.completed = ((arrayItems.length-noInserted.length)/arrayItems.length)*100;

	});    
};

 $scope.createNewProject = function (obj){

	obj.projectState = 'open';
	obj.companyId = 'RMB01';
	shop.project.save(obj,function (data){
		console.log(data);
		$scope.startNewProject = false; // ng-show
		$scope.projects.push(data);
	});

 };
 $scope.editProjectObj = function(obj){
 	console.log(obj);
 	$scope.obj = obj;
 	$scope.startNewProject = false;
 	$scope.editProject = true;
 };

 // change name, number, type or dead line from a project
	$scope.updateProject = function(obj){
		var idDocument = obj._id;
		obj.projectNumber = obj.projectNumber.toUpperCase();
		shop.projectUpdate.update({_id:idDocument},obj,function (data){
			console.log(data);
			$scope.editProject = false;
		});
	}

 // assemblies in projects logic
  shop.assembly.query(function (data){
	$scope.collection = data;
	},function (error){
		console.log(error);
	}
  );
	$scope.header = {assemblyName:'Assembly Name',assemblyNumber:'Assembly Number',numberOfparts:'Parts'};
	$scope.refreshFilter = function(){
	$scope.assembliesToInsert =_.filter($scope.collection, function(obj){ return obj.insert == true; });
	};
	$scope.insertarAssemnliesInProject = function(){
		 
		var projectId = $scope.projectInfo._id;
		var assembliesCollection = $scope.assembliesToInsert;
		// console.log('aqui voy a llamar a la api para guardar esa monda');
		shop.projectUpdate.update({_id:projectId},assembliesCollection,function (data){
		var  indexOfProject = $scope.projects.indexOf($scope.projectInfo);		
		$scope.projectQuery(indexOfProject);
		$scope.insertNewAssembly=false;
		},function (error){
			console.log(error);
		});
	};




  // assemblies in projects logic

 

 

}])








.directive('projectListCard', [function (){
  // Runs during compile
  return {
	restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
	templateUrl: 'app_components/projectsView/projectListCard.html'    

  };
}]);

}());