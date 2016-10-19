import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spPlay.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';
import 'pubsub-js/src/pubsub';
import Speech from 'speak-tts';

class SPPlayCtrl {
    constructor($scope, $reactive, $stateParams, $tgImages, $state, $tgSharedData, $const, $gameStateService) {
        'ngInject';
        $reactive(this).attach($scope);
        this.$scope = $scope;
        this.$tgImages = $tgImages;
        this.$const = $const;
        this.$state = $state;
        this.sharedData = $tgSharedData.data;
        
        this.diagramId = Random.id();
        this.libraryId = this.$const.DEFAULT_LIBRARY_ID;
        this.isNewDiagram = "true";
        $scope.startCounter = 0;
        $scope.CORRECT = 1;
        $scope.INCORRECT = 2;
        $scope.UNATTEMPTED = 3; 
        $scope.gameOver = false;

        var millisecondsToWait = 500;
        setTimeout(function() {
            // alert();
            $('#content').fadeIn(1000, function(){

            });
        }, millisecondsToWait, $scope);

        // this.wordList = ["cab", "hat", "car", "shirt", "glass"];

        $scope.getEmptySequence = function(length){
            let sequence = [];
            for(let i=0;i<length;i++){
                sequence.push({letter: " ", status: $scope.UNATTEMPTED});
            }
            return sequence;
        }

        //list passed in from level screen, or grade words passed in then random assigned 3 etc
        //------ PASSED IN FROM LEVEL SCREEEN
        $scope.levelInfo = $gameStateService.generateLevelInfo();
        $scope.wordList = $scope.levelInfo.words;
        $scope.maxUndos = $scope.levelInfo.maxUndos;
        //-------

        $scope.currentUndos = $scope.maxUndos;
        $scope.currentWordIndex = 0;
        $scope.currentWordSplit = $scope.wordList[$scope.currentWordIndex].split("");
        $scope.currentWordSequence = $scope.getEmptySequence($scope.currentWordSplit.length);
        $scope.currentWordProgressIndex = 0;

        $scope.undoButton = function(){
            if($scope.gameOver){
                alert("Game Over! Please return to level select");
                return;
            }
            if($scope.currentUndos == 0){
                alert("You've ran out of Undos");
            }else{
                $scope.currentWordProgressIndex--;
                $scope.currentUndos--;
                $scope.currentWordSequence[$scope.currentWordProgressIndex].letter = " ";
                $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.UNATTEMPTED;
            }
            
        };
        $scope.speakButton = function(){
            Speech.init({
                rate : 0.5,
            });

            Speech.speak({
                text: $scope.wordList[$scope.currentWordIndex],
                onError: (e) => {console.log('sorry an error occured.', e)}, // optionnal error callback
                onEnd: () => {console.log('your text has successfully been spoken.')} // optionnal onEnd callback
            })
        };
        $scope.addLetter = function(newLetter){
            if($scope.gameOver){
                alert("Game Over! Please return to level select");
                return;
            }
            //checkiflast last letter, trying to write
            if($scope.currentWordProgressIndex == $scope.currentWordSplit.length){
                alert("You can't add another letter, the word currently has errors");
            }else{

                $scope.currentWordSequence[$scope.currentWordProgressIndex].letter = newLetter;
                if(newLetter == $scope.currentWordSplit[$scope.currentWordProgressIndex]){
                    $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.CORRECT;
                }else{
                    $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.INCORRECT;
                    if($scope.currentUndos == 0){
                        $scope.gameOver = true;
                        var millisecondsToWait = 100;
                        setTimeout(function() {
                           alert("Game Over: You've run out of Undos and have an error in your word");
                        }, millisecondsToWait);
                        
                    }
                }
                
                //check if the letter added was the last one
                if($scope.currentWordProgressIndex == $scope.currentWordSplit.length-1){
                    //checks if last letter was correct
                    if($scope.currentWordSequence[$scope.currentWordProgressIndex].status == $scope.CORRECT){
                 
                        var millisecondsToWait = 100;
                        setTimeout(function() {
                             //check if no more words left in list
                            if($scope.currentWordIndex == $scope.wordList.length-1){
                                alert("Congratulations, you've completed level: 1");
                                $gameStateService.unlockNextLevel();
                                $state.go("levelSelect");
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
            $scope.$apply();
        }

        $scope.tangibleController = new TangibleController('tangibleContainer', this);

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
            this.$scope.tangibleController.openDiagram(this.localDiagram, angular.copy(newVal), this.$tgImages);
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