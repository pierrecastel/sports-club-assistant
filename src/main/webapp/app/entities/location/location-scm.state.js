(function() {
    'use strict';

    angular
        .module('scmApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('location-scm', {
            parent: 'entity',
            url: '/location-scm',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.location.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/location/locationsscm.html',
                    controller: 'LocationScmController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('location');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('location-scm-detail', {
            parent: 'location-scm',
            url: '/location-scm/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.location.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/location/location-scm-detail.html',
                    controller: 'LocationScmDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('location');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Location', function($stateParams, Location) {
                    return Location.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'location-scm',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('location-scm-detail.edit', {
            parent: 'location-scm-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-scm-dialog.html',
                    controller: 'LocationScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Location', function(Location) {
                            return Location.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('location-scm.new', {
            parent: 'location-scm',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-scm-dialog.html',
                    controller: 'LocationScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('location-scm', null, { reload: 'location-scm' });
                }, function() {
                    $state.go('location-scm');
                });
            }]
        })
        .state('location-scm.edit', {
            parent: 'location-scm',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-scm-dialog.html',
                    controller: 'LocationScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Location', function(Location) {
                            return Location.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('location-scm', null, { reload: 'location-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('location-scm.delete', {
            parent: 'location-scm',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-scm-delete-dialog.html',
                    controller: 'LocationScmDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Location', function(Location) {
                            return Location.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('location-scm', null, { reload: 'location-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
