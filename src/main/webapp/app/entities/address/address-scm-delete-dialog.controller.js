(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('AddressScmDeleteController',AddressScmDeleteController);

    AddressScmDeleteController.$inject = ['$uibModalInstance', 'entity', 'Address'];

    function AddressScmDeleteController($uibModalInstance, entity, Address) {
        var vm = this;

        vm.address = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Address.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
