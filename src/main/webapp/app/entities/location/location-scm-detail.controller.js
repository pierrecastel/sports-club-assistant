(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('LocationScmDetailController', LocationScmDetailController);

    LocationScmDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Location', 'Address'];

    function LocationScmDetailController($scope, $rootScope, $stateParams, previousState, entity, Location, Address) {
        var vm = this;

        vm.location = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('scmApp:locationUpdate', function(event, result) {
            vm.location = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
