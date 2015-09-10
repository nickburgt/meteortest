Messages = new Meteor.Collection('messages');
Usercollection = Meteor.users;
Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images")]
});

if (Meteor.isClient) {
    Template.messages.helpers({
        messages: function () {
            return Messages.find({}, { sort: { time: -1 } });

        },

        images: function () {
            return Images.find({}, { sort: { uploadedAt: -1 } });
        },


    });

    Template.users.helpers({
        users: function () {
            return Usercollection.find({}, { sort: { name: 1 } });
        }
    });

    Template.images.events({
        'change .fileInput': function (event, template) {
            FS.Utility.eachFile(event, function (file) {
                var fileObj = new FS.File(file);
                    if (Meteor.user())
                    {
                    var name = Meteor.user().username;
                Images.insert(fileObj, function (err) {
                    var interval = Meteor.setInterval(function () {
                        if (fileObj.hasStored('images')) {
                            Messages.insert({
                                path: '/cfs/files/images/' + fileObj._id,
                                time: (new Date).toTimeString().substr(0, 8),
                                name: name,
                            })
                            Meteor.clearInterval(interval);
                        }
                    }, 50);
                });
                }
                else
                alert("you need to be logged in to send a picture");
            });
        },

    });

    Template.startchatting.events({
        'click .Startchat': function () {
            $('html,body').animate({
                scrollTop: $('#portfolio').offset().top
            }, 1000);
        }
    });

    Template.chatty.events({
        'click .chatty': function () {
            $('html,body').animate({
                scrollTop: $('#page-top').offset().top
            }, 1000);
        }
    });

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

    Template.sendbutton.events({
        "click .send": function () {
            if (Meteor.user())
            {
                var name = Meteor.user().username;
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
            else
            alert("you need to be logged in to send a message");
        }
    });
    
    
    Handlebars.registerHelper('ifx', function(conditional, options) {
    var truthValue = false;
    try {
        truthValue = eval(conditional);
    } catch (e) {
        console.log("Exception in #ifx evaluation of condition: ",
                    conditional, e);
    }
    if (truthValue) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
    });
    
    UI.registerHelper('equals', function(a, b) {
  return a == b; // == intentional
    });
    
    

}

if (Meteor.isServer) {
    Images.allow({
        'insert': function () {
            
            return true;
        },

        download: function () {
            return true;
        }
    }),

    Meteor.methods({
        ClearCollection: function () {
            Messages.remove({});
            Images.remove({});
        },
    });
}     


