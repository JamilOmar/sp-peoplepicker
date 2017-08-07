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
                function onInit()
                {

                    alert('Hola');
                }
                var vm =this;
                vm.greetings = 'Hello';
                onInit();
            }
        }
    })
}