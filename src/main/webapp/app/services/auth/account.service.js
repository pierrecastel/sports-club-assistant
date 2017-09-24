(function() {
    'use strict';

    angular
        .module('scmApp')
        .factory('Account', Account);

    Account.$inject = ['$resource', 'DateUtils'];

    function Account ($resource, DateUtils) {
        var service = $resource('api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                },
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.birthDate = DateUtils.convertLocalDateFromServer(data.birthDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    var copy = angular.copy(data);
                    copy.birthDate = DateUtils.convertLocalDateToServer(copy.birthDate);
                    return angular.toJson(copy);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    var copy = angular.copy(data);
                    copy.birthDate = DateUtils.convertLocalDateToServer(copy.birthDate);
                    return angular.toJson(copy);
                }
            }
        });

        return service;
    }
})();
