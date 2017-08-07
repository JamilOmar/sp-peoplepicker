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
                        context = new SP.ClientContext(appWebUrl);
                        var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
                        context.set_webRequestExecutorFactory(factory);
                        var newUser = context.get_web().get_currentUser(); //.ensureUser("nih\\aafalconijo");
                        context.load(newUser);
                        context.executeQueryAsync(function () {
                            // log the name of the app web to the console
                            alert(newUser.get_title());
                        }, function (sender, args) {
                            console.log("Error : " + args.get_message());
                        })
                        //Make a people picker control
                        //1. context = SharePoint Client Context object
                        //2. $('#spanAdministrators') = SPAN that will 'host' the people picker control
                        //3. $('#inputAdministrators') = INPUT that will be used to capture user input
                        //4. $('#divAdministratorsSearch') = DIV that will show the 'dropdown' of the people picker
                        //5. $('#hdnAdministrators') = INPUT hidden control that will host a JSON string of the resolved users
                        peoplePicker = new CAMControl.PeoplePicker(context, $('#spanAdministrators'), $('#inputAdministrators'), $('#divAdministratorsSearch'), $('#hdnAdministrators'));
                        // required to pass the variable name here!
                        peoplePicker.InstanceName = "peoplePicker";
                        // Pass current language, if not set defaults to en-US. Use the SPLanguage query string param or provide a string like "nl-BE"
                        // Do not set the Language property if you do not have foreseen javascript resource file for your language
                        peoplePicker.Language = spLanguage;
                        // optionally show more/less entries in the people picker dropdown, 4 is the default
                        peoplePicker.MaxEntriesShown = 5;
                        // Can duplicate entries be selected (default = false)
                        peoplePicker.AllowDuplicates = false;
                        // Show the user loginname
                        peoplePicker.ShowLoginName = true;
                        // Show the user title
                        peoplePicker.ShowTitle = true;
                        // Set principal type to determine what is shown (default = 1, only users are resolved). 
                        // See http://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.utilities.principaltype.aspx for more details
                        // Set ShowLoginName and ShowTitle to false if you're resolving groups
                        peoplePicker.PrincipalType = 1;
                        // start user resolving as of 2 entered characters (= default)
                        peoplePicker.MinimalCharactersBeforeSearching = 2;
                        // Hookup everything
                        peoplePicker.Initialize();
                    });

                });
        });

    $("#GetValuesByJavascript").click(function (event) {
        event.preventDefault();
        //get json string from hidden field and parse it to PeoplePickerUser object
        var pickedPeople = $.parseJSON($('#hdnAdministrators').val());

        var pickedPeopleString = "";

        //loop picked persons and create string to show
        $.each(pickedPeople, function (key, value) {
            pickedPeopleString += value.Name + " ";
            getUserId(value.Login);
        });
        alert(pickedPeopleString);

    });

    // Get the user ID.
    function getUserId(loginName) {
        this.user = context.get_web().ensureUser(loginName);
        context.load(this.user);
        context.executeQueryAsync(
            Function.createDelegate(null, ensureUserSuccess),
            Function.createDelegate(null, onFail)
        );
    }

    function ensureUserSuccess() {
        console.log(this.user.get_id());
    }

    function onFail(sender, args) {
        alert('Query failed. Error: ' + args.get_message());
    }


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


///https://github.com/spkrby/MVCPeoplePicker/blob/master/MVCPeoplePickerWeb/Views/Home/Index.cshtml