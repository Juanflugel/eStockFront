(function(){
  'use strict';
angular.module('eStockFront',[
    'ngSanitize',
    'ngCsv',
    'templates',
    'ui.router',
    'ngMaterial',
    'services',
    'auxiliarFunctions',
    'menuModule',
    'settingsModule',
    'pendingsModule',
    'ordersModule',
    'projectsModule',
    'projectsAssemblyDetailModule',
    'projectsDetailsModule',
    'assembliesModule',
    'companyModule',
    'companyEmployeesModule',
    'companyFiltersModule',
    'DirectivesModule'


    ])
.run(['shop','$rootScope',function (shop,$rootScope){


  var firmaId = "RMB01";

  shop.company.query({companyId:firmaId}, function (data){
        console.log('from run',data[0]);
        shop.passCompanyInfo(data[0]);
        $rootScope.$broadcast("companyInfoAvailable");
    });

}])

.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/app/Settings");
  $urlRouterProvider.when('/app/Projects','/app/Projects/Details');
  $urlRouterProvider.when('/app/Company','app/Company/Employees');
  //
  // Now set up the states
  $stateProvider
   .state('app', {
            abstract: true,
            url: '/app',
            //templateUrl: 'app_components/menu/menu.html',
            templateUrl: 'menu/menu.html',
            controller:'menuCtrl'

        })

    .state('app.Settings', {
      url: "/Settings",
      //templateUrl:"app_components/settingsView/settingsView.html",
      templateUrl:"settingsView/settingsView.html",
      controller:'settingsCtrl'
    })
    .state('app.Pendings', {
      url: "/Pendings",
      //templateUrl:"app_components/pendingsView/pendingsView.html",
      templateUrl:"pendingsView/pendingsView.html",
      controller:'pendingsCtrl'
    })
    .state('app.Orders', {
      url: "/Orders",
      templateUrl:"ordersView/ordersView.html",
      //templateUrl:"app_components/ordersView/ordersView.html",
      controller:'ordersCtrl'
    })
    .state('app.Projects', {
      url: "/Projects",
      //templateUrl:"app_components/projectsView/projectsView.html",
      templateUrl:"projectsView/projectsView.html",
      controller:'projectsCtrl'

    })
    .state('app.Projects.Details', {
      url: "/:id",
      //templateUrl:"app_components/projectsView/projectDetails.html",
      templateUrl:"projectsView/projectDetails.html",
      controller:'ProjectDetailsCtrl'

    })
   .state('app.assemblyDetails', {
      url: "/Projects/:pId/:idAssembly",
      templateUrl:"app_components/projectsView/projectAssembliesDetails.html",
      //templateUrl:"projectsView/projectAssembliesDetails.html",
      controller:'projectsAssemblyDetailCtrl'

    })

    .state('app.Assemblies', {
      url: "/Assemblies",
      //templateUrl:"app_components/assembliesView/assembliesView.html",
      templateUrl:"assembliesView/assembliesView.html",
      controller:'assembliesCtrl'

    })
    .state('app.LogIn', {
      url: "/LogIn",
      templateUrl:"logIn/logIn.html"
     
      // controller:'assembliesCtrl'

    })
    .state('app.Company', {
      url: "/Company",
      // templateUrl:"app_components/companyView/companyView.html",
      templateUrl:"companyView/companyView.html",     
      controller:'companyCtrl'

    })
    .state('app.Company.Employees', {
      url: "/Employees",
      // templateUrl:"app_components/companyView/employees.html",
      templateUrl:"companyView/employees.html",     
      controller:'employeesCtrl'

    })
    .state('app.Company.Filters', {
      url: "/Filters",
      // templateUrl:"app_components/companyView/companyFilters.html",
       templateUrl:"companyView/companyFilters.html",
      controller:'filterCtrl'

    });

    
}])
.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue === undefined) {inputValue = '';}
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        };
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });
}());


    
	