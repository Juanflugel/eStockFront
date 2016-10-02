(function(){
  'use strict';
angular.module('companyEmployeesModule',[])

.controller('employeesCtrl',['$scope','shop',function ($scope,shop){
	
	$scope.companyId = shop.getCompanyId();
	var query = {};
	query.companyId = $scope.companyId;

	$scope.queryEmployees = function(){
		shop.users.query(query,function (data){
		$scope.employees = data;
		$scope.progressBarInsertemployeedisable = true;
		},function (error){
			console(error);
		});
	};

	$scope.queryEmployees();

	$scope.startNewEmployee = function(){
		$scope.obj = {};
		$scope.newUser = true;
	};

	$scope.createUser = function(obj){
		$scope.progressBarInsertemployeedisable = false;
		obj.companyId = $scope.companyId;
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
