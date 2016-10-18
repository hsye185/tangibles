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
        $scope.module = '';

        $scope.submit = function() {
            setTimeout(function() {
                $scope.modules = Modules.find({}).fetch();
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
            }, 100, $scope);
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