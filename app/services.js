(function(){
  'use strict';
/**
*  Module
*
* Description
*/
angular.module('services', ['ngResource'])



.factory('$loStorage', function(){

	var store = { todos:[], vacios:[],

		cleanLS: function(){
			window.localStorage.clear();
		},
		setObject: function (key,Object) {
			window.localStorage.setItem (key,angular.toJson (Object));
		},
		getObject: function (key) {
			return JSON.parse(window.localStorage.getItem(key));	
		},
		removeObject: function(key){
			window.localStorage.removeItem(key);
		}
	};
    
	return store;
})

.factory('Config', function () {
  return {
      version : '0.0.1',
      ip: 'www.estock.website', // localhost www.estock.website
      port: 5006,
      protocol: 'http'
  };
})

.factory('shop',['$resource', 'Config', function ContenidoFactory($resource, Config){
    var totalCompanyInfo = {};
    var companyEmployees = [];
    var companyProviders = [];
    var companyFilters = [];
    var companyId ;
  return {
    
    // request to the API
    csv : $resource('http://' + Config.ip + ':' + Config.port + '/csv'),
    prueba : $resource('http://' + Config.ip + ':' + Config.port + '/handleProjects'),
    pruebaUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/handleProjects',{},{ update: {method: 'PUT'}}),
    list : $resource('http://' + Config.ip + ':' + Config.port + '/items'),
    items: $resource('http://' + Config.ip + ':' + Config.port + '/items',{}),
    itemsInserted: $resource('http://' + Config.ip + ':' + Config.port + '/insertedItems',{}),
    itemsCode: $resource('http://' + Config.ip + ':' + Config.port + '/itemsCode',{}),// con regular expresions
    itemidUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/items',{},{ update: {method: 'PUT'}}),
    project:$resource('http://' + Config.ip + ':' + Config.port + '/projects',{}),
    projectRequiredAmounts:$resource('http://' + Config.ip + ':' + Config.port + '/requiredAmounts',{}),
    projectGeneralView:$resource('http://' + Config.ip + ':' + Config.port + '/projectGeneralView',{}),
    projectUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/projects',{},{ update: {method: 'PUT'}}),
    assembly:$resource('http://' + Config.ip + ':' + Config.port + '/assemblies',{}),
    assemblyUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/assemblies',{},{ update: {method: 'PUT'}}),
    company: $resource('http://' + Config.ip + ':' + Config.port + '/company',{}),
    companyInfoUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/company',{},{ update: {method: 'PUT'}}),
    companyFiltersUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/companyFilters',{},{ update: {method: 'PUT'}}),
    users:$resource('http://' + Config.ip + ':' + Config.port + '/users',{}),
    usersUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/users',{},{ update: {method: 'PUT'}}),
    // request to the API
    // company Information
    passCompanyInfo: function(objCompany){
      totalCompanyInfo = objCompany;
      companyFilters = totalCompanyInfo.companyItemFilters;
      companyProviders = totalCompanyInfo.companyProviders;
      companyEmployees = totalCompanyInfo.companyUsers;
      companyId = totalCompanyInfo.companyId;
    },
    getCompanyId:function(){
      return companyId;
    },
    getCompanyProviders:function(){
      return companyProviders;
    },
    getCompanyEmployees:function(){
      return companyEmployees;
    },
    getCompanyFilters:function(){
      return companyFilters;
    },
    getTotalCompanyInfo:function(){
      return totalCompanyInfo;
    }

  };
}]);



}());