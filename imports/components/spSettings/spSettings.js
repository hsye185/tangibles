import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularUiRouter from 'angular-ui-router';
import template from './spSettings.html';
import dialog from './spAddModuleDialog.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';
import {Modules} from '../../api/collections/modules.js';
import lodash from 'lodash';

class SPAddModuleDialogCtrl {
    constructor($scope, $mdDialog, $reactive, dialogName, moduleBeingEdited, backgroundIndex) {
        $reactive(this).attach($scope);
        $scope.dialogName = dialogName;
        $scope.backgroundIndex = backgroundIndex;
        $scope.newWord = "";
        $scope.currentModule = {
            _id: Random.id(),
            name: 'List Name',
            words: []
        };
        if(moduleBeingEdited){
            let wordsCopy = [];
            for(word of moduleBeingEdited.words){
                wordsCopy.push(word);
            }
            $scope.currentModule = {
                _id: moduleBeingEdited._id,
                name: moduleBeingEdited.name,
                words: wordsCopy
            };
        }
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function() {
            // moduleBeingEdited = {
            //     _id: $scope.currentModule._id,
            //     name: $scope.currentModule.name,
            //     words: $scope.currentModule.words
            // };
            $mdDialog.hide($scope.currentModule);

        };
        $scope.addWord = function() {
            let word = $scope.newWord.toLowerCase();
            if($scope.currentModule.words.indexOf(word) == -1 && word != '') {
                $scope.currentModule.words.push(word);
            }
            $scope.newWord = '';
        }
        $scope.deleteWord = function(index) {   
            $scope.currentModule.words.splice(index, 1);
        }  
    }
}
class SPSettingsCtrl {
    constructor($scope, $mdDialog, $reactive) {
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
        $scope.addModule = function(event, index){
            $mdDialog.show({
                controller: SPAddModuleDialogCtrl,
                template: dialog,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                locals : {
                    dialogName: "List Name",
                    moduleBeingEdited: null,
                    backgroundIndex: index
                }
            })
            .then(function(answer) {
                Meteor.call("modules.insert", answer);
                $scope.modules.push(answer);
            }, function() {
              
            });

        }
        $scope.editModule = function(module,index){
            // alert(module.name);
            index = index % 6;
            $mdDialog.show({
                controller: SPAddModuleDialogCtrl,
                template: dialog,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                locals : {
                    dialogName: 'Edit Module',
                    moduleBeingEdited: module,
                    backgroundIndex: index
                }
            })
            .then(function(answer) {
                Meteor.call("modules.updateModule", answer);
                let index = $scope.modules.indexOf(module);
                $scope.modules.splice(index,1);
                $scope.modules.push(answer);
            }, function() {
                if(!$scope.$$phase) {
                  $scope.$apply();
                }
              
            });
        }
        $scope.deleteModule = function(module){
            var confirm = $mdDialog.confirm()
                  .title('Delete Module?')
                  .textContent("Are you sure you would like to delete Module: '"+module.name+"'")
                  .ariaLabel('Lucky day')
                  .ok('Yes')
                  .cancel('No');

            $mdDialog.show(confirm).then(function() {
                Meteor.call("modules.deleteModule", module._id);
                let index = $scope.modules.indexOf(module);
                $scope.modules.splice(index,1);
            }, function() {
                 
            });            
        }
        $scope.getNextBackgroundNumber = function(index){
            var i = index % 6;
          return i;
        }   
    }
}

const name = 'spSettings';
export default angular.module(name, [angularMeteor, 'ui.router'])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPSettingsCtrl,
        bindings: {library: '=', tangibles: '='}
    });