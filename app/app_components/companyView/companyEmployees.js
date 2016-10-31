(function(){
  'use strict';
angular.module('companyEmployeesModule',[])

.controller('employeesCtrl',['$scope','shop',function ($scope,shop){

	
	$scope.firmaId = shop.getCompanyId();
	var query = {};
	

	$scope.queryEmployees = function(){
		query.companyId = $scope.firmaId;
		shop.users.query(query,function (data){
		$scope.employees = data;
		$scope.progressBarInsertemployeedisable = true;
		},function (error){
			console.log(error);
		});
	};

	

	if($scope.firmaId){
		$scope.queryEmployees();
	}

	$scope.$on('companyInfoAvailable',function(){
			$scope.firmaId = shop.getCompanyId();
			//console.log('from run');
			$scope.queryEmployees();
	});

	$scope.startNewEmployee = function(){
		$scope.obj = {};
		$scope.newUser = true;
	};

	$scope.createUser = function(obj){
		$scope.progressBarInsertemployeedisable = false;
		obj.companyId = $scope.firmaId;
		shop.users.save(obj,function (data){
			console.log('nuevo user creado', data);
			$scope.newUser = false;
			$scope.progressBarInsertemployeedisable = true;
			$scope.queryEmployees();
		},function (error){
			console.log(error);
		});
	};

	$scope.editUserInfo = function(obj){
		$scope.obj = obj;
		$scope.editUser = true;
	};

	$scope.updateUser = function(obj){
		var query = {};
		query._id = obj._id;
		shop.usersUpdate.update(query,obj,function (data){
			console.log('todo bien perro',data);
			$scope.editUser = false;
		},function (error){
			alert(error);
		});
		
	};

	$scope.deleteUser = function(obj,index){

		var r = confirm('Are you sure to delete User: '+ obj.userRealName);
                    if (r === true) {
                    $scope.progressBarInsertemployeedisable = false;
                     shop.users.remove({_id:obj._id},function (data){
                        $scope.employees.splice(index,1);
                        alert('Item: '+ data.userRealName+' successfully deleted');
                        $scope.progressBarInsertemployeedisable = true;
                     });
                    } else {
                        return;
                    }

	};
	
}]);

}());
