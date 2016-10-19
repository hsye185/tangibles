import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import angularUiRouter from 'angular-ui-router';
import spellingApp from '../imports/components/spHome/spHome';
import setup from '../imports/components/spSetup/spSetup';
import settings from '../imports/components/spSettings/spSettings';
import play from '../imports/components/spPlay/spPlay';
import levelSelect from '../imports/components/spLevelSelect/spLevelSelect';
import home from '../imports/components/tgHome/tgHome';
import diagram from '../imports/components/tgDiagram/tgDiagram';
import libraries from '../imports/components/tgLibraries/tgLibraries';
import entries from 'object.entries';
import 'pubsub-js/src/pubsub';
import {Images} from '../imports/components/tgImages/tgImages';
import { Accounts } from 'meteor/accounts-base';
import {Modules} from '../imports/api/collections/modules.js';

if (!Object.entries) {
    entries.shim();
}

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
});

angular.module('tangibles', [angularMeteor, ngMaterial, ngAnimate, 'ui.router', 'accounts.ui', home.name, diagram.name, libraries.name, spellingApp.name, setup.name, settings.name, play.name, levelSelect.name])
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
            },
            modules: function($rootScope) {
                'ngInject';
                return $rootScope.subscribe('modules');
            },
            students: function($rootScope) {
                'ngInject';
                return $rootScope.subscribe('students');
            }
        };

        // $urlRouterProvider.otherwise('home/diagram///');
        $urlRouterProvider.otherwise('spelling_app');

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
            .state('settings', {
                 url: "/settings",
                 views: {
                     'main-view': {
                         component: settings.name
                     }
                 },
                 resolve: resolve
             })
            .state('levelSelect', {
                 url: "/level_select",
                 views: {
                     'main-view': {
                         component: levelSelect.name
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
            .state('play', {
                url: "/play",
                views: {
                    'main-view': {
                        component: play.name
                    }
                },
                resolve: resolve,
                onEnter: ['$tgSharedData', function ($tgSharedData) {
                    $tgSharedData.data.stateName = 'play';
                }]
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
}).service('$gameStateService', function () {
    this.currentStudent = {};
    this.currentModuleName = "Grade 4";
    this.currentModuleWords = [];
    this.currentLevelId = 0;
    this.levels = [
    {
        number: 1,
        wordCount: 1,
        maxUndos: 3,
        maxSpeaks: 3,
        partialCompletionRatio: 0.5
    },
    {
        number: 2,
        wordCount: 2,
        maxUndos: 4,
        maxSpeaks: 5,
        partialCompletionRatio: 0.3
    },
    {
        number: 3,
        wordCount: 2,
        maxUndos: 5,
        maxSpeaks: 6,
        partialCompletionRatio: 0
    },
    {
        number: 4,
        wordCount: 4,
        maxUndos: 1,
        maxSpeaks: 10,
        partialCompletionRatio: 0.2
    },
    {
        number: 5,
        wordCount: 3,
        maxUndos: 0,
        maxSpeaks: 1,
        partialCompletionRatio: 0.5
    },
    {
        number: 6,
        wordCount: 5,
        maxUndos: 3,
        maxSpeaks: 6,
        partialCompletionRatio: 0
    },
    {
        number: 7,
        wordCount: 6,
        maxUndos: 2,
        maxSpeaks: 6,
        partialCompletionRatio: 0
    },
    {
        number: 8,
        wordCount: 8,
        maxUndos: 5,
        maxSpeaks: 12,
        partialCompletionRatio: 0
    },
    {
        number: 9,
        wordCount: 10,
        maxUndos: 2,
        maxSpeaks: 10,
        partialCompletionRatio: 0
    }
    ];
    this.generateLevelInfo = function(){
        let level = this.levels[this.currentLevelId];
        let levelWords = []; 
        while(levelWords.length != level.wordCount){
            let index = Math.floor(Math.random() * this.currentModuleWords.length);
            let wordForIndex = this.currentModuleWords[index];
            if(levelWords.indexOf(wordForIndex) == -1){
                levelWords.push(wordForIndex);
            }
        }
        let levelInformation = {
            words: levelWords,
            maxUndos: level.maxUndos,
            maxSpeaks: level.maxSpeaks,
            partialCompletionRatio: level.partialCompletionRatio
        };
        return levelInformation;
    };
    this.unlockNextLevel = function(){
        this.currentLevelId++;
        if(this.currentLevelId < this.levels.length ){
            (this.currentStudent.moduleProgress[this.currentModuleName])[this.currentLevelId] = 1;
            Meteor.call("students.updateModuleProgress", this.currentStudent);
        }
        
    };
})
.service('$tgImages', Images)
.filter("getStatusForNumber", function(){
   return function(n){
        let statuses = ["Locked", "Incomplete", "Completed", "Failed"];
        return statuses[n];
    }
})
.filter("getWordForNumber", function(){
   return function(N){
    // Source : http://www.webdeveloper.com/forum/showthread.php?282013-Converting-numbers-to-words-in-document-write
    var words = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
       var str = '';
      if (N >= words.length) {
        if ((N >= 1000) && (N < 10000)) { n = parseInt(N/1000); str += words[n]+'-thousand '; N -= n * 1000; }
        if ((N >= 100)  && (N < 1000) ) { n = parseInt(N/100); str += words[n]+'-hundred '; N -= n * 100; }
        if ((N > 0)  && (N < 20)) { str += words[N]; }
        if ((N > 19) && (N < 30)) { str += 'twenty';  if (N > 20) { str += '-'+words[N-20]; } }
        if ((N > 29) && (N < 40)) { str += 'thirty';  if (N > 30) { str += '-'+words[N-30]; } }
        if ((N > 39) && (N < 50)) { str += 'fourty';  if (N > 40) { str += '-'+words[N-40]; } }
        if ((N > 49) && (N < 60)) { str += 'fifty';   if (N > 50) { str += '-'+words[N-50]; } }
        if ((N > 59) && (N < 70)) { str += 'sixty';   if (N > 60) { str += '-'+words[N-60]; } }
        if ((N > 69) && (N < 80)) { str += 'seventy'; if (N > 70) { str += '-'+words[N-70]; } }
        if ((N > 79) && (N < 90)) { str += 'eighty';  if (N > 80) { str += '-'+words[N-80]; } }
        if ((N > 89) && (N < 100)) { str += 'ninety'; if (N > 90) { str += '-'+words[N-90]; } }
      } else { str = words[N].charAt(0).toUpperCase() + words[N].slice(1); }
      return str.charAt(0).toUpperCase() + str.slice(1);
       }
});

function onReady() {
    angular.bootstrap(document, ['tangibles'], {strictDi: true});
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}