
/*
  This file contains functions for loading and handling the data used by
  the application.

  Author: Markus Hellgren
*/

function loadJSON(callback, file) {
    // We load the file using an XMLHttpRequest, which is part of AJAX
    //
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    // Open the file for reading. Filename is relative to the script file.
    //
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // It is necessary to use an anonymous callback as .open will NOT
            // return a value but simply returns undefined in asynchronous mode.
            //
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

function Data() {
  this.users = [];
  this.beverages = [];

  this.loadAll = function(callback) {
    let self = this;
    this.loadUsers()
      .then(this.loadBeverages()
        .then(function(){
          console.log(self.users, self.beverages);
          callback();
        }).catch(function(){
          console.log('failed loading resources');
        })
      ).catch(function(){
        console.log('failed loading resources');
      });
  };

  this.loadUsers = function(){
    let self = this;
    return new Promise(function(resolve, reject) {
      loadJSON(function(response){
        self.users = JSON.parse(response);
        resolve();
      }, 'DBFilesJSON/dutchman_table_users.json');
    });
  };

  this.loadBeverages = function(){
    let self = this;
    return new Promise(function(resolve, reject) {
      loadJSON(function(response){
        self.beverages = JSON.parse(response);
        resolve();
      }, 'DBFilesJSON/dutchman_table_sbl_beer.json');
    });
  }

  return this;
}

var DB = new Data(); // create a data object so that data can be loaded from the json files

/*
  The below functions are used for storing/loading from localStorage
*/
/*
  loads all data and stores it in localStorage if the data is not already present in localStorage.
*/
function initData(callback) {
  initLanguage(); // set the system language if not set
  DB.loadAll(function() {
    if(getUsers() === null){
      setUsers(DB.users);
      console.log('storing users in localStorage');
    }
    if(getBeverages() === null){
      setBeverages(DB.beverages);
      console.log('Storing beverages in localstorage');
    }
    if(callback) callback();
  });
}

function initLanguage() {
  if(getLanguage()) return;
  setItem('language', 'sv');
}

function getLanguage() {
  let lang = localStorage.getItem('language');
  return !lang ? null : lang;
}

/*
  remove an item from localStorage by key
*/
function removeItem(key) {
  localstorage.removeItem(key);
}

/*
  set an item in localStorage
*/
function setItem(key, value) {
  localStorage.setItem(key, value);
}

/*
  store all users in localStorage.
*/
function setUsers(users) {
  setItem('users', JSON.stringify(users));
}

/*
  store all beverages in localStorage.
*/
function setBeverages(beverages) {
  setItem('beverages', JSON.stringify(beverages));
}

/*
  get an item from localStorage by key
*/
function getItem(key) {
  let item = localStorage.getItem(key);
  return !item ? null : JSON.parse(item);
}

/*
  get all users from localStorage
*/
function getUsers() {
  return getItem('users');
}

/*
  get a users information by username
*/
function getUserFromUsername(username) {
  let users = getUsers();
  if(users === null) return null;
  return users.find(u => u.username === username);
}

/*
  get a users information by id
*/
function getUserFromId(id) {
  let users = getUsers();
  if(users === null) return null;
  return users.find(u => u.user_id === id);
}

/*
  get all beverages from localStorage
*/
function getBeverages() {
  return getItem('beverages');
}
function getBeverageFromArticleId(articleId) {
  let beverages = getBeverages();
  if(beverages === null) return null;
  return beverages.find(b => b.artikelid === articleId);
}
