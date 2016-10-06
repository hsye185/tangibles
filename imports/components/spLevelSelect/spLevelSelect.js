import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spLevelSelect.html';

class SPLevelSelectCtrl {
    constructor($scope, $reactive, $gameStateService, $state) {
        'ngInject'; 
        $reactive(this).attach($scope);
       $scope.playerName = $gameStateService.playerName;
       $scope.moduleName = $gameStateService.moduleName;
       $scope.moduleId = $gameStateService.moduleId;
       $scope.currentLevelId = $gameStateService.currentLevelId;
       $scope.levels = $gameStateService.levels;
       $scope.currentLevelBeingViewed = 0;
       $scope.currentScrollView = 1;


       $scope.updateLevelView = function(){
            if($scope.currentScrollView == 1){
                $scope.levelView = [$scope.levels[0], $scope.levels[1], $scope.levels[2]];
            }else if($scope.currentScrollView == $scope.levels.length-2){
                let last = $scope.levels.length-2;
                $scope.levelView = [$scope.levels[last-2], $scope.levels[last-1], $scope.levels[last]];
            }else{
                let current = $scope.currentScrollView;
                $scope.levelView = [$scope.levels[current-1], $scope.levels[current], $scope.levels[current+1]];
            }
       };
        $scope.leftButton = function(){
            $scope.currentScrollView--;
            $scope.updateLevelView();
            // $scope.$apply();
        };
        $scope.rightButton = function(){
            $scope.currentScrollView++;
            $scope.updateLevelView();
            // $scope.$apply();
        };

        $scope.levelClicked = function(level){
            $scope.currentLevelBeingViewed = level.number-1;
        };

        $scope.levelView = [];
        $scope.updateLevelView();

        $scope.getNumberForLevel = function(){
            return this.numberToWord(currentLevelBeingViewed+1);
        };

        $scope.startLevel = function(){
            $scope.currentLevelId = $scope.currentLevelBeingViewed;
            $state.go("play");
        }

    }

    numberToWord(){
       
    }

}

const name = 'spLevelSelect';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPLevelSelectCtrl,
        bindings: {library: '=', tangibles: '='}
    })