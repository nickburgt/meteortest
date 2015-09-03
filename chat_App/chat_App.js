Messages = new Meteor.Collection('messages');
Usercollection = Meteor.users;

if (Meteor.isClient) {
    Template.messages.helpers({
        messages: function () {
            return Messages.find({}, { sort: { time: -1 } });
            //return message
        }
    });

    Template.users.helpers({
        users: function () {
            return Usercollection.find({}, { sort: { name: 1 } });
        }
    });

    Template.input.events = {
        'keydown input#message': function (event) {
            if (event.which == 13) { // 13 is the enter key event
                if (Meteor.user())
                    var name = Meteor.user().username;
                else
                    var name = 'Anonymous';
                var message = document.getElementById('message');

                if (message.value != '') {
                    Messages.insert({
                        name: name,
                        message: message.value,
                        time: (new Date).toTimeString().substr(0, 8),
                    });

                    document.getElementById('message').value = '';
                    message.value = '';
                }
            }
        }
    }
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Template.clear.events({
        "click .clear": function () {
            if (Meteor.user())
                var username = Meteor.user().username;
            if (username == "admin")
                Meteor.call("ClearCollection");
            if (username !== "admin")
                alert("you need to be an admin to do this");
        }
    });  
}

if (Meteor.isServer) {
    Meteor.methods({
        removeAllPosts: function () {
            var globalObject = Meteor.isClient ? window : global;
            for (var property in globalObject) {
                var object = globalObject[property];
                if (object instanceof Meteor.Collection) {
                    object.remove({});
                }
            }
        },

        ClearCollection: function () {
            Messages.remove({});
        },

        IsAdmin: function () {
            if (Meteor.user())
                var username = Meteor.user().username;
            if (username == "admin")
                return true;
        },
    });
}
