import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spLevelSelect.html';

class SPLevelSelectCtrl {
    constructor($scope, $reactive, $gameStateService) {
        'ngInject'; 
        $reactive(this).attach($scope);
       $scope.playerName = $gameStateService.playerName;
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