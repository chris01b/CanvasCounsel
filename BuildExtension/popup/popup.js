import chromep from 'chrome-promise';


$(document).ready(() => {

  $("#paypal-button").click(() => {
    chrome.tabs.create({'url': chrome.extension.getURL('payment.html')});
  });

  $("#run-button").click(async () => {
    let payload;
    try {
      let tabs = await chromep.tabs.query({active: true, currentWindow: true});
      console.log('Clicked on tab id', tabs[0].id);
      payload = {action: 'run', src: tabs[0]};
    } catch(e) {console.error(e)}

    try {
      let response = await chromep.runtime.sendMessage(payload);
      console.log(response);
    } catch(e) {console.error(e)}
  }); 
});
