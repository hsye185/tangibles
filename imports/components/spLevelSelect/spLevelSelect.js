import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spLevelSelect.html';

class SPLevelSelectCtrl {
    constructor($scope, $reactive, $gameStateService, $state) {
        'ngInject'; 
        $reactive(this).attach($scope);
       $scope.playerName = $gameStateService.currentStudent._id;
       $scope.moduleName = $gameStateService.currentModuleName;
       $scope.currentLevelId = $gameStateService.currentLevelId;
       $scope.levels = $gameStateService.levels;
       $scope.currentLevelBeingViewed = 0;
       $scope.currentScrollView = 1;

       var millisecondsToWait3 = 50;
        setTimeout(function() {
            var heightTop = $('#topPanel').height();
            var heightTopInner = 480;
            var scale = heightTop / heightTopInner;

            $('#topContent').css(
                {'-ms-transform': 'scale('+scale+')', 
                '-webkit-transform': 'scale('+scale+')', 
                'transform': 'scale('+scale+')'
            });

            var heightBottom = $('#botPanel').height();
            var heightBotInner = 228; 
            var scale2 = heightBottom / heightBotInner; 

            $('#levelSection').css(
                {'-ms-transform': 'scale('+scale2+')', 
                '-webkit-transform': 'scale('+scale2+')', 
                'transform': 'scale('+scale2+')'
            });

        }, millisecondsToWait3, $scope);

       var millisecondsToWait2 = 100;
        setTimeout(function() {
            $('#content').fadeIn(1000);
        }, millisecondsToWait2, $scope);

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
            $('#content').fadeOut(1000,function(){
                $(function () {
                    // alert();
                    var newHeight = $('#content').height() - 30;
                    var newWidth = $('#content').width() - 30;
                    $('#topPanel').animate({height: newHeight, width: newWidth, top: '15px', left: '15px'},1000);
                    // $('#topPanel').animate({height: 'calc(100% - 30px)', width: 'calc(100% - 30px)'},1000);
                    $('#midPanel').animate({top: '0%', height: '100%'},1000);
                    $('#botPanel').animate({top: '100%',height: '0%'},1000, function(){
                        $state.go("play");
                    });
                });
            });
        }

        $scope.backButton = function(){
            $('#content').fadeOut(1000,function(){
                $state.go("setup");
            });
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