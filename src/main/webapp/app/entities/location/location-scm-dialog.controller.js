(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('LocationScmDialogController', LocationScmDialogController);

    LocationScmDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Location', 'Address'];

    function LocationScmDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Location, Address) {
        var vm = this;

        vm.location = entity;
        vm.clear = clear;
        vm.save = save;
        vm.addresses = Address.query({filter: 'location-is-null'});
        $q.all([vm.location.$promise, vm.addresses.$promise]).then(function() {
            if (!vm.location.addressId) {
                return $q.reject();
            }
            return Address.get({id : vm.location.addressId}).$promise;
        }).then(function(address) {
            vm.addresses.push(address);
        });

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.location.id !== null) {
                Location.update(vm.location, onSaveSuccess, onSaveError);
            } else {
                Location.save(vm.location, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('scmApp:locationUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
