(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('EventScmDeleteController',EventScmDeleteController);

    EventScmDeleteController.$inject = ['$uibModalInstance', 'entity', 'Event'];

    function EventScmDeleteController($uibModalInstance, entity, Event) {
        var vm = this;

        vm.event = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Event.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
