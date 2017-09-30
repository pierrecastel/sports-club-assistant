(function() {
    'use strict';

    angular
        .module('scmApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', '$state', '$filter'];

    function HomeController ($scope, Principal, LoginService, $state, $filter) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        function register () {
            $state.go('register');
        }

        vm.selectedDate = new Date();
        vm.firstDayOfWeek = 0;
        vm.setDirection = function(direction) {
        vm.direction = direction;
        };
        vm.dayClick = function(date) {
          $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
        };
        vm.prevMonth = function(data) {
          $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
        };
        vm.nextMonth = function(data) {
          $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
        };
        vm.setDayContent = function(date) {
          // You would inject any HTML you wanted for
          // that particular date here.
            return "<p></p>";
        };
    }
})();
