'use strict';

/**
 * @ngdoc function
 * @name cb-ts-demo.controller:MainCtrl
 * @description
 * # MyCtrl
 */
var app = angular.module('cb-ts-demo');

app.controller('MyCtrl', function($scope, MyService) {
    
   //Get the message from Couchbase
   var id = "hello";
    
   $scope.msg = "This is the CEAN stack application skeleton!"; 
       
   MyService.get(id).then(
       
       function(ctx) {
        
           var result = ctx.data;
           
           if (!result.error)
           {
                var value = result.value; 
           
               //Set the model
               if (value.msg) $scope.msg = value.msg;   
           }
       }
   );
   
    
   //Execute when add is clicked
   $scope.onAddClicked = function () {
    
       var id = "hello";
       var msg = "Hello Couchbase!";
       
       MyService.add(id, msg).then(
         
           function(ctx) { 
            
               var result = ctx.data;
               
               if (result.error)
               {
                    $scope.msg = result.error;
               }
               else
               {
                   $scope.msg = "Successfully added a document to your Couchbase bucket!";
               }
           },
           
           function(error) {
               
               $scope.msg = "Please configure your Couchbase connection!";       
           }
           
       );
   }  
});