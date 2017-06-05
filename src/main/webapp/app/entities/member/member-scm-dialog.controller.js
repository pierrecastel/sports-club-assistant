(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('MemberScmDialogController', MemberScmDialogController);

    MemberScmDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'DataUtils', 'entity', 'Member', 'User', 'Address'];

    function MemberScmDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, DataUtils, entity, Member, User, Address) {
        var vm = this;

        vm.member = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.users = User.query();
        vm.addresses = Address.query({filter: 'member-is-null'});
        $q.all([vm.member.$promise, vm.addresses.$promise]).then(function() {
            if (!vm.member.addressId) {
                return $q.reject();
            }
            return Address.get({id : vm.member.addressId}).$promise;
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
            if (vm.member.id !== null) {
                Member.update(vm.member, onSaveSuccess, onSaveError);
            } else {
                Member.save(vm.member, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('scmApp:memberUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setPhoto = function ($file, member) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        member.photo = base64Data;
                        member.photoContentType = $file.type;
                    });
                });
            }
        };
        vm.datePickerOpenStatus.birthDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
