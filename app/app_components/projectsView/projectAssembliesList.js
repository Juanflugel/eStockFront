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
		//console.log($state);
		$scope.showAssemblies = function(){
			$scope.callAssemblies();
			$scope.insertNewAssembly = true;
		};

		$scope.header = {assemblyName:'Assembly Name',assemblyNumber:'Assembly Number',numberOfparts:'Parts'};
		$scope.headerForCsv = {itemCode:'Item Code',itemName:'Item Name',itemAmount:'Amount'};
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
					$scope.progressBarInsertAssemblydisable = true;
				},function (error){
					console.log(error);
				});
			};

			$scope.passAssembly = function(obj){
				// console.log(obj);
				handleProjects.passAssembly(obj);
				handleProjects.passProject($scope.projectInfo);
			};

			$scope.deleteAssemblyFromProject = function(obj){

				
				var filterItemsToAddBack =  _.filter(obj.assemblyItems,function (item){
					return item.itemAssembled === true;
				});

				var itemsToAddBack =  handleProjects.resumeCodeAndAmount(filterItemsToAddBack);

				console.log(itemsToAddBack);
				var r = confirm('Are you sure to delete Assembly: '+ obj.assemblyName);
				 	if(r===true){
				 		var query = {};
				 		query.companyId = $scope.firmaId;
				 		query.projectNumber = $scope.projectInfo.projectNumber;
				 		query['projectAssemblies._id'] = obj._id;
				 		shop.projectUpdate.update(query,{},function (data){
				 			console.log(data);
				 			var query1 = {};
				 				query.companyId = $scope.firmaId;
				 			shop.itemIncrement.update(query1,itemsToAddBack,function (){
				 				alert('items amount restored');
				 				$scope.projectQuery($scope.pindex,'open');
				 			},function (error){
				 				console.log(error);
				 			});
				 			
				 		},function (error){
				 			console.log(error);
				 		});
				 	}else{
				 		return;
				 	}
				
			};


			



  // assemblies in projects logic


}])

.directive('inputTag', [function (){
    // Runs during compile
    return {
        
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'app_components/projectsView/input.html',
        
        link: function($scope, iElm, iAttrs, controller) {

            var inputFile = angular.element('#i-input');

                inputFile.bind("change", function(e){
                  
                    $scope.file = (e.srcElement || e.target).files[0];
                    Papa.parse($scope.file,{
                            header:true,
                            complete:function(result){                                    
                                    $scope.prueba = result.data;
                                    var l = $scope.prueba.length;
                                    $scope.prueba.splice((l-1),1);
                                    $scope.collection = $scope.prueba;
                                    $scope.$apply();           
                            }
                    });
                });

                $scope.click = function(){
                        console.log('click desde directiva');
                        inputFile.trigger('click');
                }
        }
            
        
    }
}]);

}());