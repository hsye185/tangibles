import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Modules = new Mongo.Collection('modules');
Ground.Collection(Modules);

export const moduleExists = function (moduleId) {
    return Modules.find({_id: moduleId}).count() == 1;
};

Meteor.methods({
    'modules.insert' (module) {
        // if (!Meteor.userId())
        //     throw new Meteor.Error('not-authorized');

        Modules.insert({_id: Random.id(), name: module.name, words: module.words});
    },
    'modules.remove' (moduleId) {
        if (moduleExists(moduleId)) {
            Modules.remove(moduleId);
        }
        else {
            throw new Meteor.Error('The following module doesnt exist on the db: ' + moduleId);
        }
    },
    'modules.updateName' (moduleId, newName) {
        if (moduleExists(moduleId)) {
            Modules.update(moduleId, {
                $set: {name: newName},
            });
        }
        else {
            throw new Meteor.Error('The following module doesnt exist on the db:' + moduleId);
        }
    },
    'modules.addWord' (moduleId, word) {
        if (moduleExists(moduleId)) {
            Modules.update(
                {_id: moduleId},
                {$push: { words: word}}
            );
        }
        else {
            throw new Meteor.Error('The following module doesnt exist on the db:' + moduleId);
        }
    },
    'modules.removeWord' (moduleId, word) {
        if (moduleExists(moduleId)) {
            Modules.update(
                {_id: moduleId},
                {$pull: {words: word}}
            );
        }
        else {
            throw new Meteor.Error('The following module doesnt exist on the db:' + moduleId);
        }
    }

});

if (Meteor.isServer) {
    Meteor.publish('modules', function () {
        Modules.find();
    });

    Modules.allow({
        insert: function () {
            return false;
        },
        update: function () {
            return false;
        },
        remove: function () {
            return false;
        }
    });
}