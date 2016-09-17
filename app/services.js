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
      ip: 'localhost', // localhost www.estock.website
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
}])

// .factory('socketio',['$rootScope',function ($rootScope) {
//   var socket = io.connect('http://tsjuan.ddns.net:5006');
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () {  
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       });
//     }
//   };
// }])

.factory('handleProjects', [function () {

  var currentProject = {};
  var currentAssembly = {};

  return {
    // updateBills:function(){
    //   $rootScope.$broadcast('newBill');
    // },
    // updateBuyList:function(){
    //   $rootScope.$broadcast('newProductToBuy');
    // },
    passProject: function(obj){
      currentProject = obj;
    },
    passAssembly: function(obj){
      currentAssembly = obj;
    },
    // remove: function(bill) {
    //   bills.splice(bills.indexOf(bill), 1);
    // },
    getCurrentProject: function() {

      return currentProject;

    },
    getCurrentAssembly: function() {
      // console.log('me llamaron:'+ currentAssembly);
      return currentAssembly;

    },
    getJustCode: function(collection){
      var codeCol = [];
      _.each(collection,function (obj){
        var a = obj.itemCode;
        codeCol.push(a);
      });
      return codeCol;
    },
    resumeCodeAndAmount:function  (collection) {
        var sample = [];
        _.each(collection,function (obj) {
          var a = [obj.itemCode,obj.itemAmount];
          sample.push(a);
        });
        return sample;
    },
    subtract2arrays: function (a,b) { // a = array whit values from Stock ['itemCode',3]; b= array from values from the project ['itemCode',5]
      var diff = [];
      var lb = b.length;
      _.each(a,function (aObj) {
        
        for(var i=0; i<lb ;i++){
          var bObj = b[i];
          if (aObj[0] === bObj[0]){
            diff.push([aObj[0],aObj[1]-bObj[1]]);
          }
        }
      });
      return diff;
    },
    checkIfNegative:function(collection){
      var allNegative = [];
      _.each(collection,function (array){
            if(array[1]<0){
              allNegative.push(array);
            }
      });
      return allNegative;
    },
    addAmountFromStock:function(colAssembly,colStock){ // para mostrar la cantidad en stock de cada item
      var objMitStockAmount = [];
        var lcolStock = colStock.length;
      _.each(colAssembly,function (colAssemblyObj){
            
            for(var i = 0;i<lcolStock;i++){
              var currentObj = colStock[i];
              if(colAssemblyObj.itemCode === currentObj.itemCode){
                colAssemblyObj.stockAmount = currentObj.itemAmount;
                objMitStockAmount.push(colAssemblyObj);
              }
            }
      });

      return objMitStockAmount;

    },
    addInsertedAmount:function(colStock,colAssembly){ // para mostrar la cantidad en stock de cada item
      var objWithInsertedAmount = [];
       var lcolStock = colStock.length;
      _.each(colAssembly,function (colAssemblyObj){
        
            for(var i =0;i<lcolStock;i++){
              var currentObj = colStock[i];
              if(colAssemblyObj.itemCode === currentObj.itemCode){
               currentObj.insertedAmount = colAssemblyObj.itemAmount;
                objWithInsertedAmount.push(currentObj);
              }
            }
      });

      return objWithInsertedAmount;

    }
  };
}]);

}());