(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('AddressScmController', AddressScmController);

    AddressScmController.$inject = ['Address'];

    function AddressScmController(Address) {

        var vm = this;

        vm.addresses = [];

        loadAll();

        function loadAll() {
            Address.query(function(result) {
                vm.addresses = result;
                vm.searchQuery = null;
            });
        }
    }
})();
