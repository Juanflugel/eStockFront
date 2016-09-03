(function(){
	'use strict';
	angular.module('projectsModule',['services'])

	.controller('projectsCtrl',['$scope','shop','$location','$anchorScroll',function ($scope,shop,$location,$anchorScroll){

		$scope.firmaId = shop.getCompanyId();

		$scope.progressBarInsertAssemblydisable = true;

		$scope.projectQuery = function(index,state){
			$scope.progressBardisable = false;
			var query = {};
			query.companyId = $scope.firmaId;
			query.projectState = state || 'open';
			shop.project.query(query,function (data){

				$scope.projects = data;
				$scope.projectInfo = $scope.projects[index]|| $scope.projects[0] || {projectName:'No Open Projects'};
				$scope.projectsAssemblies = $scope.projectInfo.projectAssemblies ||[];
				$scope.showProjectAssemblies($scope.projectInfo);
				$scope.progressBardisable = true;
				$scope.progressBarInsertAssemblydisable = true;

			},function (error){
				console.log(error);
			});
		};


		if($scope.firmaId){
			// console.log('from service');
			$scope.projectQuery(); // to call all projects
		}
		$scope.$on('companyInfoAvailable',function(){
			$scope.firmaId = shop.getCompanyId();
			// console.log('from run');
			$scope.projectQuery();
		});

		$scope.gotoHash = function(x) {
	      var newHash = x;
	      if ($location.hash() !== newHash) {
	        $location.hash(x);
	      } else {	        
	        $anchorScroll();
	      }
    	};

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
			$scope.progressBardisable = false;
			obj.projectState = 'open';
			obj.companyId = 'RMB01';
			shop.project.save(obj,function (data){
				console.log(data);
				$scope.startNewProject = false; // ng-show
				$scope.projects.push(data);
				$scope.progressBardisable = true;
		 		$scope.obj = {};
			});

		};

		$scope.editProjectObj = function(obj){
			console.log(obj);
			$scope.obj = obj;
			$scope.startNewProject = false;
			$scope.editProject = true;
			$scope.gotoHash('top');
		};

		 // change name, number, type or dead line from a project
		 $scope.updateProject = function(obj){
		 	$scope.progressBardisable = false;
		 	var idDocument = obj._id;
		 	obj.projectNumber = obj.projectNumber.toUpperCase();
		 	shop.projectUpdate.update({_id:idDocument},obj,function (data){
		 		console.log(data);
		 		$scope.editProject = false;
		 		$scope.progressBardisable = true;
		 		$scope.obj = {};
		 	});
		 };

		 $scope.closeProject = function(obj){
		 	var idDocument = obj._id;
		 	obj.projectState = 'closed';
		 	shop.projectUpdate.update({_id:idDocument},obj,function (data){
		 		console.log(data);
		 		$scope.projectQuery();
		 		$scope.editProject = false;
		 	});
		 };

		$scope.deleteProjects = function(obj){
			var r = confirm('Are you sure to delete Item: '+ obj.projectName);
			if(r===true){
				shop.project.remove({_id:obj._id},function (){
			 		console.log('borrado');
			 		$scope.projectQuery();
			 		},function (error){
			 		console.log(error);
		 		});
			}else{
				return;
			}
		 	
		};

		 





}])








.directive('projectListCard', [function (){
  // Runs during compile
  return {
	restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
	templateUrl: 'projectsView/projectListCard.html'
	// templateUrl: 'app_components/projectsView/projectListCard.html'    

};
}])
.directive('projectDetails', [function (){
  // Runs during compile
  return {
	restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
	templateUrl: 'projectsView/projectListCard.html'
	// templateUrl: 'app_components/projectsView/projectDetails.html'    

};
}]);

}());