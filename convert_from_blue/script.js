let onDemandBtn = document.querySelector(".onDemandBtn")
let realtimeBtn = document.querySelector(".realtimeBtn")


onDemandBtn.addEventListener("click",()=>{

  sendMsgToWebsite("onDemand").then(()=>{});
})

realtimeBtn.addEventListener("click",()=>{
  sendMsgToWebsite("realtime").then(()=>{});
})
async function sendMsgToWebsite(msg) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const response = await chrome.tabs.sendMessage(tab.id, {msg});
  // do something with response here, not outside the function
  console.log(response);
}

