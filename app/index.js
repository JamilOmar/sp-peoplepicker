var angular = require('angular');
var ngModule = angular.module('app', []);
window.jQuery = window.$ = require("jquery");
require('./references/MicrosoftAjax.js');
require('./directives')(ngModule);
ngModule.controller('controller', ['$scope', function ($scope) {
// variable used for cross site CSOM calls
var context;
// peoplePicker variable needs to be globally scoped as the generated html contains JS that will call into functions of this class
var peoplePicker;
var csomPeoplePicker;

//Wait for the page to load
$(document).ready(function () {

    //Get the URI decoded SharePoint site url from the SPHostUrl parameter.
    var spHostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    var appWebUrl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
    var spLanguage = decodeURIComponent(getQueryStringParameter('SPLanguage'));

    //Build absolute path to the layouts root with the spHostUrl
    var layoutsRoot = spHostUrl + '/_layouts/15/';

    //load all appropriate scripts for the page to function
    $.getScript(layoutsRoot + 'SP.Runtime.js',
        function () {
            $.getScript(layoutsRoot + 'SP.js',
                function () {
                    //Load the SP.UI.Controls.js file to render the App Chrome
                    $.getScript(layoutsRoot + 'SP.UI.Controls.js', renderSPChrome);
                    //load scripts for cross site calls (needed to use the people picker control in an IFrame)
                    $.getScript(layoutsRoot + 'SP.RequestExecutor.js', function () {
                     console.log('cargado');
                    });

                });
        });    
    //function callback to render chrome after SP.UI.Controls.js loads
    function renderSPChrome() {
        //Set the chrome options for launching Help, Account, and Contact pages
        var options = {
            'appTitle': document.title,
            'onCssLoaded': 'chromeLoaded()'
        };
        //Load the Chrome Control in the divSPChrome element of the page
        var chromeNavigation = new SP.UI.Controls.Navigation('divSPChrome', options);
        chromeNavigation.setVisible(true);
    };

});


/*** */

function chromeLoaded() {
    $('body').show();
}

/**** */


//function to get a parameter value by a specific key
function getQueryStringParameter(urlParameterKey) {
    var params = document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split('=');
        if (singleParam[0] === urlParameterKey)
            return singleParam[1];
    }
}
    $scope.name = 'jamil';
}])