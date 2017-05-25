(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('LocationScmController', LocationScmController);

    LocationScmController.$inject = ['Location'];

    function LocationScmController(Location) {

        var vm = this;

        vm.locations = [];

        loadAll();

        function loadAll() {
            Location.query(function(result) {
                vm.locations = result;
                vm.searchQuery = null;
            });
        }
    }
})();
