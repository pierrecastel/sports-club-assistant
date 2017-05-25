(function() {
    'use strict';

    angular
        .module('scmApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('address-scm', {
            parent: 'entity',
            url: '/address-scm',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.address.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/address/addressesscm.html',
                    controller: 'AddressScmController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('address');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('address-scm-detail', {
            parent: 'address-scm',
            url: '/address-scm/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.address.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/address/address-scm-detail.html',
                    controller: 'AddressScmDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('address');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Address', function($stateParams, Address) {
                    return Address.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'address-scm',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('address-scm-detail.edit', {
            parent: 'address-scm-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/address/address-scm-dialog.html',
                    controller: 'AddressScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Address', function(Address) {
                            return Address.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('address-scm.new', {
            parent: 'address-scm',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/address/address-scm-dialog.html',
                    controller: 'AddressScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                street: null,
                                zipCode: null,
                                city: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('address-scm', null, { reload: 'address-scm' });
                }, function() {
                    $state.go('address-scm');
                });
            }]
        })
        .state('address-scm.edit', {
            parent: 'address-scm',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/address/address-scm-dialog.html',
                    controller: 'AddressScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Address', function(Address) {
                            return Address.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('address-scm', null, { reload: 'address-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('address-scm.delete', {
            parent: 'address-scm',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/address/address-scm-delete-dialog.html',
                    controller: 'AddressScmDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Address', function(Address) {
                            return Address.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('address-scm', null, { reload: 'address-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
