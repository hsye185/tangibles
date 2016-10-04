import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spPlay.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';
import 'pubsub-js/src/pubsub';

class SPPlayCtrl {
    constructor($scope, $reactive, $stateParams, $tgImages, $state, $tgSharedData, $const) {
        'ngInject';
        $reactive(this).attach($scope);
        this.$tgImages = $tgImages;
        this.$const = $const;
        this.$state = $state;
        this.sharedData = $tgSharedData.data;
        this.tangibleController = new TangibleController('tangibleContainer');
        this.diagramId = Random.id();
        this.libraryId = this.$const.DEFAULT_LIBRARY_ID;
        this.isNewDiagram = "true";

        this.wordList = ["cab", "hat", "car", "shirt", "glass"];

        this.helpers({
            remoteDiagram: ()=> {
                return Diagrams.findOne({_id: this.getReactively('diagramId')});
            },
            remoteLibrary: ()=> {
                return Libraries.findOne({_id: this.getReactively('libraryId')});
            }
        });

        this.libraryWatch = $scope.$watch('spPlay.remoteLibrary', this.openNewDiagram.bind(this));


    }
    openNewDiagram(newVal, oldVal)
    {
        if(newVal != undefined && this.isNewDiagram)
        {
            this.libraryWatch(); //cancels watch
            this.localDiagram = {
                "_id": this.diagramId,
                "name": "Untitled",
                "library": {
                    "_id": this.libraryId
                },
                "image": "",
                "scale": 1.0,
                "position": {x:0, y:0},
                "tangibles": {}
            };

            this.sharedData.diagramName = this.localDiagram.name;
            PubSub.publish('updateName', this.localDiagram.name);
            this.tangibleController.openDiagram(this.localDiagram, angular.copy(newVal), this.$tgImages);
        }
    }

}

const name = 'spPlay';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPPlayCtrl,
        bindings: {library: '=', tangibles: '='}
    })