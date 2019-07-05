// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let jiraList,ticketNo,ticketDesc,ticketUrl;

// *************************Extension elements that require actions**************************//
let addTicket = document.getElementById('addTicket');
// let copyList = document.getElementById('copyList');
let clearList = document.getElementById('clearList');
// let selectAll = document.getElementById('selectAll');
let content = document.getElementById('content');

chrome.storage.local.get(['jiras'], function(result) {
  jiraList = result.jiras ? result.jiras: '';
  updatePopupText(jiraList);
});

function modifyDOM() {
  console.log('Tab script:');

  // *************************Page elements that will be added to list**************************//
  ticketNo = document.getElementById('key-val');
  ticketDesc = document.getElementById('summary-val');
  ticketUrl = document.URL;

  console.log(document.body);
  return document.body.innerHTML;
}

addTicket.onclick = function(element) {
  chrome.tabs.executeScript(null,{
    // code:" ticketNo = document.getElementById('key-val').innerHTML; ticketDesc = document.getElementById('summary-val').innerHTML; ticketUrl = document.URL; let arr = [ticketNo, ticketDesc, ticketUrl]; arr;"}, 
    code:"arr = [document.getElementById('key-val').innerHTML, document.getElementById('summary-val').innerHTML, document.URL]; arr;"}, 
    function(results){
      if(results[0]){
        ticketNo = results[0][0];
        ticketDesc = results[0][1];
        ticketUrl = results[0][2];
      }
      if(ticketNo){
        let ticketString = ticketNo + ' - ' + ticketDesc + '(' + ticketUrl + ')';
        let ticketHtml = '<a href="' + ticketUrl + '"><b>' + ticketNo + ' - </b></a> <p>' + ticketDesc + '</p>'
        updatePopupText(ticketHtml);
      }
    }
  );

  chrome.storage.local.set({jiras: jiraList}, function() {
    // jiras is set to jiraList
    console.log(jiraList)
  });
};

clearList.onclick = function(element) {
  updatePopupText();
};

// copyList.onclick = function(element) {
//   // Copying jiraList to clipboard
//   navigator.permissions.query({name: "clipboard-write"}).then(result => {
//     if (result.state == "granted" || result.state == "prompt") {
//       /* write to the clipboard now */
//       navigator.clipboard.writeText(jiraList).then(function() {
//         /* clipboard successfully set */
//         chrome.tabs.executeScript(null,{
//           code:"alert('Text Copied Successfully!');"
//         }, function(){});
//       }, function() {
//         /* clipboard write failed */
//         chrome.tabs.executeScript(null,{
//           code:"alert('Sorry, something went wrong');"
//         }, function(){});
//       });
//     }
//   });

//   // Copying the popup DOM to see if the DOM seperated the tags but keeps rich formatting?
//   // content
//   // document.execCommand('copy')

// }

/** 
 * This function exists so that the extention popup updates 
 * with the latest storage variable
 * @param val is the html to be added
 * 
*/
function updatePopupText(val){
  let content = document.getElementById('content');
  if(val){
    jiraList = content.innerHTML = content.innerHTML ? content.innerHTML + '<br>' + val: val;
    noContent.innerHTML = '';
  } else {
    jiraList = ''; 
    content.innerHTML = ''; 
    noContent.innerHTML = "<b>You got 99 issues, but jira isn't one?</b>"; 
  }
  
  chrome.storage.local.set({jiras: jiraList});
}

