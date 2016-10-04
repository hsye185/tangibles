import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Modules = new Mongo.Collection('modules');
Ground.Collection(Modules);

export const moduleExists = function (moduleId) {
    return Modules.find({_id: moduleId}).count() == 1;
};

Meteor.methods({
    'modules.insert' (module) {
        Modules.insert(module);
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
    'modules.updateModule' (module) {
        if (moduleExists(module._id)) {
            Modules.update(module._id, {
                $set: {name: module.name, words: module.words},
            });
        }
        else {
            throw new Meteor.Error('The following module doesnt exist on the db:' + module._id);
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
    },
    'modules.deleteModule' (moduleId) {
        Modules.remove({
            _id: moduleId
        });
    },
    'modules.deleteEntireCollection' (param) {
        Modules.remove({});
    }

});

if (Meteor.isServer) {
    Meteor.publish('modules', function () {
        return Modules.find({});
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