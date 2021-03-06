/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 **/

/**
 * @ngdoc service
 * @name  Bastion.content-views.factory:Filter
 *
 * @requires BastionResource
 *
 * @description
 *   Provides a BastionResource for interacting with content view filters.
 */
angular.module('Bastion.content-views').factory('Filter',
    ['BastionResource', function (BastionResource) {

        return BastionResource('/katello/api/v2/content_view_filters/:filterId/:action',
            {filterId: '@id', 'content_view_id': '@content_view.id'},
            {
                update: {method: 'PUT'},
                availableErrata: {
                    method: 'GET',
                    params: {action: 'available_errata'}
                },
                errata: {
                    method: 'GET',
                    params: {action: 'errata'}
                },
                availablePackageGroups: {
                    method: 'GET',
                    params: {action: 'available_package_groups'}
                },
                packageGroups: {
                    method: 'GET',
                    params: {action: 'package_groups'}
                }
            }
        );

    }]
);
