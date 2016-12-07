(function(){
	'use strict';
	angular.module('projectsAssemblyDetailModule',['services'])

	.controller('projectsAssemblyDetailCtrl',['$scope','handleProjects','shop','$location','$anchorScroll','$state',function ($scope,handleProjects,shop,$location,$anchorScroll,$state){
		
		$scope.firmaId = shop.getCompanyId();
		var aindex = 0;
		$scope.gotoHash = function(x) {
	      var newHash = x;
	      if ($location.hash() !== newHash) {
	        $location.hash(x);
	      } else {        
	        $anchorScroll();
	      }
	    };

	    $scope.addAmountFromStock = function(){
			var codesArray = handleProjects.getJustCode($scope.collection);
			var q = {}; //  prepare query to search in all open proyects
	        q.companyId = $scope.firmaId;
	        q.array = codesArray;
	        shop.items.query(q,function (data){
	            handleProjects.addAmountFromStock($scope.collection,data);
	        },function (error){
	            console.log(error);
	        });
		};

		$scope.populateViewFromServer = function(){
			var query = {};
			query.companyId = $scope.firmaId;
			query.projectNumber = $state.params.pId;
			shop.project.query(query, function (data){

				$scope.currentProject = data[0];
				$scope.assemblies = $scope.currentProject.projectAssemblies; // assembly collection
				aindex = $scope.assemblies.findIndex(function (x){ return x.assemblyNumber === $state.params.idAssembly;});
				$scope.currentAssembly = $scope.currentProject.projectAssemblies[aindex]; // the assembly Obj
				$scope.collection = $scope.currentAssembly.assemblyItems; // table to show items in assembly in a project				
				$scope.progressBarEditItem = true;
				$scope.addAmountFromStock();				
				handleProjects.passProject($scope.currentProject);

			},function (err){
				console.log(err);
			});
		};
		
		$scope.currentProject = handleProjects.getCurrentProject();
		$scope.progressBarEditItem = true;
		$scope.header = {itemStatus:'Status',itemCode:'Item Code',neededAmount:'Amount',stock:'Stock',itemName:'Name'};

		$scope.assemblies = $scope.currentProject.projectAssemblies; // assembly collection
		$scope.currentAssembly = handleProjects.getCurrentAssembly(); // the assembly Obj
		$scope.collection = $scope.currentAssembly.assemblyItems; // table to show items in assembly in a project
		$scope.addAmountFromStock();
		
		console.log('immer wieder');

		if($scope.firmaId && _.keys($scope.currentProject).length === 0){
			console.log('from service');
			$scope.populateViewFromServer(); // to call all projects
			
		}

		$scope.$on('companyInfoAvailable',function(){
			$scope.firmaId = shop.getCompanyId();
			console.log('from run nojoda');
			$scope.populateViewFromServer();
		});

		

		$scope.seeAssembliesDetails = function(obj){
			handleProjects.passAssembly(obj); // cule gallo
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
        	$scope.gotoHash('top');
        };

        $scope.updateItems = function(){
        	$scope.progressBarEditItem = false;
        	var query = {};
        	query._id = $scope.currentProject._id;
        	query['projectAssemblies._id'] = $scope.currentAssembly._id;
        	shop.pruebaUpdate.update(query,$scope.collection,function (){
        		console.log('items updated');
        		$scope.editObjInAssemblyProject = false;
        		$scope.progressBarEditItem = true;
        	},function (error){
        		console.log(error);
        	});
        };

        $scope.pullItemFromProject = function(item){

        	var r = confirm('Are you sure to delete the item: ' + item.itemCode);
				 	if(r===true){
				 		var index = $scope.collection.indexOf(item);				 		
				 		var query = {};
				 		query.companyId = $scope.firmaId;
				 		query.projectNumber = $scope.currentProject.projectNumber;
				 		query['projectAssemblies.assemblyNumber'] = $scope.currentAssembly.assemblyNumber;
				 		console.log(query,index);
				 		shop.itemsInProject.update(query,$scope.collection,function(){
				 			alert('Item '+ item.itemCode +' deleted from Project '+$scope.currentProject.projectNumber);
				 			$scope.collection.splice(index,1);
				 		},function (error){
				 			console.log(error)
				 		})
				 		
				 	}else{
				 		alert('click false');
				 	}


        };

	}]);







}());