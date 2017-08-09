var angular = require('angular');
var ngModule = angular.module('app', []);
window.jQuery = window.$ = require("jquery");
require('./references/MicrosoftAjax.js');
require('./directives')(ngModule);
ngModule.controller('controller', ['$scope', function ($scope) {

    $scope.name = 'jamil';
}])