(function(){
  'use strict';
angular.module('eStockFront',[
    // 'templates',
    'ui.router',
    'ngMaterial',
    'services',
    'menuModule',
    'settingsModule',
    'pendingsModule',
    'projectsModule',
    'assembliesModule'


    ])
.run(function (shop){

  var firmaId = "RMB01"

  shop.company.query({companyId:firmaId}, function (data){
        console.log('from run',data[0]);
        shop.passCompanyInfo(data[0]);
    });

})

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/app/Settings");
  // $urlRouterProvider.when('/app/Company','/app/Company/Employees');
  //
  // Now set up the states
  $stateProvider
   .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'app_components/menu/menu.html',
            controller:'menuCtrl'

        })

    .state('app.Settings', {
      url: "/Settings",
      templateUrl:"app_components/settingsView/settingsView.html",
      controller:'settingsCtrl'
    })
    .state('app.Pendings', {
      url: "/Pendings",
      templateUrl:"app_components/pendingsView/pendingsView.html",
      controller:'pendingsCtrl'
    })
    .state('app.Projects', {
      url: "/Projects",
      templateUrl:"app_components/projectsView/projectsView.html",
      controller:'projectsCtrl'

    })
    .state('app.Assemblies', {
      url: "/Assemblies",
      templateUrl:"app_components/assembliesView/assembliesView.html",
      controller:'assembliesCtrl'

    })

    
});
}());


    
	