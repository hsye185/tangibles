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

        $scope.startCounter = 0;
        $scope.CORRECT = 1;
        $scope.INCORRECT = 2;
        $scope.UNATTEMPTED = 3; 
        $scope.PREFILLED = 4;
        $scope.CURRENT = 5;
        $scope.gameOver = false;

        $scope.currentStudent = $gameStateService.currentStudent;
        $scope.currentLevelId = $gameStateService.currentLevelId;
        $scope.currentModuleName = $gameStateService.currentModuleName;
        $scope.currentModuleWords = $gameStateService.currentModuleWords;
        $scope.levels = $gameStateService.levels;

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

        let level = $scope.levels[$scope.currentLevelId];
        let levelWords = []; 
        while(levelWords.length != level.wordCount){
            let index = Math.floor(Math.random() * $scope.currentModuleWords.length);
            let wordForIndex = $scope.currentModuleWords[index];
            if(levelWords.indexOf(wordForIndex) == -1){
                levelWords.push(wordForIndex);
            }
        }
        $scope.levelInfo = {
            words: levelWords,
            maxUndos: level.maxUndos,
            maxSpeaks: level.maxSpeaks,
            partialCompletionRatio: level.partialCompletionRatio
        };

        // $scope.levelInfo = $gameStateService.generateLevelInfo();
        $scope.wordList = $scope.levelInfo.words;
        $scope.maxSpeaks = $scope.levelInfo.maxSpeaks;
        $scope.maxUndos = $scope.levelInfo.maxUndos;
        $scope.partialCompletionRatio = $scope.levelInfo.partialCompletionRatio;
        //-------

        $scope.currentUndos = $scope.maxUndos;
        $scope.currentSpeaks = $scope.maxSpeaks;
        $scope.currentWordIndex = 0;
        $scope.currentWordSplit = $scope.wordList[$scope.currentWordIndex].split("");
        $scope.currentWordSequence = $scope.getEmptySequence($scope.currentWordSplit.length);
        $scope.currentWordProgressIndex = 0;

        //partial completion
        let completedWordLength = Math.round($scope.wordList[$scope.currentWordIndex].length * $scope.partialCompletionRatio);
        if(completedWordLength == $scope.wordList.length){
            completedWordLength--;
        }
        let wordsAdded = 0;
        while(wordsAdded < completedWordLength){
            let index = Math.floor(Math.random() *  $scope.wordList[$scope.currentWordIndex].length);
            if($scope.currentWordSequence[index].status == $scope.UNATTEMPTED){
                $scope.currentWordSequence[index].letter = $scope.currentWordSplit[index];
                $scope.currentWordSequence[index].status = $scope.PREFILLED;
                wordsAdded++;
            }
        }

        let jump = 0;
        while($scope.currentWordSequence[$scope.currentWordProgressIndex+jump].status == $scope.PREFILLED){
            jump++;
            if($scope.currentWordSequence.length == $scope.currentWordProgressIndex+jump){
                break;
            }
        }
        $scope.currentWordProgressIndex+=jump;
        $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.CURRENT;
        
        $scope.undoButton = function(){
            if($scope.gameOver){
                alert("Game Over! Please return to level select");
                return;
            }
            if($scope.currentUndos == 0){
                alert("You've ran out of Undos");
            }else{
                // if($scope.currentWordProgressIndex > 0){
                    
                //     $scope.currentUndos--;
                    

                //     let jump = 1;
                //     while($scope.currentWordSequence[$scope.currentWordProgressIndex-jump].status != $scope.PREFILLED){
                //         jump--;
                //         if($scope.currentWordProgressIndex-jump < 0){
                //             break;
                //         }
                //     }
                //     $scope.currentWordProgressIndex-=jump;
                //     $scope.currentWordSequence[$scope.currentWordProgressIndex].letter = " ";
                //     $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.UNATTEMPTED;
                // }

                // $scope.currentWordProgressIndex+=jump;
                $scope.currentUndos--;

                var i = $scope.currentWordSplit.length - 1;

                while (i > -1) {
                    if ($scope.currentWordSequence[i].status == $scope.INCORRECT) {
                            $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.UNATTEMPTED;
                            $scope.currentWordSequence[i].letter = " ";
                            $scope.currentWordSequence[i].status = $scope.CURRENT;
                            $scope.currentWordProgressIndex = i;
                            break;
                    }
                    i--;
                }
            }
            
        };
        $scope.quitButton = function(){
            $state.go("levelSelect");
        };
        $scope.speakButton = function(){
            if($scope.currentSpeaks>0){
                $scope.currentSpeaks--;
                Speech.init({
                rate : 0.5,
                });

                Speech.speak({
                    text: $scope.wordList[$scope.currentWordIndex],
                    onError: (e) => {console.log('sorry an error occured.', e)}, // optionnal error callback
                    onEnd: () => {console.log('your text has successfully been spoken.')} // optionnal onEnd callback
                })
            }else{
                alert("You've ran out of Speaks");
            }
            
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
                    var audio = new Audio('audio/Sonic.Ring.mp3');
                    audio.play();
                }else{
                    $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.INCORRECT;
                    var audio2 = new Audio('audio/wrong.mp3');
                    audio2.play();
                    if($scope.currentUndos == 0){
                        $scope.gameOver = true;
                        var millisecondsToWait = 100;
                        setTimeout(function() {
                           alert("Game Over: You've run out of Undos and have an error in your word");
                        }, millisecondsToWait);
                    }
                }
                
                //check if the letter added was the last one
                let wordFinished = true;
                for(let checkIndex = 0; checkIndex < $scope.currentWordSplit.length; checkIndex++){
                    if($scope.currentWordSequence[checkIndex].status == $scope.INCORRECT || $scope.currentWordSequence[checkIndex].status == $scope.UNATTEMPTED ){
                        wordFinished = false;
                        break;
                    }
                }
                $scope.$apply();
                if(wordFinished){
                    //checks if last letter was correct
                    if($scope.currentWordSequence[$scope.currentWordProgressIndex].status == $scope.CORRECT){
                 
                        var millisecondsToWait = 1000;
                        setTimeout(function() {
                            if($scope.currentWordIndex == $scope.wordList.length-1){

                                alert("Congratulations, you've completed level: "+($scope.currentLevelId+1));
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
                let jump = 1;
                while($scope.currentWordSequence[$scope.currentWordProgressIndex+jump].status == $scope.PREFILLED){
                    jump++;
                    if($scope.currentWordSequence.length == $scope.currentWordProgressIndex+jump){
                        break;
                    }
                }

                $scope.currentWordProgressIndex+=jump;
                if($scope.currentWordSequence[$scope.currentWordProgressIndex] < $scope.currentWordSequence.length - 1) {
                    $scope.currentWordSequence[$scope.currentWordProgressIndex].status = $scope.CURRENT;
                }
            }
            $scope.$apply();
        }

    }

    openNewDiagram(newVal, oldVal)
    {
        if(true)
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

            let libraryDef = {
                "_id": "M5q3SwPNcgCCKDWQL",
                "name": "Alphabet",
                "owner": "everyone",
                "images": {},
                "tangibles": {}
            };

            this.sharedData.diagramName = this.localDiagram.name;
            PubSub.publish('updateName', this.localDiagram.name);
            this.$scope.tangibleController.openDiagram(this.localDiagram, libraryDef, this.$tgImages);
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