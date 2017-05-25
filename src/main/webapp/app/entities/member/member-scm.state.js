(function() {
    'use strict';

    angular
        .module('scmApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('member-scm', {
            parent: 'entity',
            url: '/member-scm',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.member.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/member/membersscm.html',
                    controller: 'MemberScmController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('member');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('member-scm-detail', {
            parent: 'member-scm',
            url: '/member-scm/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'scmApp.member.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/member/member-scm-detail.html',
                    controller: 'MemberScmDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('member');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Member', function($stateParams, Member) {
                    return Member.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'member-scm',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('member-scm-detail.edit', {
            parent: 'member-scm-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-scm-dialog.html',
                    controller: 'MemberScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Member', function(Member) {
                            return Member.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('member-scm.new', {
            parent: 'member-scm',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-scm-dialog.html',
                    controller: 'MemberScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                phoneNumber: null,
                                mobilePhoneNumber: null,
                                photo: null,
                                photoContentType: null,
                                birthDate: null,
                                job: null,
                                showInfo: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('member-scm', null, { reload: 'member-scm' });
                }, function() {
                    $state.go('member-scm');
                });
            }]
        })
        .state('member-scm.edit', {
            parent: 'member-scm',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-scm-dialog.html',
                    controller: 'MemberScmDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Member', function(Member) {
                            return Member.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('member-scm', null, { reload: 'member-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('member-scm.delete', {
            parent: 'member-scm',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-scm-delete-dialog.html',
                    controller: 'MemberScmDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Member', function(Member) {
                            return Member.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('member-scm', null, { reload: 'member-scm' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
