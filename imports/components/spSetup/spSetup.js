import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spSetup.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';
import {Modules} from '../../api/collections/modules.js';

class SPSetupCtrl {
    constructor($scope, $reactive, $gameStateService, $state) {
        'ngInject';
        $reactive(this).attach($scope);

        $scope.modules = [];
        this.subscribe('modules');
        this.helpers({
            modules() {
                return Modules.find({});
            }
        });
        var millisecondsToWait = 100;
        setTimeout(function() {
            let moduleList = Modules.find({}).fetch();
            let strings = [];
            for(let i = 0; i<moduleList.length; i++){
                $scope.modules.push(moduleList[i]);
            }
            // Meteor.call("modules.deleteEntireCollection", null);
            $scope.$apply();
            // $scope.modules = cursor.toArray();
        }, millisecondsToWait, $scope);

        var millisecondsToWait2 = 250;
        setTimeout(function() {
            $('#content').fadeIn(1000);
        }, millisecondsToWait2, $scope);

        $scope.$gameStateService = $gameStateService;

        $scope.playerName = '';
        $scope.module = '';

        $scope.submit = function() {
            $scope.$gameStateService.playerName = $scope.playerName;
            $scope.$gameStateService.moduleName = $scope.module.name;

            for (var i = 0; i < $scope.modules.length; i++) {
                    if ($scope.modules[i].name == $scope.module.name) {
                        $scope.$gameStateService.moduleId = $scope.modules[i]._id;
                        break;
                    }
            }

            $(function () {
                $('#content').fadeOut(1000,function(){
                    $(function () {
                        // alert();
                        $('#topPanel').animate({height: '62.5%'},1000);
                        $('#midPanel').animate({top: '62.5%', height: '7.8125%'},1000);
                        $('#botPanel').animate({top: '70.3125%',height: '29.6875%'},1000, function(){
                            $state.go("levelSelect");
                        });
                    });
                });
            });
        }

        $scope.gotoHome = function(){
            $('#content').fadeOut(1000,function(){
                $state.go("spelling_app")
            })

        }

    }

}

const name = 'spSetup';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPSetupCtrl,
        bindings: {library: '=', tangibles: '='}
    });