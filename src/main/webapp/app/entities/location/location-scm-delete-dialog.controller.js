(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('LocationScmDeleteController',LocationScmDeleteController);

    LocationScmDeleteController.$inject = ['$uibModalInstance', 'entity', 'Location'];

    function LocationScmDeleteController($uibModalInstance, entity, Location) {
        var vm = this;

        vm.location = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Location.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
