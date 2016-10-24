import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spSetup.html';
import {Modules} from '../../api/collections/modules.js';
import {Students} from '../../api/collections/students.js';

class SPSetupCtrl {
    constructor($scope, $reactive, $gameStateService, $state) {
        'ngInject';
        $reactive(this).attach($scope);

        $scope.modules = [];
        this.subscribe('students');
        this.helpers({
            modules() {
                return Modules.find({});
            }
        });

        setTimeout(function() {
            $scope.modules = Modules.find({}).fetch();
            $scope.$apply();
        }, 100, $scope);

        var millisecondsToWait2 = 250;
        setTimeout(function() {
            $('#content').fadeIn(1000);
        }, millisecondsToWait2, $scope);

        $scope.$gameStateService = $gameStateService;
        $scope.playerName = ''; 
        $scope.module = null;

        $scope.submit = function() {
            setTimeout(function() {
                if($scope.playerName.length > 0 && $scope.module != null){
                    let pName = $scope.playerName.toLowerCase();
                    let chosenModuleName = $scope.module.name;
                    let student = Students.findOne({_id: pName});
                    if(!student){
                        student = {
                            _id: pName,
                            moduleProgress: {}
                        };
                        student.moduleProgress[chosenModuleName] = [1,0,0,0,0,0,0,0,0];
                        Meteor.call("students.insert", student);
                    }else{
                        if(!student.moduleProgress[chosenModuleName]){
                            student.moduleProgress[chosenModuleName] = [1,0,0,0,0,0,0,0,0];
                            Meteor.call("students.updateModuleProgress", student);
                        }
                    }
                    let words = Modules.findOne({name: chosenModuleName});
                    for(m of $scope.modules){
                        if(m.name == chosenModuleName){
                            $scope.$gameStateService.currentModuleWords = m.words;
                            break;
                        }
                    }
                    $scope.$gameStateService.currentStudent = student;
                    $scope.$gameStateService.currentModuleName = chosenModuleName;
                }
            }, 100, $scope);
            if($scope.playerName.length > 0 && $scope.module != null){
                $(function () {
                    $('#content').fadeOut(1000,function(){
                        $(function () {
                            // alert();

                            topHeight = window.innerHeight - 140;
                            midHeight = window.innerHeight - 40;
                            $('#topPanelAlpha').animate({height: '100px'},1000);
                            $('#topPanel').animate({top: '100px', height: topHeight},1000);
                            $('#midPanel').animate({bottom: '0px', left: '0px', height: '40px', width: '25%'},1000);
                            $('#botPanel').animate({bottom: '0px', left: '25%', width: '75%', height: '40px'},1000, function(){
                                $gameStateService.isOnline = true;
                                $state.go("levelSelect");
                            });
                        });
                    });
                });
            }
            
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