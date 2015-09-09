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
                if(Meteor.user())
                var naam = Meteor.user().username;
                else
                var naam = "Anonymous";
                Images.insert(fileObj, function (err) {
                    if (Meteor.user())
                        Meteor.call("UpdateImages");
                    else
                        Meteor.call("UpdateImages2");
                        
                var interval = Meteor.setInterval( function() {
                    if (fileObj.hasStored('images')) {
                    Messages.insert({
                    path: '/cfs/files/images/' + fileObj._id,
                    time: (new Date).toTimeString().substr(0,8),
                    name: naam,
                    })
                    Meteor.clearInterval(interval);
                    }
                    }, 50);
                   // Messages.insert({
                    //path: '/cfs/files/images/' + fileObj._id,
                    //time: (new Date).toTimeString().substr(0,8),
                   // name: naam,
                  // })
               });
            });   
        },
       
    });
    
    Template.startchatting.events({
        'click .Startchat': function() {
        $('html,body').animate({
        scrollTop: $('#portfolio').offset().top
        }, 1000);
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

    Template.sendbutton.events({
        "click .send": function () {
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
    });
    
   // Template.messages.rendered = function () {
       // Template.autorun(function () {
        //var self = this;
       // thisCampaign = Session.get('messages');
        //})
    //};

}

if (Meteor.isServer) {
    Images.allow({
        'insert': function () {
            // add custom authentication code here
            return true;
        },

        download: function () {
            return true;
        }
    }),

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
            Images.remove({});
        },

        IsAdmin: function () {
            if (Meteor.user())
                var username = Meteor.user().username;
            if (username == "admin")
                return true;
        },

        findUser: function (username) {
            return Meteor.users.findOne({
                username: username
            }, {
                    fields: { 'username': 1 }
                });
        },

        UpdateImages: function () {
            //morgen zorgen dat ie alleen de laatste pakt
            var doc = Images.find({}, { sort: { uploadedAt: -1 }, limit: 1 });
            Images.update({ uploadedAt: doc.uploadedAt }, { $set: { inlognaam: Meteor.user().username } });
            Images.update({ uploadedAt: doc.uploadedAt }, { $set: { tijd: (new Date).toTimeString().substr(0, 8) } });
        },

        UpdateImages2: function () {
            //morgen zorgen dat ie alleen de laatste pakt  
            var doc = Images.find({}, { sort: { uploadedAt: -1 }, limit: 1 });
            Images.update({ uploadedAt: doc.uploadedAt }, { $set: { inlognaam: "Anonymous" } });
            Images.update({ uploadedAt: doc.uploadedAt }, { $set: { tijd: (new Date).toTimeString().substr(0, 8) } });
        },

        JoinCollections: function () {
            Messages.insert({
            path: process.env.PWD,
            time: (new Date).toTimeString().substr(0,8),
            })
        }
    });
}     
       
    
   // Meteor.startup(function () {
    //UploadServer.init({
    //tmpDir: '/meteor/chat_appv2/public/tmp',
    //uploadDir: '/meteor/chat_appv2/public',
   //// checkCreateDirectories: true,
   // getDirectory: function(fileInfo, formData) {
      // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
     // return formData.contentType;
    //},
    //finished: function(fileInfo, formFields) { 
      //  Messages.insert({
      //  time : (new Date).toTimeString().substr(0,8),
     //   path: fileInfo.path,
      //  })
        
      // perform a disk operation
   // },
   // cacheTime: 100,
   // mimeTypes: {
    ///    "xml": "application/xml",
    //    "vcf": "text/x-vcard"
    //}
    //})
    //  });
//}
