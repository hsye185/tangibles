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

        var millisecondsToWait = 10;
        setTimeout(function() {
            $('#botPanel').animate({height: '42.708333333333%'},1500,function(){
                $('#midPanel').animate({height: '20.442708333333%'},1000,function(){
                    $('#content').fadeIn(1000);
                });
                $('#topPanel').animate({height: '36.848958333333%'},1000);
            });
            
        }, millisecondsToWait, $scope);

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
                            $state.go("level_select");
                        });
                    });
                });
            });
        }

        $scope.gotoSetup = function(){
            $(function () {
                $('#settingsButton').fadeOut(1000);
                $('#playButton').fadeOut(1000);
                $('#creditsButton').fadeOut(1000);
                $('#quitButton').fadeOut(1000);
                $('#logo').fadeOut(1000);
                $('#title').fadeOut(1000);
                $('#subTitle').fadeOut(1000,function(){
                    $(function () {
                        $('#topPanel').animate({height: '93.489583333333%'},1000);
                        $('#midPanel').animate({top: '93.489583333333%', height: '3.90625%'},1000);
                        $('#botPanel').animate({bottom: '0%',height: '2.604166666667%'},1000, function(){
                            $state.go("setup");
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