import chromep from 'chrome-promise';
import io from 'socket.io-client';

import jqueryString from './jqueryString';
import scrapeQuestionsString from './scrapeQuestionsString';

const socket = io.connect('http://localhost:3000');

let scraped = false;

async function waitForQuestions() {
  try {
    let [message, sender, sendResponse] = await chromep.runtime.onMessage.addListener();
    if (message.action == 'questions' && scraped == false) {
      sendResponse('Background received questions');
      let questions = message.src;

      socket.emit('submitQuestions', questions);
      console.log('Questions:', questions);
      console.log('Submitted Questions to', socket.id);

      scraped = true;
    } else {
      sendResponse('Background didn\'t receive questions');
    }
  } catch (e) {console.error(e)}
}


async function waitForClick() { 
  try {
    let tab = await chromep.browserAction.onClicked.addListener();
    console.log('browserAction clicked on', tab.id);

    chrome.tabs.executeScript(tab.id, {code: jqueryString()});
    chrome.tabs.executeScript(tab.id, {code: scrapeQuestionsString()});
  } catch (e) {console.error(e)}
  waitForQuestions();
}

socket.once('connect', () => {
  console.log('Connected to', socket.id);

  waitForClick();

  socket.on('returnAnswer', answer => {
    console.log('Received Answer from', socket.id);
    console.log(answer);
    scraped = false;
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from', socket.id);
  });
});

