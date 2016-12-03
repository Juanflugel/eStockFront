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

        var addResumeInsertedAndPending = function(colStock,colResume){ // to show the total assmebled and  pending amounts to be assembled in open projects 
            
            var objsWithResumedAmounts = [];
            _.each(colStock,function (stockObj){
                _.each(colResume,function (resumeObj) {
                    if(resumeObj.itemCode === stockObj.itemCode){
                        stockObj.totalPendingAmount = resumeObj.totalPendingAmount || 0;
                        stockObj.insertedAmount = resumeObj.insertedAmount || 0;
                        stockObj.neto = stockObj.itemAmount - stockObj.totalPendingAmount;
                        objsWithResumedAmounts.push(stockObj);
                    }
                });

                if(!stockObj.totalPendingAmount && !stockObj.insertedAmount){
                  stockObj.totalPendingAmount = 0;
                  stockObj.insertedAmount = 0;
                  stockObj.neto = stockObj.itemAmount - stockObj.totalPendingAmount;
                  objsWithResumedAmounts.push(stockObj);
                }                
          });

          return objsWithResumedAmounts;

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

        var orderObjectsForOrder = function(obj){
          var objready = {};
          objready.itemCode = obj.itemCode;
          objready.itemName = obj.itemName;
          objready.amountOrdered = obj.amountOrdered;
          objready.itemPrice = obj.itemPrice;
          objready.totalPrice = obj.totalPrice;
          return objready;
        };

        var completeProjects = function(colStock,arrayPro){ 
          // it is a function to complete the structure for each object to be able to show it in the view correctly

          var results =  _.each(colStock,function (objStock){
                var oSPA = objStock.projectsAmounts;
                var oSPAL = oSPA.length;

                  if(oSPAL ===0 ){
                    _.each(arrayPro,function (pn){
                      oSPA.push({'projectNumber':pn,'netoAmount':0,'itemAssembled':false});
                    })
                  }

                  if (oSPAL < arrayPro.length  && oSPAL != 0){
                      _.each(oSPA,function (i){                        
                        _.each(arrayPro,function (pn){
                             if(i.projectNumber !=pn && oSPAL < arrayPro.length){
                                oSPA.push({'projectNumber':pn,'netoAmount':0,'itemAssembled':false});
                             }                             
                        });
                      });
                  }
            });
            return results;  
        };

        var addProjectsAmounts = function(colStock,colPro,l){ // two differents collections Stock(base), projects( to add)
         var results = _.each(colStock,function (objStock){
                objStock.projectsAmounts = [];

                  _.each(colPro,function (objPro){                    

                      if(objStock.itemCode === objPro.itemCode){
                        objStock.projectsAmounts.push({'projectNumber':objPro.projectNumber,'netoAmount':objPro.netoAmount,'itemAssembled':objPro.itemAssembled})
                      }                         

                  });

          });


          return results;
        };

        var addProjectProperty = function(colStock,colProItems){
            var results = _.each(colStock,function (objStock){
                    
                  _.each(colProItems,function (objPro){
                      if(objStock.itemCode === objPro.itemCode ){
                        var prop = objPro.projectNumber.toString();                        
                        objStock[prop] = {'netoAmount':objPro.netoAmount,'itemAssembled':objPro.itemAssembled};
                        
                      }
                  });

                  
            });

            return results;
        };


        return {
            getJustCode : getJustCode,
            resumeCodeAndAmount : resumeCodeAndAmount,
            subtract2arrays : subtract2arrays,
            checkIfNegative : checkIfNegative,
            addAmountFromStock : addAmountFromStock,
            passProject : passProject,
            passAssembly : passAssembly,
            getCurrentAssembly : getCurrentAssembly,
            getCurrentProject : getCurrentProject,
            orderObjects : orderObjects,
            orderObjectsForOrder : orderObjectsForOrder,
            addProjectsAmounts : addProjectsAmounts,
            completeProjects: completeProjects,
            addProjectProperty : addProjectProperty,
            addResumeInsertedAndPending : addResumeInsertedAndPending
        };
  
  }

  }());
