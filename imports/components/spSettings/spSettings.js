import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spSettings.html';
import dialog from './spAddModuleDialog.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';
import {Modules} from '../../api/collections/modules.js';

class SPAddModuleDialogCtrl {
    constructor($scope, $mdDialog) {
        $scope.moduleName = "";
        $scope.newWord = "";
        $scope.words = [];
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
          $mdDialog.hide({
            name: $scope.moduleName,
            words: $scope.words
          });
        };
        $scope.addWord = function() {
            if($scope.words.indexOf($scope.newWord) == -1 && $scope.newWord != '') {
                $scope.words.push($scope.newWord);
            }
            $scope.newWord = '';
        }
        $scope.deleteWord = function(index) {   
            $scope.words.splice(index, 1);
        }    
    }
}
class SPSettingsCtrl {
    constructor($scope, $mdDialog) {
        'ngInject'; 
        let mod = Modules.find().fetch();
        alert("Found?");
        alert(mod.length);
        $scope.addModule = function(event){
            $mdDialog.show({
                controller: SPAddModuleDialogCtrl,
                template: dialog,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true
            })
            .then(function(answer) {
              alert('Module Name: ' + answer.name + ' words: '+answer.words);
              Meteor.call("modules.insert", answer);
              let mod = Modules.find().fetch();
                alert("Found?");
                alert(mod.length);
                alert(mod[0].name);
                alert(mod[1].name);
            }, function() {
              alert('You cancelled the dialog.');
            });
        }      
    }
}

const name = 'spSettings';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPSettingsCtrl,
        bindings: {library: '=', tangibles: '='}
    });