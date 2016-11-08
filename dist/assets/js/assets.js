!function(){"use strict";angular.module("services",["ngResource"]).factory("$loStorage",function(){var e={todos:[],vacios:[],cleanLS:function(){window.localStorage.clear()},setObject:function(e,t){window.localStorage.setItem(e,angular.toJson(t))},getObject:function(e){return JSON.parse(window.localStorage.getItem(e))},removeObject:function(e){window.localStorage.removeItem(e)}};return e}).factory("Config",function(){return{version:"0.0.1",ip:"localhost",port:5006,protocol:"http"}}).factory("shop",["$resource","Config",function(e,t){var r,o={},n=[],s=[],i=[],l="http://"+t.ip+":"+t.port;return{prueba:e("http://"+t.ip+":"+t.port+"/handleProjects"),pruebaUpdate:e("http://"+t.ip+":"+t.port+"/handleProjects",{},{update:{method:"PUT"}}),list:e("http://"+t.ip+":"+t.port+"/items"),items:e("http://"+t.ip+":"+t.port+"/items",{}),itemIncrement:e("http://"+t.ip+":"+t.port+"/increment",{},{update:{method:"PUT"}}),itemsInserted:e("http://"+t.ip+":"+t.port+"/insertedItems",{}),itemsCodeOrName:e("http://"+t.ip+":"+t.port+"/itemsCodeOrName",{}),itemidUpdate:e("http://"+t.ip+":"+t.port+"/items",{},{update:{method:"PUT"}}),project:e("http://"+t.ip+":"+t.port+"/projects",{}),projectRequiredAmounts:e("http://"+t.ip+":"+t.port+"/requiredAmounts",{}),projectGeneralView:e("http://"+t.ip+":"+t.port+"/projectGeneralView",{}),projectUpdate:e("http://"+t.ip+":"+t.port+"/projects",{},{update:{method:"PUT"}}),assembly:e("http://"+t.ip+":"+t.port+"/assemblies",{}),assemblyUpdate:e("http://"+t.ip+":"+t.port+"/assemblies",{},{update:{method:"PUT"}}),company:e("http://"+t.ip+":"+t.port+"/company",{}),companyInfoUpdate:e("http://"+t.ip+":"+t.port+"/company",{},{update:{method:"PUT"}}),companyFiltersUpdate:e("http://"+t.ip+":"+t.port+"/companyFilters",{},{update:{method:"PUT"}}),users:e(l+"/users",{}),usersUpdate:e(l+"/users",{},{update:{method:"PUT"}}),orders:e(l+"/orders",{}),ordersUpdate:e(l+"/orders",{},{update:{method:"PUT"}}),passCompanyInfo:function(e){o=e,i=o.companyItemFilters,s=o.companyProviders,n=o.companyUsers,r=o.companyId},getCompanyId:function(){return r},getCompanyProviders:function(){return s},getCompanyEmployees:function(){return n},getCompanyFilters:function(){return i},getTotalCompanyInfo:function(){return o}}}])}(),function(){"use strict";function e(){var e={},t={},r=function(t){e=t},o=function(e){t=e},n=function(){return e},s=function(){return t},i=function(e){var t=[];return _.each(e,function(e){var r=e.itemCode;t.push(r)}),t},l=function(e){var t=[];return _.each(e,function(e){var r=[e.itemCode,e.itemAmount];t.push(r)}),t},a=function(e,t){var r=[],o=t.length;return _.each(e,function(e){for(var n=0;n<o;n++){var s=t[n];e[0]===s[0]&&r.push([e[0],e[1]-s[1]])}}),r},c=function(e){var t=[];return _.each(e,function(e){e[1]<0&&t.push(e)}),t},m=function(e,t){var r=[],o=t.length;return _.each(e,function(e){for(var n=0;n<o;n++){var s=t[n];e.itemCode===s.itemCode&&(e.stockAmount=s.itemAmount,r.push(e))}}),r},d=function(e,t){var r=[],o=e.length;return _.each(t,function(t){for(var n=0;n<o;n++){var s=e[n];t.itemCode===s.itemCode&&(s.insertedAmount=t.itemAmount,r.push(s))}}),r},u=function(e){var t={};return t.itemCode=e.itemCode,t.itemName=e.itemName||"NONE",t.itemType=e.itemType||"NONE",t.itemProvider=e.itemProvider||"NONE",t.itemAssemblyName=e.itemAssemblyName||"NONE",t.itemAmount=e.itemAmount,t.remainingAmount=Math.abs(e.remainingAmount),t},p=function(e){var t={};return t.itemCode=e.itemCode,t.itemName=e.itemName,t.amountOrdered=e.amountOrdered,t.itemPrice=e.itemPrice,t.totalPrice=e.totalPrice,t};return{getJustCode:i,resumeCodeAndAmount:l,subtract2arrays:a,checkIfNegative:c,addAmountFromStock:m,addInsertedAmount:d,passProject:r,passAssembly:o,getCurrentAssembly:s,getCurrentProject:n,orderObjects:u,orderObjectsForOrder:p}}angular.module("auxiliarFunctions",[]).factory("handleProjects",e)}(),function(){"use strict";angular.module("menuModule",[]).controller("menuCtrl",["$scope","$timeout","$mdSidenav","$log",function(e,t,r,o){function n(r,o){var n;return function(){var s=e,i=Array.prototype.slice.call(arguments);t.cancel(n),n=t(function(){n=void 0,r.apply(s,i)},o||10)}}function s(e){return n(function(){r(e).toggle().then(function(){})},200)}function i(e){return function(){r(e).toggle().then(function(){})}}e.toggleLeft=s("left"),e.toggleRight=i("right"),e.isOpenRight=function(){return r("right").isOpen()},e.close=function(){r("left").close().then(function(){o.debug("close RIGHT is done")})}}])}(),function(){"use strict";angular.module("pendingsModule",[]).controller("pendingsCtrl",["$scope","shop","handleProjects",function(e,t,r){e.header={itemCode:"Item Code",itemAmount:"Stock",itemNeed:"Remain",itemType:"Type",itemName:"Name",itemBuyPrice:"Price",itemProvider:"Provider"},e.progressBardisable=!0,e.newBuyOrder=!1,e.firmaId=t.getCompanyId();var o={};o.companyId="RMB01",o.projectState="open",e.filtrar={itemType:"SCHRAUBE"},e.queryItems=function(){var t={};t[e.filterModel.queryObjKey]=e.queryTag,console.log(t),e.filtrar=t},e.toDownload=[],e.queryPendings=function(){console.log(e.firmaId),t.prueba.query(o,function(o){e.collection=o,e.filterBy=t.getCompanyFilters(),e.providers=e.filterBy[1].array;for(var n=e.collection.length,s=0;s<n;s++){var i=r.orderObjects(e.collection[s]);e.toDownload.push(i)}},function(e){console.log(e)})},e.firmaId&&e.queryPendings(),e.$on("companyInfoAvailable",function(){e.firmaId=t.getCompanyId(),e.queryPendings()}),e.newOrder=function(){e.newBuyOrder=!0,console.log(e.newBuyOrder),t.project.query(o,function(t){var r=[];_.each(t,function(t){r.push(t.projectNumber),e.items=r})},function(e){console.log(e)})},e.filterItemsToOrder=function(){e.itemsNewOrder=_.filter(e.collection,function(e){return e.order===!0})},e.createNewOrder=function(r){e.progressBardisable=!1,r.projectNumbers=e.selected,r.orderedItems=e.itemsNewOrder,r.companyId=e.firmaId,r.orderState="open",r.orderStatus="Ordered",console.log(r),t.orders.save(r,function(){e.selected=[],e.queryPendings(),e.itemsNewOrder=[],e.progressBardisable=!0,e.newBuyOrder=!1},function(e){console.log(e)})},e.selected=[],e.toggle=function(t,r){var o=r.indexOf(t);o>-1?(r.splice(o,1),console.log(e.selected)):(r.push(t),console.log(e.selected))},e.exists=function(e,t){return t.indexOf(e)>-1}}]).directive("pendingsViewHeader",[function(){return{restrict:"E",templateUrl:"pendingsView/pendingsViewHeader.html"}}]).directive("newOrderHeader",[function(){return{restrict:"E",templateUrl:"pendingsView/newOrderHeader.html"}}]).directive("pendingsTable",[function(){return{restrict:"E",templateUrl:"pendingsView/pendingsTable.html",link:function(e){e.order=function(t){e.reverse=e.predicate===t&&!e.reverse,e.predicate=t}}}}])}(),function(){"use strict";angular.module("ordersModule",[]).controller("ordersCtrl",["$scope","shop","handleProjects",function(e,t,r){e.oindex=0,e.toDownload=[],e.firmaId=t.getCompanyId();var o={};o.companyId=e.firmaId,e.queryOrders=function(n,s){o.orderState=s||"open",t.orders.query(o,function(t){e.orders=t,console.log(t),e.orderInfo=t[n]||t[0]||[],e.collection=e.orderInfo.orderedItems||[],e.progressBardisable=!0,_.each(e.collection,function(t){var o=r.orderObjectsForOrder(t);e.toDownload.push(o)})},function(e){console.log(e)}),e.filters=t.getCompanyFilters(),e.providerList=e.filters[1].array},e.firmaId&&e.queryOrders(),e.$on("companyInfoAvailable",function(){e.firmaId=t.getCompanyId(),console.log("from run"),e.queryOrders()}),e.totalPrice=function(){e.obj.totalPrice=e.obj.amountOrdered*e.obj.itemPrice},e.editItemInOrder=function(t){e.obj=t,e.obj.totalPrice=t.amountOrdered*t.itemPrice,e.insertObjInOrder=!1,e.editObjInOrder=!0}}]).directive("ordersListCard",["shop","handleProjects",function(e,t){return{restrict:"E",templateUrl:"ordersView/ordersListCard.html",link:function(r){r.progressBardisable=!1,r.statusList=["Pending","Ordered","Paid","Delivered"],r.showOrderDetails=function(e,o){r.oindex=o,r.orderInfo=e,r.collection=r.orderInfo.orderedItems,r.toDownload=[],_.each(r.collection,function(e){var o=t.orderObjectsForOrder(e);r.toDownload.push(o)})},r.deleteOrder=function(t,o){var n=confirm("Are you sure to delete Order: "+t.orderNumber);n===!0&&e.orders.remove({_id:t._id},function(e){r.orders.splice(o,1),alert("Order: "+e.orderNumber+" successfully deleted"),r.queryOrders()})},r.editOrderObj=function(e){var t=(new Date).toString();e.orderDeliveringDate=e.orderDeliveringDate?new Date(e.orderDeliveringDate):new Date(t),console.log(e,t),r.obj=e,r.editOrder=!0},r.updateOrder=function(t){var o=t._id;e.ordersUpdate.update({_id:o},t,function(e){console.log(e),r.obj={},r.queryOrders(),r.editOrder=!1})},r.closeOrder=function(t){var o=t._id;t.orderState="closed",e.ordersUpdate.update({_id:o},t,function(e){console.log(e),r.queryOrders()})}}}}]).directive("orderDetailsHeader",["shop",function(e){return{restrict:"E",templateUrl:"ordersView/orderDetailsHeader.html",link:function(t){t.insertNewItemInOrder=function(){t.obj={},t.editOrder=!1,t.insertObjInOrder=!0},t.createItemInOrder=function(r){t.progressBardisable=!1;var o={};o.companyId=t.firmaId,o.orderNumber=t.orderInfo.orderNumber,e.ordersUpdate.update(o,r,function(){t.queryOrders(t.oindex,"open"),t.insertObjInOrder=!1},function(e){console.log(e)})},t.updateItemInOrder=function(r){t.progressBardisable=!1;var o={};o.companyId=t.firmaId,o["orderedItems._id"]=r._id,o.orderNumber=t.orderInfo.orderNumber,e.ordersUpdate.update(o,r,function(){t.progressBardisable=!0,t.editObjInOrder=!1},function(e){console.log(e)})}}}}]).directive("orderTable",["shop",function(e){return{restrict:"E",templateUrl:"ordersView/orderTable.html",link:function(t){t.deleteItemFromOrder=function(r){var o=confirm("Are you sure to delete the item: "+r.itemCode);if(o===!0){t.progressBardisable=!1;var n={};n.companyId=t.firmaId,n.orderNumber=t.orderInfo.orderNumber,n.itemCode=r.itemCode,e.ordersUpdate.update(n,r,function(){alert("item: "+r.itemCode+" successfully deleted"),t.queryOrders(t.oindex,"open")})}},t.header={isDelivered:"Delivered",itemCode:"Item Code",itemName:"Name",itemAmount:"Ordered Amount",itemBuyPrice:"Price",totalPrice:"Total",handle:"Handle"},t.order=function(e){t.reverse=t.predicate===e&&!t.reverse,t.predicate=e}}}}])}(),function(){"use strict";angular.module("settingsModule",[]).controller("settingsCtrl",["$scope","shop","handleProjects","$location","$anchorScroll",function(e,t,r,o,n){e.gotoHash=function(e){var t=e;o.hash()!==t?o.hash(e):n()},e.createAssembly=!1;var s={itemType:"SCHRAUBE"};e.loadFilter=function(){e.firmaId=t.getCompanyId(),e.filterBy=t.getCompanyFilters(),e.assembliesList=e.filterBy[3].array,e.providersList=e.filterBy[1].array},e.queryData=function(){t.items.query(s,function(t){e.collection=t;var o=r.getJustCode(e.collection);o.push("0"),e.insertedItems(o)},function(e){console.log(e)})},e.refresh=function(){e.loadFilter(),s.companyId=e.firmaId,e.queryData()},e.firmaId=t.getCompanyId(),e.firmaId&&e.refresh(),e.$on("companyInfoAvailable",function(){e.refresh()}),e.queryByFilter=function(){var t={};t[e.filterModel.queryObjKey]=e.queryTag,s=t,s.companyId=e.firmaId,e.queryData()},e.queryByCode=function(){s={},s.companyId=e.firmaId,s.string=e.search,t.itemsCodeOrName.query(s,function(t){e.collection=t;var o=r.getJustCode(e.collection);o.push("0"),e.insertedItems(o)},function(e){console.log(e)})},e.insertedItems=function(o){var n={};n.companyId=e.firmaId,n.projectState="open",n.codesArray=o,t.itemsInserted.query(n,function(t){r.addInsertedAmount(e.collection,t)},function(e){console.log(e)})},e.header={itemCode:"Item Code",itemAmount:"Stock",insertedAmount:"Assembled",itemType:"Type",itemName:"Name",itemBuyPrice:"Price"},e.editObj=function(t){t.itemLastDate=new Date(t.itemLastDate),e.obj=t,e.createAssembly=!1,e.newItem=!1,e.viewItem=!1,e.justInfo=!1,e.editItem=!0,e.gotoHash("top")},e.readObj=function(t){t.itemLastDate=new Date(t.itemLastDate),e.obj=t,e.createAssembly=!1,e.newItem=!1,e.editItem=!1,e.justInfo=!0,e.viewItem=!0,e.gotoHash("top")},e.deleteObj=function(r,o){var n=confirm("Are you sure to delete Item: "+r.itemName);n===!0&&t.items.remove({_id:r._id},function(t){e.collection.splice(o,1),alert("Item: "+t.itemName+" successfully deleted"),e.refresh()})},e.createObj=function(r){r.companyId=e.firmaId,t.items.save(r,function(t){t&&(e.obj={},e.newItem=!1)},function(e){console.log(e)})},e.updateObj=function(r){var o=r._id;t.itemidUpdate.update({_id:o},r,function(){e.editItem=!1},function(e){alert("The item amount was not updated:"+e)})},e.newitem=function(){e.obj={},e.createAssembly=!1,e.editItem=!1,e.justInfo=!1,e.viewItem=!1,e.newItem=!0,console.log(e.obj)},e.newAssembly=function(){e.createAssembly=!0,e.newItem=!1,e.viewItem=!1,e.justInfo=!1,e.editItem=!1},e.itemsNewAssembly=[],e.refreshFilter=function(){e.itemsToInsert=_.filter(e.collection,function(e){return e.insert===!0})},e.insertItemInAssembly=function(){e.itemsToInsert.length>0&&(_.each(e.itemsToInsert,function(e){e.itemAssembled=!1}),e.itemsNewAssembly.push.apply(e.itemsNewAssembly,e.itemsToInsert),e.refresh(),e.itemsToInsert=[])},e.createNewAssembly=function(){var r={};r.assemblyName=e.assembly.projectName,r.assemblyNumber=e.assembly.projectNumber,r.assemblyItems=e.itemsNewAssembly,r.companyId=e.firmaId,r.assemblyName&&(t.assembly.save(r,function(e){console.log("todo bien primo se creo esa monda"+e)},function(e){alert("error"+e)}),e.createAssembly=!1)}}]).directive("newAssemblyHeader",[function(){return{restrict:"E",templateUrl:"settingsView/newAssemblyHeader.html"}}]).directive("settingsViewHeader",[function(){return{restrict:"E",templateUrl:"settingsView/settingsViewHeader.html"}}]).directive("iForm",[function(){return{restrict:"E",templateUrl:"settingsView/iForm.html"}}]).directive("contenteditable",function(){return{require:"ngModel",link:function(e,t,r,o){t.bind("blur",function(){e.$apply(function(){o.$setViewValue(t.html())})}),o.$render=function(){t.html(o.$viewValue)}}}}).directive("iTable",[function(){return{restrict:"E",templateUrl:"settingsView/itable.html",link:function(e){e.order=function(t){e.reverse=e.predicate===t&&!e.reverse,e.predicate=t}}}}])}(),function(){"use strict";angular.module("projectsModule",["services"]).controller("projectsCtrl",["$scope","shop","$location","$anchorScroll","$stateParams","$state",function(e,t,r,o,n,s){e.pindex=0,e.firmaId=t.getCompanyId(),e.progressBarInsertAssemblydisable=!0,e.projectQuery=function(r,o){e.progressBardisable=!1;var n=s.params.id,i={};i.companyId=e.firmaId,i.projectState=o||"open",t.project.query(i,function(t){if(e.projects=t,n&&"Detail"!==n){var o=e.projects.map(function(e){return e.projectNumber}).indexOf(n);console.log(o,n),o>=0?(e.projectInfo=e.projects[o],e.projectsAssemblies=e.projectInfo.projectAssemblies||[],e.showProjectAssemblies(e.projectInfo),e.progressBardisable=!0,e.progressBarInsertAssemblydisable=!0):(e.projectInfo=e.projects[0]||{projectName:"No Open Projects"},e.projectsAssemblies=e.projectInfo.projectAssemblies||[],e.showProjectAssemblies(e.projectInfo),e.progressBardisable=!0,e.progressBarInsertAssemblydisable=!0)}else e.projectInfo=e.projects[r]||e.projects[0]||{projectName:"No Open Projects"},e.projectsAssemblies=e.projectInfo.projectAssemblies||[],e.showProjectAssemblies(e.projectInfo),e.progressBardisable=!0,e.progressBarInsertAssemblydisable=!0,console.log(s.params.id+"cuajando el else")},function(e){console.log(e)})},e.firmaId&&e.projectQuery(0,"open"),e.$on("companyInfoAvailable",function(){e.firmaId=t.getCompanyId(),e.projectQuery(0,"open")}),e.gotoHash=function(e){var t=e;r.hash()!==t?r.hash(e):o()},e.showProjectAssemblies=function(t,r){e.pindex=r,e.projectInfo=t,e.projectsAssemblies=e.projectInfo.projectAssemblies,_.each(e.projectsAssemblies,function(e){var t=e.assemblyItems,r=_.reject(t,function(e){return e.itemAssembled===!0});e.pendingToBeAssembled=r.length,e.completed=(t.length-r.length)/t.length*100})},e.createNewProject=function(r){e.progressBardisable=!1,r.projectState="open",r.companyId="RMB01",t.project.save(r,function(t){console.log(t),e.startNewProject=!1,e.projects.push(t),e.progressBardisable=!0,e.obj={}})},e.editProjectObj=function(t){console.log(t),e.obj=t,e.startNewProject=!1,e.editProject=!0,e.gotoHash("top")},e.updateProject=function(r){e.progressBardisable=!1;var o=r._id;r.projectNumber=r.projectNumber.toUpperCase(),t.projectUpdate.update({_id:o},r,function(t){console.log(t),e.editProject=!1,e.progressBardisable=!0,e.obj={}})},e.closeProject=function(r){var o=r._id;r.projectState="closed",t.projectUpdate.update({_id:o},r,function(t){console.log(t),e.projectQuery(),e.editProject=!1})},e.deleteProjects=function(r){var o=confirm("Are you sure to delete Item: "+r.projectName);o===!0&&t.project.remove({_id:r._id},function(){console.log("borrado"),e.projectQuery()},function(e){console.log(e)})}}]).directive("projectListCard",[function(){return{restrict:"E",templateUrl:"projectsView/projectListCard.html"}}]).directive("projectDetails",[function(){return{restrict:"E",templateUrl:"projectsView/projectListCard.html"}}])}(),function(){"use strict";angular.module("projectsAssemblyDetailModule",["services"]).controller("projectsAssemblyDetailCtrl",["$scope","handleProjects","shop",function(e,t,r){e.header={itemStatus:"Status",itemCode:"Item Code",neededAmount:"Amount",itemName:"Name"},e.currentProject=t.getCurrentProject(),e.assemblies=e.currentProject.projectAssemblies,e.currentAssembly=t.getCurrentAssembly(),e.collection=e.currentAssembly.assemblyItems,e.seeAssembliesDetails=function(r){t.passAssembly(r),e.currentAssembly=r,e.collection=e.currentAssembly.assemblyItems,console.log(e.collection.length)},e.order=function(t){e.reverse=e.predicate===t&&!e.reverse,e.predicate=t},e.passObjToEdit=function(t){e.obj=t,e.editObjInAssemblyProject=!0},e.updateItems=function(){var t={};t._id=e.currentProject._id,t["projectAssemblies._id"]=e.currentAssembly._id,r.pruebaUpdate.update(t,e.collection,function(){console.log("items updated")},function(e){console.log(e)})}}])}(),function(){"use strict";angular.module("projectsDetailsModule",["services"]).controller("ProjectDetailsCtrl",["$scope","shop","handleProjects",function(e,t,r){e.callAssemblies=function(){var r={};r.companyId=e.firmaId,t.assembly.query(r,function(t){e.collection=t},function(e){console.log(e)})},e.showAssemblies=function(){e.callAssemblies(),e.insertNewAssembly=!0},e.header={assemblyName:"Assembly Name",assemblyNumber:"Assembly Number",numberOfparts:"Parts"},e.refreshFilter=function(){e.assembliesToInsert=_.filter(e.collection,function(e){return e.insert===!0})},e.insertarAssemnliesInProject=function(){e.progressBarInsertAssemblydisable=!1;var r=e.projectInfo._id,o=e.assembliesToInsert;t.projectUpdate.update({_id:r},o,function(){e.assembliesToInsert=[],e.callAssemblies();var t=e.projects.indexOf(e.projectInfo);e.projectQuery(t),e.insertNewAssembly=!1,e.progressBarInsertAssemblydisable=!0},function(e){console.log(e)})},e.passAssembly=function(t){r.passAssembly(t),r.passProject(e.projectInfo)},e.deleteAssemblyFromProject=function(o){var n=_.filter(o.assemblyItems,function(e){return e.itemAssembled===!0}),s=r.resumeCodeAndAmount(n);console.log(s);var i=confirm("Are you sure to delete Assembly: "+o.assemblyName);if(i===!0){var l={};l.companyId=e.firmaId,l.projectNumber=e.projectInfo.projectNumber,l["projectAssemblies._id"]=o._id,t.projectUpdate.update(l,{},function(r){console.log(r);var o={};l.companyId=e.firmaId,t.itemIncrement.update(o,s,function(){alert("items amount restored"),e.projectQuery(e.pindex,"open")},function(e){console.log(e)})},function(e){console.log(e)})}}}])}(),function(){"use strict";angular.module("assembliesModule",["services"]).controller("assembliesCtrl",["$scope","shop","$location","$anchorScroll",function(e,t,r,o){var n=0;e.header={itemCode:"Item Code",neededAmount:"Amount",itemName:"Name"},e.assembliesQuery=function(r){var o={};o.companyId=e.firmaId,e.progressBardisable=!1,t.assembly.query(o,function(t){e.assemblies=t,e.assemblyInfo=e.assemblies[r]||e.assemblies[0],e.collection=e.assemblyInfo.assemblyItems,e.progressBardisable=!0},function(e){console.log(e)})},e.gotoHash=function(e){var t=e;r.hash()!==t?r.hash(e):o()},e.firmaId=t.getCompanyId(),e.firmaId&&e.assembliesQuery(),e.$on("companyInfoAvailable",function(){e.firmaId=t.getCompanyId(),e.assembliesQuery()}),e.editAssembly=function(t){e.Objassembly=t,e.editAssemblyInfo=!0,e.gotoHash("top")},e.updateAssemblyInfo=function(r){e.progressBardisable=!1;var o=r._id;r.assemblyName=r.assemblyName.toUpperCase(),t.assemblyUpdate.update({_id:o},r,function(t){console.log(t),e.editAssemblyInfo=!1,e.progressBardisable=!0},function(e){alert(e)})},e.createAssembly=function(r){r.companyId=e.firmaId,t.assembly.save(r,function(t){console.log(t),e.startNewAssembly=!1,e.assembliesQuery()})},e.deleteAssembly=function(r){var o=confirm("Are you sure to delete Assembly: "+r.assemblyName);if(o===!0){var n={};n.companyId=e.firmaId,n._id=r._id,console.log(n),t.assembly.remove(n,function(){e.assembliesQuery()},function(e){console.log(e)})}},e.showAssemblyItems=function(t,r){n=r,e.assemblyInfo=t,e.collection=t.assemblyItems,e.gotoHash("top")},e.editObj=function(t){e.obj=t,e.insertObjInAssembly=!1,e.editObjInAssembly=!0,e.gotoHash("top")},e.newObj=function(){e.obj={},e.editObjInAssembly=!1,e.insertObjInAssembly=!0},e.insertItemInAssembly=function(r){var o={};o.companyId=e.firmaId,o.assemblyNumber=e.assemblyInfo.assemblyNumber,t.assemblyUpdate.update(o,r,function(t){console.log(t),e.assemblyInfo=t,e.collection=e.assemblyInfo.assemblyItems,e.insertObjInAssembly=!1},function(e){console.log(e)})},e.updateItemInAssembly=function(r){var o={};o.companyId=e.firmaId,o.assemblyNumber=e.assemblyInfo.assemblyNumber,o["assemblyItems._id"]=r._id,t.assemblyUpdate.update(o,r,function(){e.editObjInAssembly=!1},function(e){console.log(e)})},e.deleteItemFromAssembly=function(r){var o=confirm("Are you sure to delete Item: "+r.itemCode);if(o===!0){var n={};n.companyId=e.firmaId,n.assemblyNumber=e.assemblyInfo.assemblyNumber,n.itemCode=r.itemCode,console.log(n),t.assemblyUpdate.update(n,r,function(){e.collection.splice(e.collection.indexOf(r),1)},function(e){console.log(e)})}},e.filterModel={},e.queryByCode=function(){var r={};r.companyId=e.firmaId,r.itemCode=e.search,t.itemsCode.query(r,function(t){e.itemsForAssembly=t},function(e){console.log(e)})},e.loadFilter=function(){e.filterBy=t.getCompanyFilters(),e.assembliesList=e.filterBy[3].array,e.providersList=e.filterBy[1].array},e.queryByFilter=function(){var r={};r[e.filterModel.queryObjKey]=e.queryTag;var o=r;o.companyId=e.firmaId,t.items.query(o,function(t){e.itemsForAssembly=t},function(e){console.log(e)})},e.refreshFilter=function(){e.itemsToInsert=_.filter(e.itemsForAssembly,function(e){return e.insert===!0})},e.listOfitemsToInsertInAssembly=[],e.itemsToInsert=[],e.insertItemInAssembly=function(){if(e.itemsToInsert.length>0){e.progressBardisable=!1,_.each(e.itemsToInsert,function(e){e.itemAssembled=!1}),e.listOfitemsToInsertInAssembly.push.apply(e.listOfitemsToInsertInAssembly,e.itemsToInsert);var r={};r.companyId=e.companyId,r.assemblyNumber=e.assemblyInfo.assemblyNumber,t.assemblyUpdate.update(r,e.listOfitemsToInsertInAssembly,function(){console.log("listo el pollo"),e.assembliesQuery(n),e.filterModel={},e.itemsToInsert=[],e.itemsForAssembly=[],e.search="",e.progressBardisable=!0,e.insertObjInAssembly=!1},function(e){console.log(e)})}}}]).directive("assembliesListCard",[function(){return{restrict:"E",templateUrl:"assembliesView/assembliesListCard.html"}}]).directive("assemblyDetailsHeader",[function(){return{restrict:"E",templateUrl:"assembliesView/assemblyDetailsHeader.html"}}]).directive("assemblyTable",[function(){return{restrict:"E",templateUrl:"assembliesView/assemblyTable.html",link:function(e){e.order=function(t){e.reverse=e.predicate===t&&!e.reverse,e.predicate=t}}}}])}(),function(){"use strict";angular.module("companyModule",["services"]).controller("companyCtrl",["$scope","shop",function(e,t){console.log("Company view care verga"),e.companyId=t.getCompanyId(),e.currentCompany=t.getTotalCompanyInfo(),e.menu=[{menuItem:"Employees"},{menuItem:"Filters"}]}]).directive("companyMenuList",[function(){return{restrict:"E",templateUrl:"companyView/companyMenuList.html"}}])}(),function(){"use strict";angular.module("companyEmployeesModule",[]).controller("employeesCtrl",["$scope","shop",function(e,t){e.firmaId=t.getCompanyId();var r={};e.queryEmployees=function(){r.companyId=e.firmaId,t.users.query(r,function(t){e.employees=t,e.progressBarInsertemployeedisable=!0},function(e){console.log(e)})},e.firmaId&&e.queryEmployees(),e.$on("companyInfoAvailable",function(){e.firmaId=t.getCompanyId(),e.queryEmployees()}),e.startNewEmployee=function(){e.obj={},e.newUser=!0},e.createUser=function(r){e.progressBarInsertemployeedisable=!1,r.companyId=e.firmaId,t.users.save(r,function(t){console.log("nuevo user creado",t),e.newUser=!1,e.progressBarInsertemployeedisable=!0,e.queryEmployees()},function(e){console.log(e)})},e.editUserInfo=function(t){e.obj=t,e.editUser=!0},e.updateUser=function(r){var o={};o._id=r._id,t.usersUpdate.update(o,r,function(t){console.log("todo bien perro",t),e.editUser=!1},function(e){alert(e)})},e.deleteUser=function(r,o){var n=confirm("Are you sure to delete User: "+r.userRealName);n===!0&&(e.progressBarInsertemployeedisable=!1,t.users.remove({_id:r._id},function(t){e.employees.splice(o,1),alert("Item: "+t.userRealName+" successfully deleted"),e.progressBarInsertemployeedisable=!0}))}}])}(),function(){"use strict";angular.module("companyFiltersModule",[]).controller("filterCtrl",["$scope","shop",function(e,t){e.filterTags=t.getCompanyFilters(),e.companyId=t.getCompanyId(),e.filtersDetails=function(t){e.myFilters=t.array,e.currentFilter=t,e.showFilters=!0,console.log("filters")},e.saveChangesInFilters=function(e){console.log(e)},e.pushFilter=function(r){var o={};o.companyId=e.companyId,o["companyItemFilters.queryObjKey"]=e.currentFilter.queryObjKey;var n={};n.toAdd=r,t.companyFiltersUpdate.update(o,n,function(e){console.log(e)},function(e){console.log(e)})},e.removeFilter=function(r){var o={};o.companyId=e.companyId,o["companyItemFilters.queryObjKey"]=e.currentFilter.queryObjKey;var n={};n.toRemove=r,t.companyFiltersUpdate.update(o,n,function(e){console.log(e)},function(e){console.log(e)})}}])}(),function(){"use strict";angular.module("eStockFront",["ngSanitize","ngCsv","templates","ui.router","ngMaterial","services","auxiliarFunctions","menuModule","settingsModule","pendingsModule","ordersModule","projectsModule","projectsAssemblyDetailModule","projectsDetailsModule","assembliesModule","companyModule","companyEmployeesModule","companyFiltersModule"]).run(["shop","$rootScope",function(e,t){var r="RMB01";e.company.query({companyId:r},function(r){console.log("from run",r[0]),e.passCompanyInfo(r[0]),t.$broadcast("companyInfoAvailable")})}]).config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/app/Settings"),t.when("/app/Projects","/app/Projects/Details"),t.when("/app/Company","app/Company/Employees"),e.state("app",{abstract:!0,url:"/app",templateUrl:"menu/menu.html",controller:"menuCtrl"}).state("app.Settings",{url:"/Settings",templateUrl:"settingsView/settingsView.html",controller:"settingsCtrl"}).state("app.Pendings",{url:"/Pendings",templateUrl:"pendingsView/pendingsView.html",controller:"pendingsCtrl"}).state("app.Orders",{url:"/Orders",templateUrl:"ordersView/ordersView.html",controller:"ordersCtrl"}).state("app.Projects",{url:"/Projects",templateUrl:"projectsView/projectsView.html",controller:"projectsCtrl"}).state("app.Projects.Details",{url:"/:id",templateUrl:"projectsView/projectDetails.html",controller:"ProjectDetailsCtrl"}).state("app.assemblyDetails",{url:"/Projects/:pId/:idAssembly",templateUrl:"projectsView/projectAssembliesDetails.html",controller:"projectsAssemblyDetailCtrl"}).state("app.Assemblies",{url:"/Assemblies",templateUrl:"assembliesView/assembliesView.html",controller:"assembliesCtrl"}).state("app.LogIn",{url:"/LogIn",templateUrl:"logIn/logIn.html"}).state("app.Company",{url:"/Company",templateUrl:"companyView/companyView.html",controller:"companyCtrl"}).state("app.Company.Employees",{url:"/Employees",templateUrl:"companyView/employees.html",controller:"employeesCtrl"}).state("app.Company.Filters",{url:"/Filters",templateUrl:"companyView/companyFilters.html",controller:"filterCtrl"})}])}();