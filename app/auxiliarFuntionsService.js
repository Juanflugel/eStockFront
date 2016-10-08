(function(){
  'use strict';
angular
    .module('auxiliarFunctions',[])
    .factory('handleProjects',handleProjects);

    function handleProjects (){

      var currentProject = {};
      var currentAssembly = {};

         var passProject =function(obj){
          currentProject = obj;
        };

    var passAssembly = function(obj){
      currentAssembly = obj;
    };

     var getCurrentProject = function() {
        return currentProject;
     };

     var getCurrentAssembly = function() {
       
       return currentAssembly;
 
    };

        var getJustCode = function(collection){
          var codeCol = [];
          _.each(collection,function (obj){
            var a = obj.itemCode;
            codeCol.push(a);
          });
          return codeCol;
        };

        var resumeCodeAndAmount = function  (collection) {
            var sample = [];
            _.each(collection,function (obj) {
              var a = [obj.itemCode,obj.itemAmount];
              sample.push(a);
            });
            return sample;
        };

        var subtract2arrays = function (a,b) { // a = array whit values from Stock ['itemCode',3]; b= array from values from the project ['itemCode',5]
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
        };

        var checkIfNegative = function(collection){
          var allNegative = [];
          _.each(collection,function (array){
                if(array[1]<0){
                  allNegative.push(array);
                }
          });
          return allNegative;
        };

        var addAmountFromStock = function(colAssembly,colStock){ // para mostrar la cantidad en stock de cada item
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

        };

        var addInsertedAmount = function(colStock,colAssembly){ // para mostrar la cantidad en stock de cada item
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

        };

        var orderObjects = function(obj){ // this is a function to ensure the csv files has all the properties it need to be consistent

            var orderObj = {};
            orderObj.itemCode = obj.itemCode;
            orderObj.itemName = obj.itemName || 'NONE';
            orderObj.itemType = obj.itemType || 'NONE';
            orderObj.itemProvider = obj.itemProvider || 'NONE';
            orderObj.itemAssemblyName = obj.itemAssemblyName || 'NONE';
            orderObj.itemAmount = obj.itemAmount;
            orderObj.remainingAmount = Math.abs(obj.remainingAmount) ;

            return orderObj;

        };

        return {
            getJustCode : getJustCode,
            resumeCodeAndAmount : resumeCodeAndAmount,
            subtract2arrays : subtract2arrays,
            checkIfNegative : checkIfNegative,
            addAmountFromStock : addAmountFromStock,
            addInsertedAmount : addInsertedAmount,
            passProject : passProject,
            passAssembly : passAssembly,
            getCurrentAssembly : getCurrentAssembly,
            getCurrentProject : getCurrentProject,
            orderObjects : orderObjects
        };
  
  }

  }());
