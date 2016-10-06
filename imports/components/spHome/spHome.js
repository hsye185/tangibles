import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './spHome.html';
import {TangibleController} from '../../api/tangibles/controller';
import {Diagrams} from '../../api/collections/diagrams.js';
import {Libraries} from '../../api/collections/libraries.js';

class SPHomeCtrl {
    constructor($scope, $reactive, $stateParams, $tgImages, $state, $tgSharedData, $const) {
        'ngInject';
        $reactive(this).attach($scope);
        this.$scope = $scope;
        this.$state = $state;
    }
}

const name = 'spHome';
export default angular.module(name, [angularMeteor])
    .component(name, {
        template,
        controllerAs: name,
        controller: SPHomeCtrl,
        bindings: {library: '=', tangibles: '='}
    });