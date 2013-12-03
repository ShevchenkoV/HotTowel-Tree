(function () {
    'use strict';

    var controllerId = 'TreeController';
    angular.module('app').controller(controllerId, ['$scope', 'common', tree]);

    function tree($scope, common) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Tree';

        $scope.isCheckedShown = true;

        // default tree tasks model
        $scope.tasksTree = {
            name: "project",
            checked: false,
            children: [
                { name: "task0", checked: false, children: [] },
                { name: "task1", checked: false, children: [] },
                {
                    name: "task2", checked: false, children: [
                       { name: "task0", checked: false, children: [] },
                       {
                           name: "task1", checked: false, children: [
                              { name: "task0", checked: false, children: [] },
                              { name: "task1", checked: false, children: [] },
                              { name: "task2", checked: false, children: [] }
                           ]
                       },
                       { name: "task2", checked: false, children: [] }
                    ]
                }
            ]
        };

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Activated Tree View'); });
        }
    }
})();