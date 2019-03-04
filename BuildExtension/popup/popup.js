import chromep from 'chrome-promise';

paypal.Buttons().render('#paypal-button-container');

$(document).ready(() => {
  $("#run").click(async () => {

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
