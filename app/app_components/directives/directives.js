(function(){
  'use strict';
angular.module('DirectivesModule',[])

.directive('searchHeader',['shop','handleProjects',function (shop,handleProjects) {
	
	return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'app_components/directives/searchHeader.html', 
        //templateUrl:'settingsView/itable.html',  
        link: function($scope) {

            $scope.filterBy = shop.getCompanyFilters();// cargando los filtros de la Empresa

            $scope.queryByFilter = function(){ // function to query by any registerd filter
		        var j = {};
		        j[$scope.filterModel.queryObjKey] = $scope.queryTag;
		        var query = j;
		        query.companyId = $scope.firmaId;
		        $scope.search = ''; // clean the other model
		        $scope.queryData(query);
		    };

		    $scope.queryByCode = function(){ // funcion para poder buscar una pieza cualquiera por codigo desde el input principal
                var query = {};
                $scope.filterModel =''; // clean the other model
                $scope.queryTag = '';
                query.companyId = $scope.firmaId;
                query.string = $scope.search;                
                shop.itemsCodeOrName.query(query,function (data){
                    console.log(query);
                    $scope.collection = data;
                    var codesArray = handleProjects.getJustCode($scope.collection);
                    codesArray.push('0');
                    $scope.addInsertedAndPendingsAmounts(codesArray);
                    

	            },function (error){
	                console.log(error);
	            });         
        
    		};

        }
    };
}]);

}());