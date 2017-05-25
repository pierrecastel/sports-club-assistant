(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('MemberScmDeleteController',MemberScmDeleteController);

    MemberScmDeleteController.$inject = ['$uibModalInstance', 'entity', 'Member'];

    function MemberScmDeleteController($uibModalInstance, entity, Member) {
        var vm = this;

        vm.member = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Member.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
