import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spHome.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';

class SPHomeCtrl {
    constructor($scope, $reactive, $stateParams, $tgImages, $state, $tgSharedData, $const) {
        'ngInject';
        $reactive(this).attach($scope);
        this.$scope = $scope;
        this.$state = $state;
        $scope.gotoSettings = function(){
            $(function () {
                $('#settingsButton').fadeOut(1000);
                $('#playButton').fadeOut(1000);
                $('#creditsButton').fadeOut(1000);
                $('#quitButton').fadeOut(1000);
                $('#logo').fadeOut(1000);
                $('#title').fadeOut(1000);
                $('#subTitle').fadeOut(1000,function(){
                    window.location="#/settings";
                });
            });
        }

        $scope.gotoLevelSelection = function(){
            $(function () {
                $('#settingsButton').fadeOut(1000);
                $('#playButton').fadeOut(1000);
                $('#creditsButton').fadeOut(1000);
                $('#quitButton').fadeOut(1000);
                $('#logo').fadeOut(1000);
                $('#title').fadeOut(1000);
                $('#subTitle').fadeOut(1000,function(){
                    $(function () {
                        $('#topPanel').animate({height: '62.5%'},1000);
                        $('#midPanel').animate({top: '62.5%', height: '7.8125%'},1000);
                        $('#botPanel').animate({top: '70.3125%',height: '29.6875%'},1000, function(){
                            window.location="#/play";
                        });
                    });
                });
            });
        }

        $scope.gotoCredits = function(){
            
        }
    }
}

const name = 'spHome';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPHomeCtrl,
        bindings: {library: '=', tangibles: '='}
    });