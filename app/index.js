var angular = require('angular');
var ngModule = angular.module('app', []);
window.jQuery = window.$ = require("jquery");
require('./directives')(ngModule);
ngModule.controller('controller', ['$scope', function ($scope) {

    $scope.taskAssignees2 = [{"Id":20,"Login":"i:0#.w|nih\\falconeel","Title":"i:0#.w|nih\\falconeel","Name":"Falcone, Emilia (NIH/NIAID) [E]","Email":"emilia.falcone@nih.gov"}];
}])