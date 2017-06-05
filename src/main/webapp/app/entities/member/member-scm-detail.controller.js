(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('MemberScmDetailController', MemberScmDetailController);

    MemberScmDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Member', 'User', 'Address'];

    function MemberScmDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Member, User, Address) {
        var vm = this;

        vm.member = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('scmApp:memberUpdate', function(event, result) {
            vm.member = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
