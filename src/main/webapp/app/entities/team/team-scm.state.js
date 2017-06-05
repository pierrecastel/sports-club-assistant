(function() {
    'use strict';

    angular
        .module('scmApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('team-scm', {
            parent: 'entity',
            url: '/team-scm',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.team.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/team/teamsscm.html',
                    controller: 'TeamScmController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('team');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('team-scm-detail', {
            parent: 'team-scm',
            url: '/team-scm/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.team.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/team/team-scm-detail.html',
                    controller: 'TeamScmDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('team');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Team', function($stateParams, Team) {
                    return Team.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'team-scm',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('team-scm-detail.edit', {
            parent: 'team-scm-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/team/team-scm-dialog.html',
                    controller: 'TeamScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Team', function(Team) {
                            return Team.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('team-scm.new', {
            parent: 'team-scm',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/team/team-scm-dialog.html',
                    controller: 'TeamScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('team-scm', null, { reload: 'team-scm' });
                }, function() {
                    $state.go('team-scm');
                });
            }]
        })
        .state('team-scm.edit', {
            parent: 'team-scm',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/team/team-scm-dialog.html',
                    controller: 'TeamScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Team', function(Team) {
                            return Team.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('team-scm', null, { reload: 'team-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('team-scm.delete', {
            parent: 'team-scm',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/team/team-scm-delete-dialog.html',
                    controller: 'TeamScmDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Team', function(Team) {
                            return Team.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('team-scm', null, { reload: 'team-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
