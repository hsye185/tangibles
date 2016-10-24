import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spLevelSelect.html';

class SPLevelSelectCtrl {
    constructor($scope, $reactive, $gameStateService, $state) {
        'ngInject'; 
        $reactive(this).attach($scope);
        setTimeout(function() {
            if(!$gameStateService.isOnline){
                alert("Please do not refresh page, returning to setup screen");
                $state.go("setup");
            }
        }, 1000, $scope);
        
       $scope.currentStudent = $gameStateService.currentStudent;
       $scope.currentLevelId = $gameStateService.currentLevelId;
       $scope.currentModuleName = $gameStateService.currentModuleName;
       $scope.levels = $gameStateService.levels;
       $scope.currentLevelBeingViewed = 0;

       let millisecondsToWait3 = 50;

        setTimeout(function() {
            var heightMid = $('#midPanel').height();
            var heightMidInner = 628;
            var scale = heightMid / heightMidInner;

            $('#content').css(
                {'-ms-transform': 'scale('+scale+')', 
                '-webkit-transform': 'scale('+scale+')', 
                'transform': 'scale('+scale+')'
            });

        }, millisecondsToWait3, $scope);

        $scope.currentLevelStatus = function(){
            return ($scope.currentStudent.moduleProgress[$scope.currentModuleName])[$scope.currentLevelBeingViewed+1];
        };
       var millisecondsToWait2 = 100;
        setTimeout(function() {
            $('#content').fadeIn(1000);
            $('#titleBlock').fadeIn(1000);
        }, millisecondsToWait2, $scope);

        $scope.leftButton = function(){
            $scope.currentLevelBeingViewed--;
        };
        $scope.rightButton = function(){
            let nextLevelStatus = ($scope.currentStudent.moduleProgress[$scope.currentModuleName])[$scope.currentLevelBeingViewed+1];
            if(nextLevelStatus!=0){
                $scope.currentLevelBeingViewed++;
            }
        };

        $scope.levelClicked = function(level){
            $scope.currentLevelBeingViewed = level.number-1;
        };

        $scope.getNumberForLevel = function(){
            return this.numberToWord(currentLevelBeingViewed+1);
        };

        $scope.startLevel = function(){
            $gameStateService.currentLevelId = $scope.currentLevelBeingViewed;
            $('#titleBlock').fadeOut(1000,function(){
            });
            $('#content').fadeOut(1000,function(){
                $(function () {
                    // alert();
                    var newHeight = window.innerHeight - 30;
                    var newWidth = window.innerWidth - 30;
                    // $('#topPanel').animate({height: newHeight, width: newWidth, top: '15px', left: '15px'},1000);
                    // $('#topPanel').animate({height: 'calc(100% - 30px)', width: 'calc(100% - 30px)'},1000);
                    $('#midPanel').animate({top: '15px', left: '15px', height: newHeight, width: newWidth},1000);
                    $('#botPanelLeft').animate({top: '0%',height: '100%',width:'100%'},1000, function(){
                        setTimeout(function() {
                            $state.go("play");
                        }, 250, $scope);     
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

}

const name = 'spLevelSelect';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPLevelSelectCtrl,
        bindings: {library: '=', tangibles: '='}
    })