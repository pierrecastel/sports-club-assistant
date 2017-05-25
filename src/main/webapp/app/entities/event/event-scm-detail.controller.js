(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('EventScmDetailController', EventScmDetailController);

    EventScmDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Event', 'Team', 'Location', 'User'];

    function EventScmDetailController($scope, $rootScope, $stateParams, previousState, entity, Event, Team, Location, User) {
        var vm = this;

        vm.event = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('scmApp:eventUpdate', function(event, result) {
            vm.event = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
