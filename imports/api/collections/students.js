import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Students = new Mongo.Collection('students');
Ground.Collection(Students);

export const studentExists = function (studentName) {
    return Students.find({_id: studentName}).count() == 1;
};

Meteor.methods({
    'students.insert' (student) {
        Students.insert(student);
    },
    'students.remove' (studentName) {
        if (studentExists(studentName)) {
            Students.remove(studentName);
        }
        else {
            throw new Meteor.Error('The following student doesnt exist on the db: ' + studentName);
        }
    },
    'students.updateModuleProgress' (student) {
        if (studentExists(student._id)) {
            Students.update(student._id, {
                $set: {moduleProgress: student.moduleProgress},
            });
        }
        else {
            throw new Meteor.Error('The following student doesnt exist on the db:' + student._id);
        }
    },
    'students.deleteStudent' (studentName) {
        Students.remove({
            _id: studentName
        });
    },
    'students.deleteEntireCollection' (param) {
        Students.remove({});
    }

});

if (Meteor.isServer) {
    Meteor.publish('students', function () {
        return Students.find({});
    });

    Students.allow({
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