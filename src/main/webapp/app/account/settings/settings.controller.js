(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', 'Principal', 'Auth', 'JhiLanguageService', '$translate', 'DataUtils'];

    function SettingsController($scope, Principal, Auth, JhiLanguageService, $translate, DataUtils) {
        var vm = this;

        vm.error = null;
        vm.save = save;
        vm.settingsAccount = null;
        vm.success = null;
        vm.byteSize = DataUtils.byteSize;
        vm.photoModified = false;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;

        /**
         * Store the "settings account" in a separate variable, and not in the shared "account" variable.
         */
        var copyAccount = function(account) {
            return {
                activated: account.activated,
                email: account.email,
                firstName: account.firstName,
                langKey: account.langKey,
                lastName: account.lastName,
                login: account.login,
                imageUrl: account.imageUrl,
                phoneNumber: account.phoneNumber,
                photo: account.photo,
                photoContentType: account.photoContentType,
                birthDate: account.birthDate
            };
        };

        Principal.identity().then(function(account) {
            vm.settingsAccount = copyAccount(account);
        });

        function save() {
            Auth.updateAccount(vm.settingsAccount).then(function() {
                vm.error = null;
                vm.success = 'OK';
                Principal.identity(true).then(function(account) {
                    vm.settingsAccount = copyAccount(account);
                    vm.photoModified = false;
                });
                JhiLanguageService.getCurrent().then(function(current) {
                    if (vm.settingsAccount.langKey !== current) {
                        $translate.use(vm.settingsAccount.langKey);
                    }
                });
            }).catch(function() {
                vm.success = null;
                vm.error = 'ERROR';
            });
        }

        vm.setPhoto = function($file) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        vm.settingsAccount.photo = base64Data;
                        vm.settingsAccount.photoContentType = $file.type;
                        vm.photoModified = true;
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
