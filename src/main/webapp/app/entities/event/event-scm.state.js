(function() {
    'use strict';

    angular
        .module('scmApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('event-scm', {
            parent: 'entity',
            url: '/event-scm?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.event.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/event/eventsscm.html',
                    controller: 'EventScmController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('event');
                    $translatePartialLoader.addPart('eventType');
                    $translatePartialLoader.addPart('eventState');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('event-scm-detail', {
            parent: 'event-scm',
            url: '/event-scm/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.event.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/event/event-scm-detail.html',
                    controller: 'EventScmDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('event');
                    $translatePartialLoader.addPart('eventType');
                    $translatePartialLoader.addPart('eventState');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Event', function($stateParams, Event) {
                    return Event.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'event-scm',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('event-scm-detail.edit', {
            parent: 'event-scm-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/event/event-scm-dialog.html',
                    controller: 'EventScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Event', function(Event) {
                            return Event.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('event-scm.new', {
            parent: 'event-scm',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/event/event-scm-dialog.html',
                    controller: 'EventScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,
                                type: null,
                                date: null,
                                state: null,
                                numberOfPlaces: null,
                                isHome: null,
                                comment: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('event-scm', null, { reload: 'event-scm' });
                }, function() {
                    $state.go('event-scm');
                });
            }]
        })
        .state('event-scm.edit', {
            parent: 'event-scm',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/event/event-scm-dialog.html',
                    controller: 'EventScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Event', function(Event) {
                            return Event.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('event-scm', null, { reload: 'event-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('event-scm.delete', {
            parent: 'event-scm',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/event/event-scm-delete-dialog.html',
                    controller: 'EventScmDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Event', function(Event) {
                            return Event.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('event-scm', null, { reload: 'event-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
