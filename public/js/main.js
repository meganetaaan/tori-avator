/* global firebase */
(function(fb){
  var firebase = fb;
  var db = firebase.database();
  function createUser(userName){
    db.ref('index/' + userName).once('value').then(function(snapshot) {
      if(snapshot.val() === null){
        var userData = {
          userName: userName,
          x: 0,
          y: 0,
        };
        var key = db.ref('users/').push().key;
        var updates = {};
        updates['/users/' + key] = userData;
        updates['/index/' + userName] = key;
        db.ref().update(updates);
      }
    });
  }

  function updateUser(userName, x, y) {
    db.ref('index/' + userName).once('value').then(function(snapshot) {
      if(snapshot.val() !== null){
        var userData = {
          userName: userName,
          x: x,
          y: y,
        };
        var key = snapshot.val();
        var updates = {};
        updates['/users/' + key] = userData;
        db.ref().update(updates);
      }
    });
  }

  function removeUser(userName) {
    var key = db.ref('users/' + userName);
    var updates = {};
    updates['/users/' + key] = null;
    updates['/index/' + userName] = null;
  }

  window.tori = {
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
  };

  var userCache = {};
  function createAvator(userName) {
    var elem = document.createElement('div');
    var text = document.createTextNode(userName);
    elem.appendChild(text);
    elem.style.position = 'absolute';
    elem.className = 'avator';
    document.getElementById('root').appendChild(elem);
    userCache[userName] = elem;
    return elem;
  }

  function updateAvator(userName, x, y) {
    var elem = userCache[userName] || createAvator(userName);
    elem.style.left = x + 'px';
    elem.style.top = y + 'px';
  }

  db.ref('users/').on('child_changed', function(child) {
    var user = child.val();
    updateAvator(user.userName, user.x, user.y);
  });

  var USER_NAME = 'bobin';
  document.addEventListener('DOMContentLoaded', function() {
    createUser(USER_NAME);
    document.addEventListener('click', function(context) {
      updateUser(USER_NAME, context.clientX, context.clientY);
    });
  });
})(firebase);
