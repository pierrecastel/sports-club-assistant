(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('TeamScmDetailController', TeamScmDetailController);

    TeamScmDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Team', 'User'];

    function TeamScmDetailController($scope, $rootScope, $stateParams, previousState, entity, Team, User) {
        var vm = this;

        vm.team = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('scmApp:teamUpdate', function(event, result) {
            vm.team = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
