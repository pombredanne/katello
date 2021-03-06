/**
 * Copyright 2015 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc object
 * @name  Bastion.errata.controller:ApplyErrataController
 *
 * @requires $scope
 * @requires $window
 * @requires translate
 * @requires ContentHostBulkAction
 * @requires ContentViewVersion
 * @requires CurrentOrganization
 *
 * @description
 *   Display confirmation screen and apply Errata.
 */
angular.module('Bastion.errata').controller('ApplyErrataController',
    ['$scope', '$window', 'translate', 'ContentHostBulkAction', 'ContentViewVersion', 'CurrentOrganization',
        function ($scope, $window, translate, ContentHostBulkAction, ContentViewVersion, CurrentOrganization) {
            var applyErrata, incrementalUpdate;

            $scope.successMessages = [];
            $scope.errorMessages = [];

            incrementalUpdate = function () {
                var success, error, params = {};

                params['add_content'] = {
                    'errata_ids': $scope.errataIds
                };

                params['content_view_version_environments'] = [];
                params['propagate_to_composites'] = true;

                angular.forEach($scope.updates, function (update) {
                    var incrementalUpdate = {
                        'content_view_version_id': update['content_view_version'].id,
                        'environment_ids': _.pluck(update.environments, 'id')
                    };

                    params['content_view_version_environments'].push(incrementalUpdate);
                });

                success = function (response) {
                    $window.location.href = '/foreman_tasks/tasks/' + response['id'];
                };

                error = function (response) {
                    $scope.errorMessages = response.errors;
                };

                ContentViewVersion.incrementalUpdate(params, success, error);
            };

            applyErrata = function () {
                var params = $scope.selectedContentHosts, success, error;

                params['content_type'] = 'errata';
                params.content = $scope.errataIds;
                params['organization_id'] = CurrentOrganization;

                success = function () {
                    $scope.transitionTo('errata.index');
                    $scope.successMessages = [translate("Successfully scheduled installation of errata")];
                };

                error = function (data) {
                    $scope.errorMessages = data.errors;
                };

                ContentHostBulkAction.installContent(params, success, error);
            };

            $scope.errorMessages = [];
            $scope.successMessages = [];

            if ($scope.$stateParams.hasOwnProperty('errataId')) {
                $scope.errataIds = [$scope.$stateParams.errataId];
            } else {
                if ($scope.selectedErrata) {
                    $scope.errataIds = $scope.selectedErrata.included.ids;
                }
            }

            if ($scope.selectedContentHosts) {
                $scope.selectedContentHosts['errata_ids'] = $scope.errataIds;
                $scope.selectedContentHosts['organization_id'] = CurrentOrganization;
                ContentHostBulkAction.availableIncrementalUpdates($scope.selectedContentHosts, function (updates) {
                    $scope.updates = updates;
                });
            }

            $scope.confirmApply = function () {
                if ($scope.updates.length === 0) {
                    applyErrata();
                } else {
                    incrementalUpdate();
                }
            };
        }
    ]);
