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
        this.$scope = $scope;
        this.$tgImages = $tgImages;
        this.$const = $const;
        this.$state = $state;
        this.sharedData = $tgSharedData.data;
        this.tangibleController = new TangibleController('tangibleContainer');
        this.diagramId = Random.id();
        this.libraryId = this.$const.DEFAULT_LIBRARY_ID;
        this.isNewDiagram = "true";
        $scope.CORRECT = 1;
        $scope.INCORRECT = 2;
        $scope.UNATTEMPTED = 3; 

        // this.wordList = ["cab", "hat", "car", "shirt", "glass"];

        $scope.getEmptySequence = function(length){
            let sequence = [];
            for(let i=0;i<length;i++){
                sequence.push({letter: " ", status: $scope.UNATTEMPTED});
            }
            return sequence;
        }

        this.helpers({
            remoteDiagram: ()=> {
                return Diagrams.findOne({_id: this.getReactively('diagramId')});
            },
            remoteLibrary: ()=> {
                return Libraries.findOne({_id: this.getReactively('libraryId')});
            }
        });

        this.libraryWatch = $scope.$watch('spPlay.remoteLibrary', this.openNewDiagram.bind(this));

        //list passed in from level screen, or grade words passed in then random assigned 3 etc
        $scope.wordList = ["super", "shirt"];
        $scope.currentUndos = 3;
        $scope.maxUndos = 3;
        $scope.currentWordIndex = 0;

        $scope.currentWordSplit = $scope.wordList[$scope.currentWordIndex].split("");
        $scope.currentWordSequence = $scope.getEmptySequence($scope.currentWordSplit.length);
        $scope.currentWordProgressIndex = 0;

       

        $scope.undoButton = function(){
            if($scope.undoCount == 0){

            }
            $scope.currentWordProgressIndex--;
            $scope.currentWordSequence[$scope.currentWordProgressIndex].letter = " ";
            $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.UNATTEMPTED;
        };
        $scope.speakButton = function(){
            // $scope.currentProgress.push({letter: "e", isCorrect: true});
        }
        $scope.addLetter = function(newLetter){
            //checkiflast last letter, trying to write
            if($scope.currentWordProgressIndex == $scope.currentWordSplit.length){
                alert("You can't add another letter, the word currently has errors");
            }else{

                $scope.currentWordSequence[$scope.currentWordProgressIndex].letter = newLetter;
                if(newLetter == $scope.currentWordSplit[$scope.currentWordProgressIndex]){
                    $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.CORRECT;
                }else{
                    $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.INCORRECT;
                }
                
                //check if the letter added was the last one
                if($scope.currentWordProgressIndex == $scope.currentWordSplit.length-1){
                    //checks if last letter was correct
                    if($scope.currentWordSequence[$scope.currentWordProgressIndex].status == $scope.CORRECT){
                 
                        var millisecondsToWait = 100;
                        setTimeout(function() {
                             //check if no more words left in list
                            if($scope.currentWordIndex == $scope.wordList.length-1){
                                alert("Congratulations, you've completed level: X");
                                //ADD CODE TO LEVEL UP AND GO BACK TO LEVEL SCREEN
                            }else{
                                alert("Good Job! Next Word");
                                $scope.currentWordIndex++;
                                $scope.currentWordSplit = $scope.wordList[$scope.currentWordIndex].split("");
                                $scope.currentWordSequence = $scope.getEmptySequence($scope.currentWordSplit.length);
                                $scope.currentWordProgressIndex = 0;
                                $scope.$apply();
                            }
                            
                            
                        }, millisecondsToWait, $scope);
                    }
                }
                $scope.currentWordProgressIndex++;
            }
        }

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