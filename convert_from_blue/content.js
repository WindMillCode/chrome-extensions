let convertFromBlueObj = JSON.parse(localStorage.getItem("convertFromBlue") )??{
  realtime:false
}

function isBlue(color) {
  if(!color){
      return false
  }
  // Convert the color string to an array of RGB values
  let rgbColor = color.match(/\d+/g);
  if ([3,4].includes(rgbColor?.length ?? 0)) {
      // Extract the RGB values
      let { r,g,b } = getRGB(rgbColor);

      // Define a blue range (adjust these values as needed)
      let minBlueValue = 50;
      let maxRedValue = 200;
      let maxGreenValue = 200;

      // Check if the color is in the blue range
      return (b > minBlueValue && r < maxRedValue && g < maxGreenValue);
  }

  // If the color format is not valid, return false
  return false;
}

function getRGB(rgbColor) {
  let r = parseInt(rgbColor[0]);
  let g = parseInt(rgbColor[1]);
  let b = parseInt(rgbColor[2]);
  return { b, r, g };
}
function getRGBA(rgbColor) {
  let r = parseInt(rgbColor[0]);
  let g = parseInt(rgbColor[1]);
  let b = parseInt(rgbColor[2]);
  let a = parseInt(rgbColor[3]);
  return { b, r, g,a };
}

function convertFromBlue () {
  let elements = document.querySelectorAll('*');

  elements.forEach((element,i)=>{
    let computedStyle = getComputedStyle(element);

    let blueFeatures = [
      "backgroundColor",
      "color",
      "borderBottomColor",
      "borderLeftColor",
      "borderRightColor",
      "borderTopColor",
      'boxShadow',
      'textShadow',
      'outlineColor',
      'fill',
      'stroke',
      'background',
      'border',
      'boxDecorationBreak',
      'textDecorationColor',
      'textEmphasisColor',
      'textFillColor',
      'textStrokeColor'
    ].filter((val)=>{
        return isBlue(computedStyle[val])
    })

    blueFeatures.forEach((property)=>{
        let rgbColor = element.style[property].match(/\d+/g);
        try {
            let { r,g } = getRGB(rgbColor);
            element.style[property] = `rgb(${r},${g},0)`;
        } catch (error) {
            try {
                let { r,g,a} = getRGBA(rgbColor);
                element.style[property] = `rgb(${r},${g},0,${a})`;
            } catch (error) {
                element.style[property] = "orange"
            }

        }


    })
  })

}

if(convertFromBlueObj.realtime){


  // function handleMutations(mutationsList, observer) {

  // }
  // const observer = new MutationObserver(handleMutations);
  // const config = { childList: true, subtree: true, attributes: true };
  // observer.observe(document, config);

  convertFromBlue()
  setInterval(() => {
    convertFromBlue()
  }, 5000);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === "onDemand") {
    convertFromBlue()
  }
  else if(request.msg === "realtime") {
    convertFromBlueObj.realtime = !convertFromBlueObj.realtime
    localStorage.setItem("convertFromBlue",JSON.stringify(convertFromBlueObj))
    window.location.reload()
  }
});
