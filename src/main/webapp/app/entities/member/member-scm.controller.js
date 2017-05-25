(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('MemberScmController', MemberScmController);

    MemberScmController.$inject = ['DataUtils', 'Member'];

    function MemberScmController(DataUtils, Member) {

        var vm = this;

        vm.members = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;

        loadAll();

        function loadAll() {
            Member.query(function(result) {
                vm.members = result;
                vm.searchQuery = null;
            });
        }
    }
})();
