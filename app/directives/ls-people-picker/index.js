module.exports =function(ngModule)
{
    ngModule.directive ('lsPeoplePicker',function(){
        return {
            restrict :'EA',
            scope:{},
            templateUrl :'directives/ls-people-picker/template.html',
            controllerAs : 'vm',
            controller:function()
            {
                var vm =this;
                vm.greetings = 'Hello';
            }
        }
    })
}