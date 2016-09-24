import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import angularUiRouter from 'angular-ui-router';
import spellingApp from '../imports/components/spHome/spHome';
import setup from '../imports/components/spSetup/spSetup';
import home from '../imports/components/tgHome/tgHome';
import diagram from '../imports/components/tgDiagram/tgDiagram';
import libraries from '../imports/components/tgLibraries/tgLibraries';
import entries from 'object.entries';
import 'pubsub-js/src/pubsub';
import {Images} from '../imports/components/tgImages/tgImages';
import { Accounts } from 'meteor/accounts-base';

if (!Object.entries) {
    entries.shim();
}

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
});

angular.module('tangibles', [angularMeteor, ngMaterial, 'ui.router', 'accounts.ui', home.name, diagram.name, libraries.name, spellingApp.name, setup.name])
    .constant("$const", {
        "APP": "Tangibles",
        "NEW": "New diagram",
        "OPEN": "Open diagram",
        "RENAME": "Rename diagram",
        "COPY": "Copy diagram",
        "LIBRARIES": "Libraries",
        "LIBRARY": "Library",
        "DEFAULT_LIBRARY_ID": "M5q3SwPNcgCCKDWQL",
        "DEFAULT_IMAGE_URL": __meteor_runtime_config__.ROOT_URL + 'images/stamp.png'
    })
    .config(function ($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider, $const) {
        'ngInject';
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('light-green');

        $mdIconProvider
            .icon('tg:tangibles', '/images/stamp.svg')
            .icon('tg:to_front', '/images/to_front.svg')
            .icon('tg:to_back', '/images/to_back.svg')
            .icon('file:ic_folder_open', '/images/ic_folder_open_black_48px.svg')
            .icon('action:ic_delete_sweep', '/images/ic_delete_sweep_black_48px.svg')
            .icon('action:ic_power_settings_new', '/images/ic_power_settings_new_black_48px.svg')
            .icon('action:ic_zoom_in', '/images/ic_zoom_in_black_48px.svg')
            .icon('action:ic_zoom_out', '/images/ic_zoom_out_black_48px.svg')
            .icon('action:ic_delete', '/images/ic_delete_black_48px.svg')
            .icon('hardware:ic_keyboard_arrow_up', '/images/ic_keyboard_arrow_up_black_48px.svg')
            .icon('hardware:ic_keyboard_arrow_down', '/images/ic_keyboard_arrow_down_black_48px.svg')
            .icon('content:ic_add', '/images/ic_add_black_48px.svg')
            .icon('content:ic_save', '/images/ic_save_black_48px.svg')
            .icon('content:ic_content_copy', '/images/ic_content_copy_black_48px.svg')
            .icon('navigation:ic_close', '/images/ic_close_black_48px.svg')
            .icon('av:ic_library_books', '/images/ic_library_books_black_48px.svg');

        let resolve = {
            libraries: function ($rootScope) {
                'ngInject';
                return $rootScope.subscribe('libraries');
            },
            images: function ($rootScope) {
                'ngInject';
                return $rootScope.subscribe('images');
            },
            diagrams: function ($rootScope) {
                'ngInject';
                return $rootScope.subscribe('diagrams');
            }
        };

        $urlRouterProvider.otherwise('home/diagram///');

        $stateProvider
            .state('home', {
                url: "/home",
                abstract: true,
                views: {
                    'main-view': {
                        component: home.name
                    }
                },
                resolve: resolve
            })
            .state('spelling_app', {
                url: "/spelling_app",
                views: {
                    'main-view': {
                        component: spellingApp.name
                    }
                },
                resolve: resolve
            })
            .state('setup', {
                url: "/setup",
                views: {
                    'main-view': {
                        component: setup.name
                    }
                },
                resolve: resolve
            })
            .state('home.diagram', {
                url: "/diagram/:diagramId/:isNewDiagram/:libraryId",
                views: {
                    'home-view': {
                        component: diagram.name
                    }
                },
                onEnter: ['$tgSharedData', function ($tgSharedData) {
                    $tgSharedData.data.stateName = 'home.diagram';
                }]
            })
            .state('home.libraries', {
                url: "/libraries",
                views: {
                    'home-view': {
                        component: libraries.name
                    }
                },
                onEnter: ['$tgSharedData', function ($tgSharedData) {
                    $tgSharedData.data.stateName = 'home.libraries';
                }]
        });

    }).factory('$tgSharedData', function () {
    let service = {
        data: {
            stateName: '',
            diagramName: ''
        }
    };
    return service;
}).service('$tgImages', Images);

function onReady() {
    angular.bootstrap(document, ['tangibles'], {strictDi: true});
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}