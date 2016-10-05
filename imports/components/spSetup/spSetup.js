import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spSetup.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';
import {Modules} from '../../api/collections/modules.js';
import Speech from 'speak-tts';

class SPSetupCtrl {
    constructor($scope, $reactive) {
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

        $scope.playerName = '';
        $scope.selectedModule = $scope.modules[0];

        $scope.$watch(function($scope) { return $scope.playerName },
            function() {

            });
        $scope.$watch(function($scope) { return $scope.selectedModule },
            function() {

            });

    }

    speak() {
        //speak('hello world', {format:'mp3', filename:'/tmp/hello_world'});
        
        Speech.init();

        Speech.speak({
            text: 'Hello, how are you today ?',
            onError: (e) => {console.log('sorry an error occured.', e)}, // optionnal error callback
            onEnd: () => {console.log('your text has successfully been spoken.')} // optionnal onEnd callback
        })
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