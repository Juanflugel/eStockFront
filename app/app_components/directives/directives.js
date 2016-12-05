(function(){
  'use strict';
angular.module('DirectivesModule',[])

.directive('searchHeader',['shop','handleProjects',function (shop,handleProjects) {
	
	return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //templateUrl: 'app_components/directives/searchHeader.html', 
        templateUrl:'directives/searchHeader.html',  
        link: function($scope) {

            $scope.setFilters = function(){
                $scope.filterBy = shop.getCompanyFilters();// cargando los filtros de la Empresa
                $scope.providersList = $scope.filterBy[1].array;
                $scope.assembliesList = $scope.filterBy[3].array;
            };
            
            
            if ($scope.firmaId) { // to load filters and Id        
                $scope.setFilters(); 
            }

            $scope.$on("companyInfoAvailable",function(){ // to load filters and id without problems
                $scope.setFilters();        
            });


            $scope.querySearch = function(query){

                 shop.items.query(query,function (data){
                    $scope.collection = data; // show the results
                    if($scope.dashBoard === true){
                        var codesArray = handleProjects.getJustCode($scope.collection);
                        codesArray.push('0');
                        $scope.addInsertedAndPendingsAmounts(codesArray);
                    }  
                },function (error){
                    console.log(error);
                });

            };

            $scope.queryByFilter = function(){ // function to query by any registerd filter
		        var j = {};
		        j[$scope.filterModel.queryObjKey] = $scope.queryTag;
		        var query = j;
		        query.companyId = $scope.firmaId;
		        $scope.search = ''; // clean the other model
		        $scope.querySearch(query);
		    };

		    $scope.queryByCode = function(){ // funcion para poder buscar una pieza cualquiera por codigo desde el input principal
                var query = {};
                $scope.filterModel =''; // clean the other model
                $scope.queryTag = '';
                query.companyId = $scope.firmaId;
                query.string = $scope.search;                
                shop.itemsCodeOrName.query(query,function (data){

                    $scope.collection = data;

                    if($scope.dashBoard === true){
                        var codesArray = handleProjects.getJustCode($scope.collection);
                        codesArray.push('0');
                        $scope.addInsertedAndPendingsAmounts(codesArray);
                    }              
                    

	            },function (error){
	                console.log(error);
	            });         
        
    		};

        }
    };
}]);

}());