/**
 * @author: Subash lakshmanan <subash@bezohminds.com>
 * @description: to render the canvas.
 */

var canvas = new fabric.Canvas('myCanvas');
var canvas2 = new fabric.Canvas('myCanvas2');
canvas.selectionColor = 'rgba(0, 0, 0, 0)'; // Set to transparent
canvas.selectionBorderColor = 'rgba(0, 0, 0, 0)'; // Set to transparent
canvas.selectionLineWidth = 0; // 
canvas2.selectionColor = 'rgba(0, 0, 0, 0)'; // Set to transparent
canvas2.selectionBorderColor = 'rgba(0, 0, 0, 0)'; // Set to transparent
canvas2.selectionLineWidth = 0; // 
var RibbonObjects = [];
var printLineObjects = [];
var printLineVariationObjects = [];
var canvasObjects = {};
var spacer = 0;
var layerSpecs = {};
var borderSpecs = {};
var PrintColor = 'black';
var rulerObject;
var borderObjects;
// var Editcustom = false;
var canvasThumbnails={};
let customizerIcon = 0;
var manualtrigger=false;
// add the base images to the canvas 
async function loadCanvasImages() {
  var promises = [];
  if (CanvasLayers == null || CanvasLayers == undefined) return false;
  for (var layer of CanvasLayers) {
    if (layer.layerName.trim().toLowerCase() == 'ruler') {
      var promise = await addImageToCanvas(layer.canvasImageUlr, 'ruler');
      promises.push(promise);
      continue;
    }
    calculateLayerSpec(layer.id, layer.seqNumber)
    var promise = await addImageToCanvas(layer.canvasImageUlr, layer.seqNumber);
    promises.push(promise);

  }

 if(window.innerWidth>=999){
  let rectanglecount = false;
  let previewImage = document.getElementById("magnifier1")
  var mouseRectangle = new fabric.Rect({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    id: 'magnifizer',
    fill: 'transparent',
    stroke: '#00badb',
    strokeWidth: 1,
    selectable: false,
    evented: false
  });


  // Function to capture the mouse movement
  canvas.on('mouse:move', function (options) {
    if (!rectanglecount) {
      canvas.add(mouseRectangle);
      rectanglecount = true;
    }
    if (options.e) {
      var pointer = canvas.getPointer(options.e);
      var left = pointer.x;
      var top = pointer.y;
      var width = 160;
      var height = 160;

      mouseRectangle.set({
        left: left - width / 2,
        top: top - height / 2,
        width: width,
        height: height
      });
      canvas.bringToFront(mouseRectangle);
      canvas.renderAll();
      updatePreviewImage(canvas);
    }
  });
  canvas.on('mouse:out', function () {
    $("#magnifier1").css("visibility", "hidden");
    rectanglecount = true;
    canvas.remove(mouseRectangle)
    previewImage.src = "";
  });
  // Function to update the preview image with the current canvas state
  function updatePreviewImage(canvas1) {
    $("#magnifier1").css("visibility", "visible")
    var imgData = canvas1.toDataURL({
      left: mouseRectangle.left + 2,
      top: mouseRectangle.top + 2,
      width: mouseRectangle.width - 2,
      height: mouseRectangle.height - 2,
      multiplier: 3,
    });
    previewImage.src = imgData;
  }
  canvas2.on('mouse:move', function (options) {
    if (!rectanglecount) {
      canvas2.add(mouseRectangle);
      rectanglecount = true;
    }
    if (options.e) {
      var pointer = canvas2.getPointer(options.e);
      var left = pointer.x;
      var top = pointer.y;
      var width = 160;
      var height = 160;
      mouseRectangle.set({
        left: left - width / 2,
        top: top - height / 2,
        width: width,
        height: height
      });
      canvas2.bringToFront(mouseRectangle);
      canvas2.renderAll();
      updatePreviewImage(canvas2);
    }
  });
  canvas2.on('mouse:out', function () {
    $("#magnifier1").css("visibility", "hidden");
    previewImage.src = "";
    rectanglecount = true;
    canvas2.remove(mouseRectangle)
  });
 }
   Promise.all(promises)
    .then(() => {
      updateImageSrc(canvas);
      updateSrc(canvas,hopsProdId);
      $(".customizer_btn.product-gallery__thumbnail").click();
      canvas.renderAll();
      fontload();
      var objectsOnCanvas = canvas.getObjects();
      if (objectsOnCanvas.length > 0) {
        canvasObjects[hopsProdId] = cloneObjectsOnCanvas(objectsOnCanvas);
        baseObjects = cloneObjectsOnCanvas(objectsOnCanvas);
      }
    })
    .catch(error => {
      console.error("Error loading images:", error);
    });

  }





function calculateLayerSpec(id, no) {
  if (CanvasConfig == null || CanvasSpecs == null) return false
  layerSpecs[no] = calculateWidthHeight(id, no);
}
// TO conver & calculate the height,width  
function calculateWidthHeight(id, no) {
  var x = 0;
  var y = 0;
  var streamerWidth = 0;
  var streamerHeight = 0;
  var printWidth = 0;
  var printLength = 0;
  var remainingSpace_Horizontal = 0;
  var minimum_header = 0;
  var minimum_footer = 0;
  var angle = 0;
  if (CanvasConfig['layer_' + id]) {
    x = CanvasConfig['layer_' + id].xAxis;
    y = CanvasConfig['layer_' + id].yAxis;
    angle = CanvasConfig['layer_' + id].flip
    streamerWidth = CanvasConfig['layer_' + id].width;
    streamerHeight = CanvasConfig['layer_' + id].height;
  }
  if (CanvasSpecs['layer_' + id]) {
    const specs = CanvasSpecs['layer_' + id];
    if (specs['maxPrintWidth'] != 0 && specs['normalPrintWidth'] != 0 && specs['maxPrintLength'] != 0 && specs['normalPrintLength'] != 0) {
      printWidth = pixelConverstion(specs['maxPrintWidth'], specs['normalPrintWidth'], CanvasConfig['layer_' + id].width / dpi);
      printLength = pixelConverstion(specs['maxPrintLength'], specs['normalPrintLength'], CanvasConfig['layer_' + id].height / dpi);
      if (isborder) {
        streamerWidth = streamerWidth - (borderdetail["beedingWidth"] * 2) - (borderdetail["borderWidth"] * 2);
        printWidth = streamerWidth;
        x += borderdetail["beedingWidth"] + borderdetail["borderWidth"];
      }
      remainingSpace_Horizontal = streamerWidth - printWidth;
      minimum_header = pixelConverstion(specs['minimumHeader'], specs['normalPrintLength'], CanvasConfig['layer_' + id].height / dpi);
      minimum_footer = pixelConverstion(specs['minimumFooter'], specs['normalPrintLength'], CanvasConfig['layer_' + id].height / dpi);
    }
  } else {
    if (isborder) {
      streamerWidth = streamerWidth - (borderdetail["beedingWidth"] * 2) - (borderdetail["borderWidth"] * 2);
      x += borderdetail["beedingWidth"] + borderdetail["borderWidth"];
    }
  }
  if (isborder) {
    borderSpecs[no] = {
      "x": CanvasConfig['layer_' + id].xAxis + borderdetail["beedingWidth"],
      "y": CanvasConfig['layer_' + id].yAxis,
      "width": streamerWidth ,
      "height": streamerHeight
    };
  }
  const obj = {
    "x": x + (remainingSpace_Horizontal / 2),
    "y": y + minimum_header,
    'angle': angle,
    "width": streamerWidth,
    "height": streamerHeight,
    "printWidth": printWidth == 0 ? streamerWidth : printWidth,
    "printLength": printLength == 0 ? streamerHeight : printLength,
    "remainingSpace_Horizontal": remainingSpace_Horizontal,
    "minimum_header": minimum_header,
    "minimum_footer": minimum_footer
  }

  return obj

}
var previousWidth = $(".card").width();
var previousHeight = $(".card").height();
$(".customizer_btn.product-gallery__thumbnail").click(async function (event) {
  // if (window.innerWidth <= 999) {
  //  return false
  // }
  let _vc = document.getElementById("varAddBtn").getAttribute("data-vCount");
  if(_vc>0){
      $('.image-container').show();
  }
 // $('.image-container').show();
  await updateSrc(canvas,hopsProdId);
  $(".big_image").show();
  $("#canvasName").css('visibility', 'visible')
  if (rulerObject) $('.ruler').show();
  $(".is-nav-selected").removeClass("is-nav-selected");
  $(this).addClass("is-nav-selected");
  $(".product-gallery__carousel-item").hide();
  $(".product-gallery__zoom-notice").hide();
    // await renderTextOnCanvas();
    // await renderCanvas()
  if (customizerIcon == 0) {
    customizerIcon++
    $(".customizer").css({
      height: "570px",
      width: "100%"
    });
  }
});
$(".product-gallery__thumbnail:not(.customizer_btn)").click(function () {
  $(".big_image").hide();
  $('.ruler').hide();
  $('.image-container').hide();
  $("#canvasName").css('visibility', 'hidden')
  $(".product-gallery__carousel-item").show();
  $(".customizer").css({
    width: previousWidth + "px",
    height: previousHeight + "px",
  });
  $(".product-gallery__zoom-notice").show();
});

// trigger the function based on the input field
async function canvasColorization(_this) {
  manualtrigger=false;
  printLineObjects = []
  if (!_isCanvasEnabled) return false;
  $('#canvasName').text('');
  applyRuler(false)
  // showOrHideElement(_this)
  $("#container2").hide();
  $("#container1").show();
  $(".customizer_btn.product-gallery__thumbnail").click();
  var optionId = $(_this).attr('id');
  if (optionId.includes('_')) {
    optionId = optionId.split('_').slice(0, -1).join('_');
  }
  if (optionId == 'enterUploadfile') {
    optionId = $(_this).attr('data-option-id').split('_' + optionId)[0];
  }
  if (optionId.includes('ExtraField')) {
    optionId = optionId.split('ExtraField')[0];
  }
  console.log('inputname', $(this).attr('name'))
  for (var option of CanvasOptions) {
    if (optionId == option.optionId) {
      if (OptionsType[optionId] == "Color") {
        var obj = canvas.getObjects().find(obj => obj.id === option.layer);
        await findColorOrPattern(obj, _this, option);
      } else if (OptionsType[optionId] == "PrintColor") {
        findPrintColor(_this);
      } else if (OptionsType[optionId] == "Border") {
        await findBorder(_this, option)
      } else if (OptionsType[optionId] == "Text" || OptionsType[optionId] == "Image") {
        await renderTextOnCanvas();
      }
    }
  }
  renderCanvas();
  await applyToVariations();
  selectedSlider($(`#${hopsProdId}`));
  const targetImage = $('.view_slider').eq(0);
  const container = $('.image-container');
  const containerHeight = container.height();
  const imageHeight = targetImage.height();
  const targetScrollTop = targetImage.offset().top - container.offset().top + container.scrollTop() - (containerHeight - imageHeight) / 2;
  container.animate({
    scrollTop: targetScrollTop
  }, 'slow');
}

function cloneObjectsOnCanvas(objectsOnCanvas) {
  return objectsOnCanvas.map(obj => {
    if (obj.id === 'magnifizer') {
      return null; // or an empty array: return [];
    }
    const clonedObject = fabric.util.object.clone(obj);

    if (obj instanceof fabric.Group) {
      // If it's a group, clone its objects
      const clonedObjectsInGroup = obj.getObjects().map(obj => fabric.util.object.clone(obj));
      const clonedGroup = new fabric.Group(clonedObjectsInGroup, {
        ...obj.toObject(),
        objectCaching: false, // Make sure caching is turned off for the cloned group
        hasBorders: false,
        hasControls: false,
        objectCaching: false,
        stateFullCache: false,
        selectable:false,
      });
      clonedGroup.set({ id: obj.id });
      return clonedGroup;
    }

    return clonedObject;
  }).filter(obj => obj !== null);
}
// TO render a canvas
function renderCanvas() {
  console.log(printLineObjects.length)

  if (printLineObjects.length > 0) {
    // for (var obj of printLineObjects) {
    // removeExisitingObject();
    // }
    canvas.add(...printLineObjects);
    printLineObjects = [];
    console.log(canvas.getObjects())
  }
  var objectsOnCanvas = canvas.getObjects();
  if (objectsOnCanvas.length > 0) {
    canvasObjects[hopsProdId] = cloneObjectsOnCanvas(objectsOnCanvas)
  } if (isborder) {
    borderObjects = canvas.getObjects().filter(obj => obj.border == true)
  }
  canvas.renderAll();
  // var dataURL = canvas.toDataURL();
  // console.log(dataURL);  
}

function createGroup(object, key) {
  var group = new fabric.Group(object,{
        hasBorders: false,
        hasControls: false,
        objectCaching: false,
        stateFullCache: false,
        selectable:false,
  });
  group.originX = 0;
  group.originY = 0;
  group.selectable = false;
  // Iterate through all objects in the group and set their origin to 'center'
  group.forEachObject(function (obj) {
    obj.originX = 0;
    obj.originY = 0;
  });
  group.set({ id: key })
  if (layerSpecs[key]['angle'] > 0) {
    group.set({
      angle: layerSpecs[key]['angle'],
      left: layerSpecs[key]['x'],
      top: layerSpecs[key]['y'],
      width: layerSpecs[key]['printWidth'],
      height: layerSpecs[key]['printLength'],
    });
  }
  return group
}
// TO get the total line count
function getLinesCount() {
  var count = 0;
  for (var element of $('#sortableoptions li')) {
    var _input = $(element).find("input");
    var value = _input.val();
    count++

  }
  return count;
}

// TO calculate the space between objects
function getSpacebetweenOjects(RemainingSpace, Line_count) {
  return RemainingSpace / (Line_count + 1);
}

// TO find a color or pattern then trigger fabricjs Fucntion
async function findColorOrPattern(obj, _this, option,varId) {
  var value = $(_this).attr('value').trim();
  var categoryType = $(_this).attr('data-categoryType');
  var color = CanvasColors[value];
  var ImageUrl = CanvasPatterns[value];
  if (categoryType == 'I') {
    if (isMedal) {
      ImageUrl = findMedalPattern(option.optionId, _this);
    }
    if (ImageUrl == undefined) {
      for (var layer of CanvasLayers) {
        if (layer.seqNumber == option.layer) {
          await applyPattern(obj, layer.canvasImageUlr, color,varId).then(async(i)=>{
            if(varId != undefined){
            let index = canvasObjects[varId].findIndex(item => item.id === obj.id);
            if (index !== -1) {
              canvasObjects[varId][index] = i;
                updateSrc(canvasObjects[varId],varId,true);
          }
        }
          })
          return false;
        }
      }
    }
    await applyPattern(obj, ImageUrl, null);
  } else {
    for (var layer of CanvasLayers) {
      if (layer.seqNumber == option.layer) {
        await applyPattern(obj, layer.canvasImageUlr, color,varId).then(async(i)=>{
          if(varId != undefined){
          let index = canvasObjects[varId].findIndex(item => item.id === obj.id);
          if (index !== -1) {
            canvasObjects[varId][index] = i;
              updateSrc(canvasObjects[varId],varId,true);
        }
      }
        })
      }
    }
  }
}

// find thee printcolor and triger fabricjs fucntion
function findPrintColor(_this) {
  var color = CanvasColors[$(_this).attr('value')];
  var allObj = canvas.getObjects();
  PrintColor = color;
  if (color == undefined) {
    PrintColor = 'black';
  }
  applyPrintColor(allObj, color);
}

async function findBorder(_this, option) {
  let obj = canvas.getObjects().filter(obj => obj.id == option.optionId);
  canvas.remove(...obj)
  let url = borderImages[$(_this).attr('value')];
  if (url == undefined) return false
  await drawBorders(option.optionId, url, borderdetail["borderWidth"], borderSpecs[option.layer]['height'], borderSpecs[option.layer]['x'], borderSpecs[option.layer]['y'], true)
  await drawBorders(option.optionId, url, borderdetail["borderWidth"], borderSpecs[option.layer]['height'], borderSpecs[option.layer]['x'] + borderdetail["borderWidth"] + borderSpecs[option.layer]['width'], borderSpecs[option.layer]['y'], false)
}
//TO render a text on a base product
async function renderTextOnCanvas() {
  var layerObjects = {};
  var fillColor = PrintColor;
  var topSpacer = $('#sortableoptions').first().find('input')[0];
  var bottomSpacer = $('#sortableoptions').first().find('input').last();
  if ($(topSpacer).attr('data-spacer') > 0) {
    if (Object.keys(layerSpecs).length > 0) {
      option = CanvasOptions.find(option => option.optionId === $(topSpacer).attr('data-id'));
      getspacerCreateText(layerObjects, option.layer, Number($(topSpacer).attr('data-spacer')), layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], fillColor, 'Arial', 0, $(topSpacer).attr('data-id'));
    }
  }

  for (var element of $('#sortableoptions li')) {
    var _input = $(element).find("input,select");
    var value = _input.val();
    var optionId = _input.attr('id');
    if (_input.attr('id') == undefined) {
      continue
    }
    if (_input.attr('id').includes('_')) {
      optionId = _input.attr('id').split('_').slice(0, -1).join('_');
    }
    if (optionId.includes('ExtraField')) {
      optionId = optionId.split('ExtraField')[0];
    }
    if (_input.is('select')) {
      value = _input.find("option:selected").text().trim();
      if (value == '- Select an Option -'|| value == "" ) {
        value = _input.eq(1)
        _input = value;
        value = $(value).val()
      }
    }

    if ($(element).hasClass("eitheror-group")) {
      [_input, optionId] = processEitherorElement(_input, optionId);
    }
    for (var option of CanvasOptions) {
      if (optionId == option.optionId) {
        var count = $(_input).attr('data-spacer');

        if (OptionsType[optionId] == 'Image') {
          var [value, scaledValue, count] = await checkStockorBreaker(_input);

          if (value != '' && value != 'Select a Stock Design' && value != undefined) {
            var imgObj = await renderImage(value, layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], layerSpecs[option.layer]['printWidth'], fillColor, option.optionId, scaledValue);
            if (!layerObjects[option.layer]) {
              layerObjects[option.layer] = [];
            }
            layerObjects[option.layer].push(imgObj);
          }
        }

        if (OptionsType[optionId] == 'Text') {
          if ((value != '' && value != 'Select a Stock Design')) {
            var [fontFamily, fontSize] = getFontdetails(_input);
            console.log(fontFamily, fontSize);
            var text = applyFonts(value.toUpperCase(), layerSpecs[option.layer]["x"], layerSpecs[option.layer]['y'], fillColor, fontFamily, fontSize, option.optionId);
            calculateFontSize(text, layerSpecs[option.layer]["printWidth"], layerSpecs[option.layer]['x']);
            if (!layerObjects[option.layer]) {
              layerObjects[option.layer] = [];
            }
            layerObjects[option.layer].push(text);
          }
        }

        if (count > 0) {
          getspacerCreateText(layerObjects, option.layer, count, layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], fillColor, 'Arial', 0, option.optionId);
        }
      }
    }
  }

  if ($(bottomSpacer).attr('data-spacer') > 0) {
    if (Object.keys(layerSpecs).length > 0) {
      option = CanvasOptions.find(option => option.optionId === $(bottomSpacer).attr('data-id'));
      getspacerCreateText(layerObjects, option.layer, Number($(bottomSpacer).attr('data-spacer')), layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], fillColor, 'Arial', 0, $(bottomSpacer).attr('data-id'));
    }
  }
  console.log("layerObjects", layerObjects)

  for (var key in layerObjects) {
    if (layerObjects.hasOwnProperty(key)) {
      var layer = layerObjects[key];
      var objectlist = []; // Reset objectlist for each layer
      removeExisitingObject(key);
      objectlist = objectlist.concat(processLayer(layer, layerSpecs[key]['printLength'], layerSpecs[key]['printWidth'], layerSpecs[key]['x'], layerSpecs[key]['y']));
      // Add the group to the printLineObjects array
      printLineObjects.push(createGroup(objectlist, key));
    }
  }
  if (printLineObjects.length == 0) removeAllObjects();

}



function processLayer(layer, printLength, printWidth, x, y) {

  var totalHeight = getTotalHeight(layer);

  if (totalHeight > printLength) {
    while (totalHeight > printLength) {
      var printLineObject; 
      var Index;
          layer.forEach((_Object, index) => {
            if (_Object.type == 'text') {
              if (printLineObject == undefined) printLineObject = _Object;
              if (_Object.fontSize > printLineObject.fontSize) {
                printLineObject = _Object;
                Index = index;
              }
            }
          });
      if (printLineObject.fontSize > 1) {
        printLineObject.set('fontSize', printLineObject.fontSize - 1);
        console.log('after reduce font size', printLineObject.fontSize);
        layer[Index] = printLineObject;
      }
        totalHeight = getTotalHeight(layer);
    }
  }

  console.log(getTotalHeight(layer));
  renderTextCenter(layer, printWidth, x);
  var remainingSpace = printLength - getTotalHeight(layer);
  console.log('remainingSpace', remainingSpace);
  var spaceBtn = getSpacebetweenOjects(remainingSpace, layer.length);
  console.log('spaceBtn', spaceBtn);
  var currentTop = y + spaceBtn;
  return positionObjects(layer, currentTop, spaceBtn)
}


// TO find the stock or breaker or customDesign
async function checkStockorBreaker(element, optionId) {
  var optionId = element.attr('id');
  var value = element.val();
  var scaleValue = element.attr('data-slider');
  var count = $(element).attr('data-spacer');
  if (optionId.includes('_')) {
    if (optionId.includes('_btn')) {
      value = $(element).eq(1).val();
      scaleValue = $(element).eq(1).attr('data-slider')
      count = $(element).eq(1).attr('data-spacer')
    }
    optionId = element.attr('id').includes("_") ? element.attr('id').split('_').slice(0, -1).join('_').split('_v')[0] : element.attr('id');
  }
  if (scaleValue == undefined) {
    scaleValue = 70;
    $(element).attr('data-slider', scaleValue);
  }
  if (CanvasImages[value]) {
    value = CanvasImages[value];
  } else if ($(element).attr('data-custom-design') == 'true') {
    //value = CanvasImages['customDesign'];
     fileName=$(element).attr('value');
     if(fileName==undefined){
      value = CanvasImages['customDesign'];
     }
     else{
        let imgFormat=fileName.split('.');
        let imgextension=imgFormat[imgFormat.length-1];
          const allowedFormats=['PNG', 'JPG', 'JPEG'];//not gif,halfly jfif,
           //, 'JPG', 'JPEG', 'GIF', 'JFIF', 'SVG']
         if(allowedFormats.includes(imgextension)){
           value= $('.new_custom img').eq(0).attr('src');
            value = await processPngImage(value);
          }
         else{
          value = CanvasImages['customDesign'];
          }
    }
  } else {
    let src = $(element).next('img').attr('src');
    if (src != '') value = await processImagePromise(src);
  }

  return [value, scaleValue, count];
}
function processPngImage(value) {
  return new Promise(function (resolve, reject) {
    var canvas = document.getElementById('stockCanvas');
    var img = new Image();
    img.src = value;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      // Draw the JPEG image onto the canvas
      ctx.drawImage(img, 0, 0);
      // Get the image's pixel data
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pixels = imageData.data;
     // var isFullyWhite = checkIfImageIsFullyWhite(ctx, img.width, img.height);
     // if(isFullyWhite){
         var isFullyWhite=checkIfImageCentreHasTransparent(ctx, img.width, img.height, 30);
        //  if(!val){
        //   isFullyWhite=false;
        //  }
     // }
      // Loop through the pixels and make white pixels transparent
      if(!isFullyWhite){
        for (var i = 0; i < pixels.length; i += 4) {
        var red = pixels[i];
        var green = pixels[i + 1];
        var blue = pixels[i + 2];
        // Check if the pixel is white (you can adjust the tolerance)
        if (isTransparent(red, green, blue)) {
          pixels[i + 3] = 0; // Set alpha (transparency) to 0
        }
      }
      }
     ctx.putImageData(imageData, 0, 0);
      ctx.globalCompositeOperation = "source-atop";
     // ctx.fillStyle = 'rgb(255, 0, 0)'; // red

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Put the modified pixel data back on the canvas
     
      var transparentPNG = canvas.toDataURL('image/png');
      // Resolve the Promise with the transparent PNG data URL
      resolve(transparentPNG);
    };
   img.src = value;
  });
}
function checkIfImageCentreHasTransparent(ctx, width, height, regionSize) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Calculate the center of the image
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  // Define the region size to check around the center
  const regionHalfSize = Math.floor(regionSize / 2);

  // Iterate over the defined region around the center
  for (let y = centerY - regionHalfSize; y <= centerY + regionHalfSize; y++) {
    for (let x = centerX - regionHalfSize; x <= centerX + regionHalfSize; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      // Check if the pixel is fully transparent
      if (alpha === 0) {
        return true; // Found a fully transparent pixel
      }
    }
  }

  return false; // No fully transparent pixels found in the region
}

// Helper function to check if a pixel is white (you can adjust the tolerance)
function isTransparent(r, g, b) {
  var tolerance = 40;// Adjust this value as needed
  return r > 255 - tolerance && g > 255 - tolerance && b > 255 - tolerance;
}
function checkIfImageIsFullyWhite(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  //const tolerance = 40;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
  if (alpha === 0) {
      return true; // Found a pixel fully transparent
  }
}
  return false; 
}

function processImagePromise(value) {
  return new Promise(function (resolve, reject) {
    var canvas = document.getElementById('stockCanvas');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      // Draw the JPEG image onto the canvas
      ctx.drawImage(img, 0, 0);
      // Get the image's pixel data
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pixels = imageData.data;
      // Loop through the pixels and make white pixels transparent
      for (var i = 0; i < pixels.length; i += 4) {
        var red = pixels[i];
        var green = pixels[i + 1];
        var blue = pixels[i + 2];
        // Check if the pixel is white (you can adjust the tolerance)
        if (isWhite(red, green, blue)) {
          pixels[i + 3] = 0; // Set alpha (transparency) to 0
        }
      }
      // Put the modified pixel data back on the canvas
      ctx.putImageData(imageData, 0, 0);
      // Convert the canvas to a PNG data URL
      var transparentPNG = canvas.toDataURL('image/png');
      // Resolve the Promise with the transparent PNG data URL
      resolve(transparentPNG);
    };
    img.src = value;
  });
}

// Helper function to check if a pixel is white (you can adjust the tolerance)
function isWhite(r, g, b) {
  var tolerance = 100; // Adjust this value as needed
  return r > 255 - tolerance && g > 255 - tolerance && b > 255 - tolerance;
}

// TO find the total height of the object
function getObjectHeight(obj) {
  if (obj.type === 'image') {
    return obj.getScaledHeight();
  } else if (obj.type === 'text') {
    return obj.height;
  }
}

// calculate the top position for the object
function positionObjects(objects, startTop, spacing) {
  var currentTop = startTop;
  return objects.map((obj) => {
    obj.set({ top: currentTop });
    currentTop += spacing + getObjectHeight(obj);
    return obj;
  });
}  

// generate the canvas as a URL based on the input
async function download() {
  var promises = [];
  let canvasPayload=[];
     for(id in canvasObjects){
      const promise = new Promise(async (resolve, reject) => {
        canvas.clear();
        canvasObjects[id].forEach(obj => {
          if (obj.id != 'ruler'){
            canvas.add(obj);
          }else{
            delete obj
          }
        });
        const canvasUrl = canvas.toDataURL({
          format: 'png',
          multiplier:2,
          quality: 1
        });
        let object={
        id:id,
        fileName: fileNamesArr[id] || null,
        url:canvasUrl,
       }
       canvasPayload.push(object)
        resolve();
        // const img = new Image();
        // img.src = canvasUrl;
        // img.id = id
        // img.onload = function () {
        //   const canvas = document.createElement('canvas');
        //   canvas.width = 100;
        //   canvas.height = 100;
        //   const ctx = canvas.getContext('2d');
        //   ctx.drawImage(img, 0, 0, 100, 100);
        //   const resizedBase64String = canvas.toDataURL({
        //     format: 'png',
        //     quality: 0.5
        //   });
        //   canvasThumbnails[img.id] = resizedBase64String;
        //   resolve(resizedBase64String);
        // };
        // img.onerror = function () {
        //   reject(new Error("Failed to load image"));
        // };
        });
        promises.push(promise);
      }
      await Promise.all(promises);
   var settings = {
        "url": "https://hops-connect.dev.hodgesbadge.com/api/Customizer/UploadCustomizerImages",
        "method": "POST",
        "timeout": 0,  
        "processData": true,
        "contentType": "application/json",
        "data": JSON.stringify(canvasPayload),
       };
       return new Promise((resolve, reject) => {
        $.ajax(settings).done(function (response) {
          // Assuming response is an array or object with URLs matching the canvasPayload ids
           response.forEach((res, index) => {
          const id = canvasPayload.id; // Adjust this line according to your payload structure
          canvasThumbnails[ response[index].id] = res.url;
           }); 
          resolve(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
          reject(errorThrown);
          document.getElementById("loaderbg").style.display = "none";
          $(".fa-spin").hide();
           alert('Something went wrong! Please try again!')
          //$(".reject_error").show();
          return false;
        });
      });
}

function getThumbSrc(id)
{
  return canvasThumbnails[id]
}

// Function to get the fontFamily & trigger input field
async function changeFontFamily(_this, id) {
    if(id==="02All"){
    var value=document.querySelectorAll('.fontapply')
    console.log(value,'value')
   value.forEach(function(element) {
  element.setAttribute('data-font-family', $(_this).val());
 });
  await renderTextOnCanvas();
  renderCanvas()
  $('#canvasName').text('');
  // await applyToVariations();
  $("#container2").hide();
  $("#container1").show();
  selectedSlider($(`#${hopsProdId}`));
    await applyToVariations();
    var input = $(`#${id}:input`);
    input.attr('data-font-family', $(_this).val())

  }
  else{
    console.log($(_this).val())
    var input = $(`#${id}:input`);
    var inputs = $(`[name="${id}"]`);

    inputs.attr('data-font-family', $(_this).val())
  }
  
  input.trigger('input');
  input.trigger('change');
}

// Function to get the fontSize & trigger input field
async function changeFontSize(_this, id) {
    if(id==="02All"){
    var value=document.querySelectorAll('.fontapply')
    // console.log(value,'value')
   value.forEach(function(element) {
  element.setAttribute('data-font-size', $(_this).val());

   });
   await renderTextOnCanvas();
   renderCanvas();
 // await applyToVariations();
   $('#canvasName').text('');
   $("#container2").hide();
   $("#container1").show();
   selectedSlider($(`#${hopsProdId}`));
   await applyToVariations();
   var input = $(`#${id}:input`);
   input.attr('data-font-size', $(_this).val())
  }
  else{
    var input = $(`#${id}:input`);
    var inputs = $(`[name="${id}"]`);
    inputs.attr('data-font-size', $(_this).val())
  }

  input.trigger('input');
  input.trigger('change');
}

//Function to get the fontSize & fontfamily
function getFontdetails(input) {
  console.log(input,'inputtt');
  var family = input.attr('data-font-family')
  var size = input.attr('data-font-size')
  if (family == undefined || family == "") {
    family = defaultFont.fontFamily;
    input.attr('data-font-family', family)
  }
  if (size == undefined || size == "") {
    size = defaultFont.fontSize;
    input.attr('data-font-size', size)
  }
  return [family, size]
}

//Function to get the slider value & trigger input field
function onSliderChange(_this, id) {
 var value = $(_this).val();
  var slider = $(_this).next().first();
  var input = $(`#${id}:input`);
  slider.text(value);
  if (id.includes('eitheror')) {
    $('#' + _this.id + '_new').val(value);
    // Update the text of the next sibling of the element
    $('#' + _this.id + '_new').next().first().text(value);
    input = onSlidereitherorChange(_this);
  }
  input.attr('data-slider', value);
  input.trigger('change')
  $('.showtoggle').css('display','none');

}

// To load the all font fiels
function fontload() {
  if (fontFamily == null || fontFamily == undefined) return false
  fontFamily.forEach(function (font, index) {
    var Text = new fabric.Text('load', {
      fontFamily: font.fontFamilyName,
    });
  })
}

// // TO display the dropdown based on the input field value
// function  showOrHideElement(_this){
//   if(_this.type == 'text'){
//     var value = $(_this).val();
//     if(value.trim() != ''){
//       console.log($(_this).nextAll('div.select-container'))
//       $(_this).nextAll('div.select-container').show()
//     }
//     else{
//       $(_this).nextAll('div.select-container').hide()
//     }
//   }
// }

// TO add the spacer element
function addSpacer(_this, id) {
  event.preventDefault();
  var count = getLinesCount();
  var input = $(`#${id}:input`);
  if ((20 - count) < 0) return false;
  if ((20 - count) == spacer){
     showToaster(); 
     return false;
   }
  if(!calculateRemainingSpace(_this,id)) return false;
  var spacerContainer = $("<div class='spacercontainer space'><div class='hr-line'></div><span class='spacebtn'>space</span> " +
    "<div class='hr-line'></div> <span class='spacerclose' data-toggle='tooltip' data-placement='top' title='Remove Spacer'> <i class='fa fa-times' aria-hidden='true'></i> </span></div>");
  spacerContainer.hide();
  $(`.spacer.${id}`).append(spacerContainer);
  spacerContainer.slideDown(400, function () {
  });
  spacer++;
  var spacerCount = $(`.spacer.${id}`).children().length;
  console.log(spacerCount)
  if (id.includes('top')) {
    input = $(_this).nextAll('LI').first().find('input[onchange], input[oninput], select[onchange]');
    let Id = $(input).attr('name')
    if (Id.includes('ExtraField')) {
      Id = Id.split('ExtraField')[0];
    }
    $(`#${id}`).attr('data-spacer', spacerCount)
    $(`#${id}`).attr('data-id', Id)
    // input.trigger('change');
    // input.trigger('input');
    canvasColorization(input);
  }
  else if (id.includes('bottom')) {
    input = $(`#${id}`).parent().children('LI').last().find('input[onchange], input[oninput],select[onchange]')
    $(`#${id}`).attr('data-spacer', spacerCount)
    $(`#${id}`).attr('data-id', $(input).attr('name'))
    // input.trigger('change');
    // input.trigger('input');
    canvasColorization(input);
  }
  else {
    if (id.includes('eitherorSeq')) {
      input = onSlidereitherorChange(_this);
    }
    if (id.includes('ExtraField')) {
      let key = id.split('ExtraField')[0];
      let field = $(`#${key}`);
      console.log(field, "field")
      field.attr('data-spacer', spacerCount);
    }
    input.attr('data-spacer', spacerCount);
    canvasColorization(input);
  }
  $('.spacer.' + id).off('click', '.spacerclose').on('click', '.spacerclose', function () {
    removeSpacer($(this), id);
  });
}

// TO remove a spacer element
function removeSpacer(_this, id) {
  var input = $(`#${id}:input`);
  var spacerContainer = $(_this).closest('.spacercontainer'); // Get the closest spacer container

  spacerContainer.slideUp(400, function () {
    // After the slideUp animation is complete, remove the spacer container
    spacerContainer.remove();
    spacer--; // Decrement spacer count
    var spacerCount = $(`.spacer.${id}`).children().length;
    if (id.includes('top')) {
      input = $(`#${id}`).nextAll('LI').first().find('input[onchange], input[oninput]');
      $(`#${id}`).attr('data-spacer', spacerCount)
      canvasColorization(input);
    }
    else if (id.includes('bottom')) {
      input = $(`#${id}`).parent().children('LI').first().find('input[onchange], input[oninput]')
      $(`#${id}`).attr('data-spacer', spacerCount)
      // input.trigger('change');
      // input.trigger('input');
      canvasColorization(input);
    }
    else {
      if (id.includes('eitherorSeq')) {
        input = onSlidereitherorChange(_this);
      }
      if (id.includes('ExtraField')) {
        let key = id.split('ExtraField')[0];
        let field = $(`#${key}`);
        console.log(field, "field")
        field.attr('data-spacer', spacerCount);
      }
      input.attr('data-spacer', spacerCount);
      canvasColorization(input);
    }
  });
  $('.spacer.' + id).off('click', '.spacerclose').on('click', '.spacerclose', function () {
    removeSpacer($(this), id);
  });
}

// to create a spacer
function getspacerCreateText(layerObjects, id, count, printWidth, y, fillColor, fontFamily, fontSize, optionId) {
  for (var i = 0; i < count; i++) {
    // if(isBase){
    //  removeExisitingObject(id);
    // }
    if (!layerObjects[id]) {
      layerObjects[id] = [];
    }
    layerObjects[id].push(applyFonts('', printWidth, y, fillColor, fontFamily, 0, optionId));
  }
}

// // TO display the variation  dropdown based on input value
// function showOrHideElementVariation(_this){
//   if(_this.type == 'text'){
//     var value = $(_this).val();
//     if(value.trim() != ''){
//       $(_this).next('div.select-container').show()
//       console.log(_this)
//       console.log($(_this).next('div.select-container').show())
//     }
//     else{
//       $(_this).next('div.select-container').hide()
//     }
//   }
// }

// TO trigger the input field
function changeFontFamilyVariation(input, _this) {
  var input = input;
  input.attr('data-font-family', $(_this).val())
  input.trigger('input');
  input.trigger('change');
}

// Function to get the fontSize & trigger input field
function changeFontSizeVariation(input, _this) {
  var input = input;
  input.attr('data-font-size', $(_this).val())
  input.trigger('input');
  input.trigger('change');
}
function getVariationNId(_this) {
  var variation = $(_this).closest('ul').parent().parent().children('LABEL');
  var id = 'V' + variation.attr('data-variation');
  var optionId = $(_this).attr('id');
  // if (optionId.includes('_')) {
  //   optionId = optionId.split('_').slice(0, -1).join('_');
  // }
  // if (optionId.includes('ExtraField')) {
  //   optionId = optionId.split('ExtraField')[0];
  // }
  return [id, optionId]
}

// trigger fucntion based on the variation input field
async function canvasVariation(_this, VarID) {
  if (!_isCanvasEnabled) return false;
  printLineVariationObjects = [];
  $("#container1").hide();
  $("#container2").show();
  var clonedCanvas;
  var elements = $(_this).closest('ul').children()
  var variationObject = {};
  var [id, optionId] = getVariationNId(_this);
  if ($(".big_image").css('display') != 'block') {
    $('#canvasName').css('visibility', 'hidden')
  }
  selectedSlider($(`#${id}`));
  $('#canvasName').text('Variation ' + id.split('V')[1]);
  $('#canvasName').attr('Variation', id.split('V')[1]);
  console.log(window.innerWidth,'innerwidr');
  if(window.innerWidth>=999){
     $(".customizer_btn.product-gallery__thumbnail").click();
  }
  if (VarID != undefined) {
    id = VarID;
    elements = $(_this).children()
  }
  if (!canvasObjects[id]) {
    if (canvasObjects[hopsProdId]) {
      canvasObjects[id] = cloneObjectsOnCanvas(canvasObjects[hopsProdId]);
    } else {
      canvasObjects[id] = cloneObjectsOnCanvas(canvas.getObjects())
    }
  }
  clonedCanvas = canvasObjects[id];

  canvas2.clear();
  clonedCanvas.forEach(obj => canvas2.add(obj));
  canvas2.renderAll();
  applyRuler(false)
  for (element of elements) {
    var input = $(element).find('INPUT,SELECT');
    var value = input.val();
    if (input.is('select')) {
      value = input.find("option:selected").text().trim();
      if ((value == '- Select an Option -') || (value == "")) {
        value = input.eq(1)
        input = value;
        value = $(value).val()
      }
    }
    if ($(input).attr('id') == undefined) continue
    var varId = $(input).attr('id').includes("_") ? $(input).attr('id').split('_').slice(0, -1).join('_').split('_v')[0] : $(input).attr('id');
    for (var option of CanvasOptions) {

      if (varId == option.optionId) {
        if (OptionsType[varId] == "Color") {
          var obj = canvas2.getObjects().find(obj => obj.id === option.layer);
          await findColorOrPattern(obj, input, option,id)
        }
        else if (OptionsType[varId] == "PrintColor") {
          findPrintColor(input);
          variationObject[varId] = input;
        } else if (OptionsType[varId] == "Border") {
          await findBorder(_this, option)
          variationObject[varId] = input;
        } else if (OptionsType[varId] == "Text" || OptionsType[varId] == "Image") {
          variationObject[varId] = input;
          console.log(variationObject);
        }
      }
    }

  }
  await renderTextOnCanvasVariation(variationObject, true);
  await rendercommonOption(canvas2, variationObject,id);
  if (printLineVariationObjects.length > 0) {
  canvasObjects[id] = canvasObjects[id].filter((canvasObj) => {
    return !printLineVariationObjects.some((newObj) => {
        return (newObj.id === canvasObj.id && newObj.type === 'group') || (canvasObj.type === 'group');
    });
});
  canvasObjects[id].push(...printLineVariationObjects);
    printLineVariationObjects = [];
  }
  canvas2.renderAll();
  var objectsOnCanvas = canvas2.getObjects();
  if (objectsOnCanvas.length > 0) {
    canvasObjects[id].forEach(obj => canvas2.add(obj));
    canvas2.renderAll();
  }
  await updateSrc(canvas2,id);
 const targetImage = $('.view_slider').eq(id.split('V')[1]);
  const container = $('.image-container');
  const containerHeight = container.height();
  const imageHeight = targetImage.height();
  const targetScrollTop = targetImage.offset().top - container.offset().top + container.scrollTop() - (containerHeight - imageHeight) / 2;
  container.animate({
    scrollTop: targetScrollTop
  }, 'slow');
}


// render the text on variation canvas
async function renderTextOnCanvasVariation(variationObject, isbase) {
  var layerObjectsvariation = {};
  var fillColor = PrintColor;
  var topSpacer = $('#sortableoptions').first().find('input')[0];
  var bottomSpacer = $('#sortableoptions').last().find('input').last();
  if ($(topSpacer).attr('data-spacer') > 0) {
    if (Object.keys(layerSpecs).length > 0) {
      option = CanvasOptions.find(option => option.optionId === $(topSpacer).attr('data-id'));
      getspacerCreateText(layerObjectsvariation, option.layer, Number($(topSpacer).attr('data-spacer')), layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], fillColor, 'Arial', 0, $(topSpacer).attr('data-id'));
    }
  }

  for (var element of $('#sortableoptions li')) {
    var _input = $(element).find("input,select");
    var value = _input.val();
    var optionId = _input.attr('id');
    if (_input.attr('id') == undefined) continue
    if (_input.attr('id').includes('_')) {
      optionId = _input.attr('id').includes("_") ? _input.attr('id').split('_').slice(0, -1).join('_').split('_v')[0] : _input.attr('id');
    }
    if (optionId.includes('ExtraField')) {
      optionId = _input.attr('id').includes("ExtraField") ? _input.attr('id').split('ExtraField').slice(0, -1).join('_').split('_v')[0] : _input.attr('id');

    }
    if (_input.is('select')) {
      value = _input.find("option:selected").text().trim();
      if (value == '- Select an Option -'|| value == "" ) {
        value = _input.eq(1)
        _input = value;
        value = $(value).val()
      }
    }
    if ($(element).hasClass("eitheror-group")) {
      [_input, optionId] = processEitherorElement(_input, optionId);
    }
    for (var option of CanvasOptions) {

      if (optionId == option.optionId) {
        var count = $(_input).attr('data-spacer');

        if (OptionsType[optionId] === 'Image') {
          var [value, scaledValue, count] = await checkStockorBreaker(_input);

          if (value != '' && value != 'Select a Stock Design' && value !== undefined) {
            var imgObj = await renderImage(value, layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], layerSpecs[option.layer]['printWidth'], fillColor, option.optionId, scaledValue);
            if (!layerObjectsvariation[option.layer]) {
              layerObjectsvariation[option.layer] = [];
            }
            layerObjectsvariation[option.layer].push(imgObj);
          }
        }

        if (OptionsType[optionId] === 'Text') {
          if ((value != '' && value != 'Select a Stock Design') || (variationObject[optionId] !== undefined && variationObject[optionId].val() != '')) {
            // var [fontFamily, fontSize] = getFontdetails(_input);
            
            if (variationObject[optionId] !== undefined) {
              _input = variationObject[optionId];
              value = _input.val();
              if (_input.is('select')) {
                value = _input.find("option:selected").text().trim();
                if (value == '- Select an Option -') {
                  value = _input.eq(1)
                  _input = value;
                  value = $(value).val()
                }
              }
            }
            var [fontFamily, fontSize] = getFontdetails(_input);
            console.log(fontFamily, fontSize);
            var text = applyFonts(value.toUpperCase(), layerSpecs[option.layer]["x"], layerSpecs[option.layer]['y'], fillColor, fontFamily, fontSize, option.optionId);
            calculateFontSize(text, layerSpecs[option.layer]["printWidth"], layerSpecs[option.layer]['x']);
            if (!layerObjectsvariation[option.layer]) {
              layerObjectsvariation[option.layer] = [];
            }
            if (text['text'] == "") {
              continue;
            } else {
              layerObjectsvariation[option.layer].push(text);
            }

          }
        }

        if (count > 0) {
          getspacerCreateText(layerObjectsvariation, option.layer, count, layerSpecs[option.layer]['x'], layerSpecs[option.layer]['y'], fillColor, 'Arial', 0, option.optionId);
        }
      }
    }
  }
  if ($(bottomSpacer).attr('data-spacer') > 0) {
    if (Object.keys(layerSpecs).length > 0) {
      option = CanvasOptions.find(option => option.optionId === $(bottomSpacer).attr('data-id'));
      getspacerCreateText(layerObjectsvariation, option.layer, Number($(bottomSpacer).attr('data-spacer')), layerSpecs[option.layer]["x"], layerSpecs[option.layer]['y'], fillColor, 'Arial', 0, $(bottomSpacer).attr('data-id'));
    }
  }



  for (var key in layerObjectsvariation) {
    let objectlist = [];
    if (layerObjectsvariation.hasOwnProperty(key)) {
      var layer = layerObjectsvariation[key];
      if (isbase) {
        removeExisitingObjectvariation(key);
      }
      objectlist = objectlist.concat(processLayer(layer, layerSpecs[key]['printLength'], layerSpecs[key]['printWidth'], layerSpecs[key]['x'], layerSpecs[key]['y']));
      // Add the group to the printLineObjects array
      printLineVariationObjects.push(createGroup(objectlist, key));
    }
  }
  if (printLineVariationObjects.length == 0) removeAllObjectsvariation();
}

// to render the canvas when remove the variation
function removecanvasObject(element) {

  var varId = $(element).attr('data-variation');
  var canvasName = $('#canvasName');
  var ID = canvasName.attr('variation');

  if (!canvasObjects['V' + varId]) {
    return false;
  }

  delete canvasObjects['V' + varId];
  $(`#V${varId}`).prev().remove();
  $(`#V${varId}`).remove();
  canvasObjects = variationSort(canvasObjects);
  var updatedObj = {};
  var index = 0;

  for (var key in canvasObjects) {
    if (key === hopsProdId) {
      updatedObj[key] = canvasObjects[key];
      $(`#V${key}`).prev().text('Base');
      index++
    } else {
      updatedObj['V' + index] = canvasObjects[key];
      $(`#${key}`).attr('id',`V${index}`);
      $(`#V${index}`).prev().text(`V${index}`);
      index++; 
    }
  }

  canvasObjects = updatedObj;
  var keys = Object.keys(canvasObjects);
  if (ID == varId) {
    while (varId > 0) {
      if (keys.includes('V' + varId)) {
        $("#container1").hide();
        $("#container2").show();
        canvasName.text('variation ' + varId);
        canvasName.attr('variation', varId);
        canvas2.clear();
        canvasObjects['V' + varId].forEach(obj => canvas2.add(obj));
        canvas2.renderAll();
        updateImageSrc(canvas2);
      //   var dataURL = canvas2.toDataURL();
      // $("#MobileCanvasImage img").attr("src", dataURL);
      // $(".view_custom_canvas img").attr("src", dataURL);
    
        $(`#V${varId}`).addClass('isSelect')
        break; // Exit the loop if a valid key is found
      }
      varId = varId - 1; // Decrement varId
    }
    if (varId <= 0) {
      $("#container2").hide();
      $("#container1").show();
      canvasName.text('');
      canvasName.removeAttr('variation');
      canvas.clear();
      canvasObjects[hopsProdId].forEach(obj => canvas.add(obj));
      canvas.renderAll();
      updateImageSrc(canvas);
      // var dataURL = canvas.toDataURL();
      // $("#MobileCanvasImage img").attr("src", dataURL);
      // $(".view_custom_canvas img").attr("src", dataURL);
      $(`#${hopsProdId}`).addClass('isSelect')

    }
  } else if (ID > varId) {
    var Ids = Number(ID) - 1;
    canvasName.text('variation ' + Ids);
    canvasName.attr('variation', Ids);
  }
}


// TO update the all the variation object properties like base product
// async function applyToVariations() {
//   // var urlParams = new URLSearchParams(window.location.search);
//   // if (urlParams.has("cart_id")) {
//   //   return false
//   // } 
//   // if(!Editcustom) return false;
//   if ($(".variationsAddToCart")[0]) {
//     printLineVariationObjects = [];
//     for (var elementI of $(".variationsAddToCart")) {
//       var _varId = $(elementI).attr("id");
//       // console.log($(elementI).childrenAll('label').eq(0));
//       let ele = $(elementI).find('label').eq(0)
//       var variationObject = {};
//       var Variation_id = 'V'+$(ele).attr('data-variation');
//       if (baseObjects) {

//         canvasObjects[Variation_id] = cloneObjectsOnCanvas(canvas.getObjects())

//       }
//       for (var element of $("#" + _varId + " li")) {
//         var input = $(element).find('input');
//         if ($(input).attr('id') == undefined) continue
//         var varId = $(input).attr('id').includes("_") ? $(input).attr('id').split('_').slice(0, -1).join('_').split('_v')[0] : $(input).attr('id');

//         for (var option of CanvasOptions) {
//           var obj = canvasObjects[Variation_id].find(obj => obj.id === option.layer);
//           if (varId == option.optionId) {
//             if (OptionsType[varId] === "Color") {
//               // await findColorOrPattern(obj, input, option);
//               obj.filters = [new fabric.Image.filters.BlendColor({ color: '#000000' })];
//               obj.applyFilters();
//             } else if (OptionsType[varId] === "PrintColor") {
//               findPrintColor(input);
//             } else if (OptionsType[varId] == "Border") {
//               await findBorder(_this, option)
//             } else if (OptionsType[varId] === "Text" || OptionsType[varId] == "Image") {
//               variationObject[varId] = input;
//             }
//           }
//         }
//       }

//       if (Object.keys(variationObject).length > 0) {
//         await renderTextOnCanvasVariation(variationObject, false);
//       }
//       if (printLineVariationObjects.length > 0) {

//         canvasObjects[Variation_id] = canvasObjects[Variation_id].filter(obj => obj.id == 'ruler' || obj.isBaseimg == true);
//         canvasObjects[Variation_id].push(...printLineVariationObjects);
//         printLineVariationObjects = [];
//         if (isborder) {
//           if (borderObjects.length > 0) {
//             canvasObjects[Variation_id].push(...borderObjects);
//           }
//         }
//         if (canvasObjects[Variation_id].length > 0) {
//           // canvasObjects[Variation_id] = cloneObjectsOnCanvas(canvasObjects[Variation_id])
//         }
//       }
//       updateSrc( canvasObjects[Variation_id],Variation_id,true);
//     }
//   }
// }
async function applyToVariations(edit = false){
  await updateSrc(canvas,hopsProdId); 
  if ($(".variationsAddToCart")[0]) {
        printLineVariationObjects = [];
        var clonedCanvas;
      for (var elementI of $(".variationsAddToCart")) {
          var _varId = $(elementI).attr("id");
          let ele = $(elementI).find('label').eq(0)
          var variationObject = {};
          var Variation_id = 'V'+$(ele).attr('data-variation');
          if (baseObjects) {
            canvasObjects[Variation_id] = cloneObjectsOnCanvas(canvas.getObjects())
          }
          // if (!canvasObjects[Variation_id]) {
          //   if (canvasObjects[hopsProdId]) {
          //     canvasObjects[Variation_id] = cloneObjectsOnCanvas(canvasObjects[hopsProdId]);
          //   } else {
          //     canvasObjects[Variation_id] = cloneObjectsOnCanvas(canvas.getObjects())
          //   }
          // }
          clonedCanvas = canvasObjects[Variation_id];
          canvas2.clear();
          clonedCanvas.forEach(obj => canvas2.add(obj));
          canvas2.renderAll();
          for (var element of $("#" + _varId + " li")) {
            var input = $(element).find('INPUT,SELECT');
            var value = input.val();
            if (input.is('select')) {
              value = input.find("option:selected").text().trim();
              if ((value == '- Select an Option -') || (value == "")) {
                value = input.eq(1)
                input = value;
                value = $(value).val()
              }
            }
            if ($(input).attr('id') == undefined) continue
            var varId = $(input).attr('id').includes("_") ? $(input).attr('id').split('_').slice(0, -1).join('_').split('_v')[0] : $(input).attr('id');
            for (var option of CanvasOptions) {
              if (varId == option.optionId) {
                if (OptionsType[varId] == "Color") {
                  var obj = canvas2.getObjects().find(obj => obj.id === option.layer);
                  await findColorOrPattern(obj, input, option);
                } else 
                if (OptionsType[varId] == "PrintColor") {
                  findPrintColor(input);
                  variationObject[varId] = input;
                } else if (OptionsType[varId] == "Border") {
                  await findBorder(_this, option)
                  variationObject[varId] = input;
                } else if (OptionsType[varId] == "Text" || OptionsType[varId] == "Image") {
                  variationObject[varId] = input;
                  console.log(variationObject);
                }
              }
            }
          }
          await renderTextOnCanvasVariation(variationObject, true);
          await rendercommonOption(canvas2, variationObject,Variation_id);
          if (printLineVariationObjects.length > 0) {
            canvas2.add(...printLineVariationObjects);
            canvasObjects[Variation_id] = canvasObjects[Variation_id].filter((canvasObj) => {
              return !printLineVariationObjects.some((newObj) => {
                  return (newObj.id === canvasObj.id && newObj.type === 'group') || (canvasObj.type === 'group');
              });
          });
            canvasObjects[Variation_id].push(...printLineVariationObjects);
            printLineVariationObjects = [];
            canvas2.renderAll();
          }
          canvas2.renderAll();
          var objectsOnCanvas = canvas2.getObjects();
          if (objectsOnCanvas.length > 0) {
            canvasObjects[Variation_id] = canvasObjects[Variation_id];
            if(edit){
              await updateSrc(canvas2,Variation_id,false,true); 
            }
          }
          }
        }
}
// TO prefill the fontfamily & fontsize
function prefillfontDetails(_this, Family, size) {
  if ($(_this).attr('type') == 'text'|| _this.is('select') ) {
    var value = $(_this).val();
    if (value.trim() != '' && value != null) {
      _this.attr('data-font-family', Family)
      _this.attr('data-font-size', size)
    }
  }
}

// TO prefill the spacer
function prefillSpacer(_this, count) {
  var id = $(_this).attr('id');
   var extraFieldValue=$(_this).hasClass("extraFieldValue")
  if(extraFieldValue){
  var extraField=$(".print_input_place");
   var extraFieldId= $(extraField).attr('id');
     id=extraFieldId;
    _this=extraField;
  }
  var input = _this
  var spacerElement = $(`.spacer.${id}`);
  for (var i = 0; i < count; i++) {
    var spacerContainer = $(`
      <div class="spacercontainer space">
        <div class="hr-line"></div>
        <span class="spacebtn">space</span>
        <div class="hr-line"></div>
        <span class="spacerclose" data-toggle="tooltip" data-placement="top" title="Remove Spacer">
          <i class="fa fa-times" aria-hidden="true"></i>
        </span>
      </div>
    `);
    spacerContainer.hide();
    $(`.spacer.${id}`).append(spacerContainer);
    spacerContainer.slideDown(400, function () {
    });
    spacerElement.off('click', '.spacerclose').on('click', '.spacerclose', function () {
      removeSpacer($(this), id);
    });
    spacer++
  } if (id.includes('top')) {
    input = $(_this).nextAll('LI').first().find('input[onchange], input[oninput]')
    let Id = $(input).attr('name')
    if (Id.includes('ExtraField')) {
      Id = Id.split('ExtraField')[0];
    }
    $(`#${id}`).attr('data-id', Id)
    $(`#${id}`).attr('data-spacer', count)
  }
  else if (id.includes('bottom')) {
    input = $(`#${id}`).parent().children('LI').first().find('input[onchange], input[oninput]')
    let Id = $(input).attr('name')
    if (Id.includes('ExtraField')) {
      Id = Id.split('ExtraField')[0];
    }
    $(`#${id}`).attr('data-id', Id)
    $(`#${id}`).attr('data-spacer', count)
  }
   else if($(_this).hasClass("design_option")){
    input.attr('data-spacer', count);
    $('#uploadclick_seq').attr("data-spacer",count);
  }
  else if($(_this).hasClass("print_input_place")){
    input.attr('data-spacer', count);
    $('.extraFieldValue').attr("data-spacer",count);
  }
  else {
    input.attr('data-spacer', count);
  }
}

// TO prefill the range slider
function prefillrange(_this, value) {
  var id = $(_this).attr('id');
  var slider = $(`#slider_${id}`)
  if (id.includes('eitherorSeq')) {
    slider = $(`#${id}`);
    $('#' + $(slider).attr('id') + '_new').val(value);
    $('#' + $(slider).attr('id') + '_new').next().first().text(value);
  }
  if (slider) {
    var sliderSpan = $(slider).next().first();
    sliderSpan.text(value);
    slider.val(value)
    _this.attr('data-slider', value);
  }
}

// TO create the properties for each product
function createProperties(_this) {
  console.log(_this,'thisssssss');
  var sorting_order = _this.attr('data-sortingorder');
  console.log(sorting_order, "sorting_order");
  var slider = _this.attr('data-slider');
  var spacer = _this.attr('data-spacer');
  var family = _this.attr('data-font-family')
  var size = _this.attr('data-font-size')
  var dataLabel=_this.attr("data-label");
  family = (typeof family === 'undefined') ? 0 : family;
  size = (typeof size === 'undefined') ? 0 : size;
  spacer = (typeof spacer === 'undefined') ? 0 : spacer;
  slider = (typeof slider === 'undefined') ? 0 : slider;
  var object = family + '~' + size + '~' + spacer + '~' + slider + '~' + sorting_order + '~' + dataLabel;
  return object;
}

// TO trigger the prefill function for every properties
function prefillcanvasProperties(_this, props) {
  var id;
  if ($(_this).attr('id') == undefined) return false
   if(!$(_this).attr('id').includes('_v')){
   id = $(_this).attr('id').split('_')[0];
  }else{
    id = $(_this).attr('id')
  }
  if (props[id]) {
    if ((props[id].split('~')[0] != 0) || (props[id].split('~')[1] != 0)) {
      prefillfontDetails(_this, props[id].split('~')[0], Number(props[id].split('~')[1]))
    }
    if (props[id].split('~')[2] != 0) {
      prefillSpacer(_this, Number(props[id].split('~')[2]))
    }
    if (props[id].split('~')[3] != 0) {
      prefillrange(_this, Number(props[id].split('~')[3]));
    }
    // _this.trigger('input');
    // _this.trigger('change');
  }
}

// TO create spacer property for product
function gettopBottomSpacer() {
  var topSpacer = $('#sortableoptions').first().find('input').eq(0).attr('data-spacer');
  var bottomSpacer = $('#sortableoptions').first().find('input').last().attr('data-spacer');
  var object = 0
  topSpacer = (typeof topSpacer === 'undefined') ? 0 : topSpacer;
  bottomSpacer = (typeof bottomSpacer === 'undefined') ? 0 : bottomSpacer;
  object = topSpacer + '~' + bottomSpacer;
  return object
}
function getApplyFontdetails(){
    var fontFamily=document.getElementById('02All').getAttribute('data-font-family');
    var fontSize=document.getElementById('02All').getAttribute('data-font-size');
    var object = 0
    object = fontFamily + '~' + fontSize;
    return object
}
// To prefill the top & bottom spacer also empty spacer
function prefilltopbottom(canvasprop, props) {
  if (canvasprop['spacer']) {
    var topSpacer = $('#sortableoptions').first().find('input').eq(0)
    var bottomSpacer = $('#sortableoptions').first().find('input').last()
    parts = canvasprop['spacer'].split('~');
    if (parts[0] != 0) prefillSpacer(topSpacer, Number(parts[0]));
    if (parts[1] != 0) prefillSpacer(bottomSpacer, Number(parts[1]));
  }
  if (canvasprop['eitherorSeq']) {
    var Spacer = $('.spacer.eitherorSeq_option');
    var slider = $('.slider-container.eitherorSeq_option').find('input');
    parts = canvasprop['eitherorSeq'].split('~');
    if (parts[0] != 0) prefillSpacer(Spacer, Number(parts[0]));
    if (parts[1] != 0) prefillrange(slider, Number(parts[1]));
  }
  $(Object.keys(canvasprop)).each((index, element) => {
    if (!props['_' + element]) {
      var _dom = $("[name='" + element + "']");
      if (Number(canvasprop[element].split('~')[2]) > 0)
        prefillSpacer(_dom, canvasprop[element].split('~')[2])
    }
  });
}

function prefillaplyall(canvasprop, props){
  if(canvasprop['Apply']!=undefined){
  var value=canvasprop['Apply'].split('~');
  document.getElementById('02All').setAttribute('data-font-family',value[0])
  document.getElementById('02All').setAttribute('data-font-size',value[1])
  var fontApply=document.querySelectorAll('.fontapply')
    fontApply.forEach(function(element) {
    if((!element.hasAttribute('data-font-family')) && (!element.hasAttribute('data-font-size'))){
      element.setAttribute('data-font-family',value[0]);
      element.setAttribute('data-font-size',value[1]);
    }
 // element.setAttribute('data-font-family', $(_this).val());
});
  // (document.getElementById('02All'))
  }
}
// function to render the canvas when click customizer btn
// function displayCanvas(_this) {
//   var customEvent = jQuery.Event("click");
//   customEvent.isreal = true;
//     $(".customizer_btn.product-gallery__thumbnail").trigger(customEvent);
//   var count = $(_this).prev().attr('data-variation');
//   if (count == undefined && canvasObjects[hopsProdId]) {
//     $("#container2").hide();
//     $("#container1").show();
//     $('#canvasName').text('');
//     $('#canvasName').removeAttr('variation');
//     canvas.clear()
//     canvasObjects[hopsProdId].forEach(obj => canvas.add(obj));
//     applyRuler(false)
//     selectedSlider($(`#${hopsProdId}`));
//     canvas.renderAll();
//   }
//   else {
//     canvasVariation($(_this).nextAll('div').children('ul'), 'V' + count)
//   }
// }


function displaySliderCanvas(_this) {
   event.stopPropagation(); // Prevent event propagation
  let varId =  $(_this).attr('id')
  let ID = $(_this).attr('id').split('V')[1];
  selectedSlider(_this)
  if (ID == undefined && canvasObjects[hopsProdId]) {
    $("#container2").hide();
    $("#container1").show();
    $('#canvasName').text('');
    $('#canvasName').removeAttr('variation');
    canvas.clear()
    canvasObjects[hopsProdId].forEach(obj => canvas.add(obj));
    applyRuler(false)
    console.log( $(`span[data-id=${varId}]`))
      if(window.innerWidth<=767){
          window.scrollTo({
            top: 240,
            behavior: 'smooth'
          });
  }
  else{
    $(`span[data-id=${varId}]`).focus();
  }
    canvas.renderAll();
    updateImageSrc(canvas);
    // var dataURL = canvas.toDataURL();
    // console.log(dataURL,'slidercaaaa');
    // if(window.innerWidth<=999){
      // $("#MobileCanvasImage img").attr("src", dataURL);
      // $(".view_custom_canvas img").attr("src", dataURL);
    // }
  }
  else {
    // $(`label[data-variation=${ID}]`).focus();
    if(window.innerWidth<=767){
      const element = document.querySelector(`label[data-variation='${ID}']`);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        // const elementWidth = elementRect.width;
        const elementHeight = elementRect.height;       
        // Calculate the center position
        // const scrollX = elementRect.left + window.scrollX - (window.innerWidth / 2) + (elementWidth / 2);
        const scrollY = elementRect.top + window.scrollY - (window.innerHeight / 2) + (elementHeight / 2);
        const adjustment = 200;
        window.scrollTo({
          top: scrollY-adjustment,
          // left: scrollX,
          behavior: 'smooth'
        });
      }
}
else{
  $(`label[data-variation=${ID}]`).focus();
}
    canvasVariation($(`label[data-variation=${ID}]`).nextAll('div').children('ul'), varId)
  }
} 
// function to sort the variation by ascending order
function variationSort(canvasObjects) {
  var orderedCanvasObjects = {};

  // First, add 'base' to the ordered object
  if (hopsProdId in canvasObjects) {
    orderedCanvasObjects[hopsProdId] = canvasObjects[hopsProdId];
  }

  // Then, sort the keys with 'v' and numbers
  var vkeys = Object.keys(canvasObjects).filter(key => key.startsWith('V'));
  vkeys.sort((a, b) => {
    var numA = parseInt(a.substring(1));
    var numB = parseInt(b.substring(1));
    return numA - numB;
  });

  // Add the sorted 'v' keys to the ordered object
  vkeys.forEach(key => {
    orderedCanvasObjects[key] = canvasObjects[key];
  });

  console.log(orderedCanvasObjects);
  return orderedCanvasObjects
}


function onSlidereitherorChange(_this) {
  let inputElement;
  $("#sortableoptions li.eitheror-group div.content_comes_here").each(
    (index, element) => {
      let input = $(element);
      let data_type = $(element).data("type");

      if (data_type == 'popup') {
        input = input.find("input[data-bind=autocomplete]");
        inputElement = input;
        if ($(input).val() != '') inputElement = input
      }
      if (data_type == "input-file") {
        input = input.find("input");
        input = $("#yourZoom_uploader").find("input");
        if ($(input).val() != '') inputElement = input
        let _name = input.attr("name");
        if (_name.includes("_uploadImage")) {
          input = $("#enterUploadfile")
          if ($(input).val() != '') inputElement = input
        }
      }
    });
  return inputElement
}

//create properties for eitherOr options
function geteitherOrSeqvalues(_this) {
  var Spacer = $('.spacer.eitherorSeq_option').children().length
  var slider = $('.slider-container.eitherorSeq_option').find('input').val();
  var sorting_order = $(_this).attr('data-sortingorder');
  var optionId = $(_this).attr('name');
  var object;
  Spacer = (typeof Spacer === 'undefined') ? 0 : Spacer;
  slider = (typeof slider === 'undefined') ? 0 : slider;
  object = Spacer + '~' + slider + '~' + '' + '~' + optionId + '~' + sorting_order;
  return object
}

function processEitherorElement(_input,optionId = '',edit = false) {
  let url;
  let urlLable;
  let eitherOrspacer = $('.spacer.eitherorSeq_option').children().length;
  let eitherOrslider = $('.slider-container.eitherorSeq_option').find('input').val();
  $("#sortableoptions li.eitheror-group div.content_comes_here").each(
    (index, element) => {
      let input = $(element);
      let optionid;
      let data_type = $(element).data("type");

      if (data_type == "input-file") {
        input = input.find("input");

        if (input.attr("name") == "uploadclick_seq") {
          input = $("#yourZoom_uploader").find("input");
          let _name = input.attr("name");

          if (_name.includes("_uploadImage")) {
            if ($("#enterUploadfile").attr('data-option-id')) {
              optionid = $("#enterUploadfile").attr('data-option-id').split('_enterUploadfile')[0];
            }

            if ($("#enterUploadfile").val() != "") {
              _input = $("#enterUploadfile");
              $("#enterUploadfile").on("blur", function () {
                 if ($("#enterUploadfile").val() != ""){
                $('.custom_ui').css('display', 'none');
                $('.slider-container.eitherorSeq_option').css('display','none');
                $('.new_custom').css('display', 'block');
                $('.showtoggle').css('display','none');

                 }
              });
                if(edit || !$("#enterUploadfile").is(":focus")){
              $('.custom_ui').css('display', 'none');
              $('.new_custom').css('display', 'block');
            }
              url = CanvasImages['customDesign'];
              urlLable = _input.val();
              optionId = optionid;
              var buttonElement = $("#custom_newui");
              buttonElement.attr('data-custom-design', 'true');
              _input.attr('data-custom-design', 'true');
            } else {
              let src = $("#yourZoom_uploader").find('input').eq(0).val();
              if (src != undefined && src != '') {
                _input = $("#yourZoom_uploader").find("input");
                if( !manualtrigger){
                $('.custom_ui').css('display', 'none');
                $('.new_custom').css('display', 'block');
                }
                url = _input.nextAll().find('img').eq(1).attr('src');
                urlLable = _input.nextAll().find('img').attr('alt');
                optionId = _input.attr('id').includes("_") ? _input.attr('id').split('_').slice(0, -1).join('_')[0] : _input.attr('id');
                var buttonElement = $("#custom_newui");
                buttonElement.attr('data-custom-design', 'true');
                console.log(buttonElement, "buttonElement")
                _input.attr('data-custom-design', 'true');
              } else if ($("#enterUploadfile").val() == "") {
                $("#enterUploadfile").on("blur", function () {
                  $('.custom_ui').css('display', 'block');
                  $('.new_custom').css('display', 'none');
                });
              }
            }
          }
        }
      }
       else if (data_type == "popup" && !manualtrigger) {
        input = input.find("input[data-bind=autocomplete]");
        var buttonElement = $("#custom_newui");
        buttonElement.removeAttr('data-custom-design');
        console.log(input.val());
        if (input.val() != '') {
          _input = input;
          $('.custom_ui').css('display', 'none');
          $('.new_custom').css('display', 'block');
          url = _input.next().attr('src');
          let divElement = _input.nextAll().eq(1);
          urlLable = divElement.text();
          var popChosenValueDiv = _input.parent();
          popChosenValueDiv.removeClass('show');
          console.log(url, "url", urlLable, _input, popChosenValueDiv);
        }
      }
    });

  // Get the value of _input
  let val = _input.val();
  console.log('val', val);

  if (val == '' || val == 'Select a Stock Design') {
    if(!manualtrigger){
        $('.slider-container.eitherorSeq_option').css('display', 'none');
      }
        $("#newcustomImg").attr("src", "");
        $(".filename_newcustom").text("");
  } else {
    // $('.custom_ui').css('display', 'none');
    // // $('.pop-chosen-value.show').removeClass('show');
    // $('.new_custom').css('display', 'block');
     console.log(manualtrigger,'manuAL');
     if (!manualtrigger || $('.new_custom').css('display') === 'block') {
    $('.slider-container.eitherorSeq_option').css('display', 'none');
    $('.showtoggle').css('display','none');
    }
    // Set the src attribute of the <img> element within .new_custom
    $('.new_custom img').eq(0).attr('src', url);
    $(".stock-popup").attr("src", url);
    $('.new_custom label').text(urlLable);
  }

if(!edit){
  _input.attr('data-spacer', eitherOrspacer);
  _input.attr('data-slider', eitherOrslider);
}
  // Return _input and optionId
  return [_input, optionId];
}

// async function displayImageInNewTab(_this) {
//   let tableRows = '';

//   const canvasJson = $(_this).data('title');
//   const productid = $(_this).data('id');
//   const variation = $(_this).data('variation');
//   const metafields=$(_this).data('metafields');
// // Retrieve the properties JSON string from the data attribute
// //  const properties = $(_this).data('properties');
// // const canvas = $(_this).data('canvas');
// // const spacer=$(_this).data('spacer')
// // Parse the JSON string into a JavaScript obje
// // properties.forEach((pair, index) => {
// //   const [key, value] = pair; // Destructure the sub-array into key and value
// //   console.log(`Pair ${index}: Key = ${key}, Value = ${value}`);
// // });
// // const dataObject = properties.reduce((acc, [key, value]) => {
// //   acc[key] = value;
// //   return acc;
// // }, {});


// // for (const key in canvas) {
// //   if (canvas.hasOwnProperty(key)) {
// //     const value = canvas[key];

// //     // Split the value by '~'
// //     const parts = value.split('~');

// //     // Extract the necessary parts
// //     const fontName = parts[0];
// //     const fontSize = parts[1];
// //     let placeText = parts[5];
// //     console.log(placeText);
// //     if(fontName!=0){
// //       if(placeText===undefined){
// //            placeText=key;
// //       }
     
// //       const formattedResult = `${fontName} & ${fontSize}`;
// //       tableRows += `<tr>
// //               <td style="text-align: center;">${placeText}</td>
// //               <td style="text-align: center;">${formattedResult}</td>
// //           </tr>`;
// //     }
// //     else{

// //     }

// //   }
// //   }


//   // const variationValue = variation ? variation : 'base'; 
//   const variationValue = variation || 'Base';
//   const dateAndTime = new Date().toLocaleString(); // e.g., "MM/DD/YYYY, HH:MM:SS AM/PM"
// const Name= $(_this).data('customer-name');
// const Email= $(_this).data('customer-email');
// const date=Date.now();
// if(Email!=''){
//   tableRows += `<tr>
//   <td>Name</td>
//   <td>${Name}</td>
// </tr>
// <tr>
//   <td>Email</td>
//   <td>${Email}</td>
// </tr>`

// }

//   // const disclamier= shop.metafields.helpText.disclaimer.value
//   // const currentDate = new Date();
//   // const date = currentDate.toLocaleDateString(); // e.g., "MM/DD/YYYY"
//   // const time = currentDate.toLocaleTimeString(); // e.g., "HH:MM:SS AM/PM"
//   // console.log(productid);
//   // const canvas = new fabric.Canvas('cartcanvas');
//   // canvas.setWidth(500);
//   // canvas.setHeight(500);
//   // const canvasSpec = typeof canvasJson == 'string' ? JSON.parse(canvasJson.replace(/&quot;/g, '"')): canvasJson;
//   //     for (const element of canvasSpec) {
//   //       if (element.type == 'image') {
//   //         await fabricImage(element,canvas);
//   //       }
//   //       else if (element.type == 'text') {
//   //         const textObject = fabricText(element);
//   //         canvas.add(textObject);
//   //       }
//   //       else if (element.type == 'group') {
//   //         const group = await fabricGroup(element,canvas);
//   //        canvas.add(group);
//   //       }
//   //     }
//   //     canvas.renderAll();
//   //     canvas.renderAll();
//   //     const resizedBase64String = canvas.toDataURL({
//   //             format: 'png',
//   //             quality: 1,
//   //             multiplier:4
//   //           });
//   let DownloadImage = $(_this).find('img').attr('src');
//   const newTab = window.open();
//   newTab.document.write(`
//   <html>
//   <head>
//     <style>
//       body {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 100vh;
//         margin: 0;
//       }
//       .container {
//         display: flex;
//         width: 195vh;
//         height: 100%;
//       }
//       .left-side, .right-side {
//         flex: 1;
//       }
//       .left-side {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         padding: 20px;
//       }
//       .right-side {
//         display: flex;
//         flex-direction: column;
//         justify-content: center;
//         padding: 20px;
//         box-sizing: border-box;
//       }
//       img {
//         max-width: 100%;
//         max-height: 100%;
//       }
//       #logo-overlay {
//         position: absolute;
//         width: 12%;
//         top: 20px;
//         left: 20px;
//       }
//       #downloadButton {
//         position: absolute;
//         height: 4%;
//         color: white;
//         cursor: pointer;
//         width: 8%;
//         border-radius: 0%;
//         border: none;
//         bottom: 8%;
//         background-color: green;
//         right: 18%;
//       }
//       table {
//         border-collapse: collapse;
//         width: 100%;
//       }
//       table, th, td {
//         border: 1px solid black;
//       }
//       th, td {
//         padding: 8px;
//         text-align: center;
//       }
//       th {
//         background-color: #f2f2f2;
//       }
//     </style>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
// </head>
// <body>
//   <div class="container">
//     <div class="left-side">
//       <img src="${DownloadImage}" alt="Base64 Image">
//     </div>
//     <div class="right-side">
//       <div id="print-info">
//         <table>
//           <thead>
//             <tr>
//               <th colspan="2">Information</th>
//             </tr>
//           </thead>
//           <tbody>
//           <tr>
//           <td>Product Name</td>
//           <td>${canvasJson}</td>
//         </tr>
//         <tr>
//         <td>Product Id</td>
//         <td>${productid}</td>
//       </tr>
//             <tr>
//               <td>Variation</td>
//               <td>${variationValue}</td>
//             </tr>
//             ${tableRows}
//             <tr>
//               <td>Date</td>
//               <td>${dateAndTime}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div class="disclaimer">
//       <p><strong>Disclaimer:</strong>${metafields}</p>
//     </div>
//       <img id="logo-overlay" src="https://cdn.shopify.com/s/files/1/0691/7082/3461/files/100_year_anniversary_page-0001.jpg?v=1678857921" alt="Logo">
//       <button id="downloadButton" onclick="downloadPdf()">Download PDF</button>
//     </div>
//   </div>
//   <script>
//   function downloadPdf() {
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF('p', 'mm', 'a4'); // Use portrait mode ('p') and A4 size


//     // Document margins and dimensions
//     const margin = 5;
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const contentWidth = pageWidth - margin * 2; // Width available for content after margins
//     const contentHeight = pageHeight - margin * 2; // Height available for content after margins
  
//     // Image settings
//     const imgWidth = 100; // Set image width
//     const imgHeight = 90; // Adjust height based on aspect ratio
//     const imgX = -13; // X position for the image
//     const imgY = 10; // Y position for the image, slightly below the top margin
//     // Prepare data for the table
//     const Name = $(_this).data('customer-name') || '';  // Fetch the Name from data attribute or default to an empty string if undefined
//     const Email = $(_this).data('customer-email') || ''; 
//      const tableData = [
//       ["Product", "${canvasJson}"],
//       ["Product Id", "${productid}"],
//       ["Variation", "${variationValue}"],
//       ["Timestamp", "${dateAndTime}"]
//     ];
//     if (Name !== '') {
//       tableData.push(["Name", "${Name}"]);
//     }
    
//     if (Email !== '') {
//       tableData.push(["Email","${Email}"]);
//     }
//     // Adding title to the PDF
//     doc.setFontSize(14);
//     // const title = "Customized Document";
//     // const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
//     // const titleX = (pageWidth - titleWidth) / 2;
//     // doc.text(title, titleX, margin + 10);
  
//     // Add the image on the left side
//     doc.addImage("${DownloadImage}", 'JPEG', imgX, imgY, imgWidth, imgHeight);
  
//     // Calculate table position
//     const tableStartX = imgX + imgWidth + margin; // Table starts right after the image
//     const tableStartY = imgY; // Align table to the image's top
  
//     // Add the table on the right side
//     doc.autoTable({
//       startY: 20, // Align table to image top
//       margin: { left: tableStartX }, // Set margin to position table on the right of the image
//       head: [['Information', '']], // Header row with colspan
//       body: tableData,
//       theme: 'grid', // Use grid theme for better visual appearance
//       styles: {
//         cellPadding: 3,
//         fontSize: 10,
//       },
//       headStyles: { fillColor: [211, 211, 211], halign: 'center' }, // Header styles
//       columnStyles: {
//         0: { cellWidth: 'auto', halign: 'left' }, // Field column
//         1: { cellWidth: 'auto', halign: 'left' }  // Value column
//       },
//       // Specify the column widths
//       columnWidths: [100, 100], // Adjust these widths as needed
//     });
//     // Save the PDF
//     doc.save('${productid}_${variationValue}_${date}.pdf');
//   }
  
//   </script>
//   </body>
//   </html>
//   `);
  

// }
async function displayImageInNewTab(_this) {
  let tableRows = '';

  const canvasJson = $(_this).data('title');
  const productid = $(_this).data('id');
  const variation = $(_this).data('variation');
  const metafields = $(_this).data('metafields');
  const variationValue = variation || 'Base';
  const dateAndTime = new Date().toLocaleString(); 
  const Name = $(_this).data('customer-name');
  const Email = $(_this).data('customer-email');
  const date = Date.now();
console.log(Name,'Divya');
console.log(Email,'Emilll');

  if (Email != '') {
    tableRows += `<tr>
      <td>Name</td>
      <td>${Name}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${Email}</td>
    </tr>`;
  }

  let DownloadImage = $(_this).find('img').attr('src');
  const newTab = window.open();
  newTab.document.write(`
  <html>
  <head>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        display: flex;
        width: 195vh;
        height: 100%;
      }
      .left-side, .right-side {
        flex: 1;
      }
      .left-side {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      .right-side {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
      #logo-overlay {
        position: absolute;
        width: 12%;
        top: 20px;
        left: 20px;
      }
      #downloadButton {
        position: absolute;
        height: 4%;
        color: white;
        cursor: pointer;
        width: 8%;
        border-radius: 0%;
        border: none;
        bottom: 8%;
        background-color: green;
        right: 18%;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      table, th, td {
        border: 1px solid black;
      }
      th, td {
        padding: 8px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
  </head>
  <body>
    <div class="container">
      <div class="left-side">
        <img src="${DownloadImage}" alt="Base64 Image">
      </div>
      <div class="right-side">
        <div id="print-info">
          <table>
            <thead>
              <tr>
                <th colspan="2">Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product Name</td>
                <td>${canvasJson}</td>
              </tr>
              <tr>
                <td>Product Id</td>
                <td>${productid}</td>
              </tr>
              <tr>
                <td>Variation</td>
                <td>${variationValue}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>${dateAndTime}</td>
              </tr>
              ${tableRows}
            </tbody>
          </table>
        </div>
        <div class="disclaimer">
          <p><strong>Disclaimer:</strong>${metafields}</p>
        </div>
        <img id="logo-overlay" src="https://cdn.shopify.com/s/files/1/0691/7082/3461/files/100_year_anniversary_page-0001.jpg?v=1678857921" alt="Logo">
        <button id="downloadButton" onclick="downloadPdf()">Download PDF</button>
      </div>
    </div>
    <script>
      function downloadPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 5;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgWidth = 100;
        const imgHeight = 90;
        const imgX = -13;
        const imgY = 10;

        const tableData = [
          ["Product Name", "${canvasJson}"],
          ["Product Id", "${productid}"],
          ["Variation", "${variationValue}"],
          ["Date", "${dateAndTime}"]
        ];

        if ("${Name}" !== '' && "${Email}" !== '') {
          tableData.push(["Name", "${Name}"]);
          tableData.push(["Email", "${Email}"]);
        }

        doc.addImage("${DownloadImage}", 'JPEG', imgX, imgY, imgWidth, imgHeight);

        doc.autoTable({
          startY: 20,
          margin: { left: imgX + imgWidth + margin },
          head: [['Information', '']],
          body: tableData,
          theme: 'grid',
          styles: { cellPadding: 3, fontSize: 10 },
          headStyles: { fillColor: [211, 211, 211], halign: 'center' },
          columnStyles: { 0: { cellWidth: 'auto', halign: 'left' }, 1: { cellWidth: 'auto', halign: 'left' } }
        });

        doc.save('${productid}_${variationValue}_${date}.pdf');
      }
    </script>
  </body>
  </html>
  `);
}


async function fabricImage(element,canvas) {
  return new Promise((resolve, reject) => {
    new fabric.Image.fromURL(
      element.src,
      (img) => {
        img.set({
          left: element.left,
          top: element.top,
          scaleX: element.scaleX,
          scaleY: element.scaleY,
          height: element.height,
          width: element.width,
          id:element.id,
          isBaseimg:element.isBaseimg ?? false,
          selectable: false
        });
         if(element.flipX){
          img.set({flipX : element.flipX})
        }
        if(element.border){
          img.set({border : element.border})
        }
        if(element.filters.length>0){
          const filtercolor = new fabric.Image.filters.BlendColor({ color: element.filters[0].color, mode: element.filters[0].mode });
          img.filters.push(filtercolor);
          img.applyFilters();
        }          
        canvas.add(img);
        resolve();
      },
      { crossOrigin: 'Anonymous' }
    );
  });
}

function fabricText(element) {
  return new fabric.Text(element.text, {
    fill: element.fill,
    left: element.left,
    top: element.top,
    height: element.height,
    width: element.width,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    id:element.id,
    selectable: false
  })
}

async function fabricGroup(element,canvas) {
  return new Promise(async (resolve) => {
    const group = new fabric.Group([]);
    for (const item of element.objects) {
      if (item.type == 'text') {
        const textObject = fabricText(item);
        PrintColor = textObject.fill;
        group.add(textObject);
      } else if (item.type == 'image') {
        await fabricImage(item,group);
        // group.add(canvas.getObjects().pop()); // Get the last added object (image)
      }
    }
    group.set({
      angle: element.angle,
      fill: element.fill,
      left: element.left,
      top: element.top,
      height: element.height,
      id:element.id,
      width: element.width,
      selectable: false
    });
    resolve(group);
  });
}

function displayCustomUi(_this) {
  manualtrigger=true;
  $('.showtoggle').css('display','block');
 console.log(_this, "this")
  event.preventDefault();
  $('.custom_ui').css('display', 'block');
  $('.new_custom').css('display', 'none');
  $('.slider-container.eitherorSeq_option').css('display','block');
  if (!$(_this).attr('data-custom-design')) {
    var previousDiv = $(_this).parent().prevAll().find('div.pop-chosen-value');
    previousDiv.addClass('show');
    console.log(previousDiv, "previousDiv");
  }
}

function findMedalPattern(optionId, _this) {
  var option1 = optionId;
  let varID;
  if (MedalPC) {
    varID = MedalPC['printColor'];
  }
  if (MedalConfig == null) return undefined;
  var option2 = MedalConfig[optionId];
  var element1 = $('input[data-key=' + option1 + '][onchange="canvasColorization(this)"]').attr('value');
  var element1Val = $('input[data-key=' + option1 + '][onchange="canvasColorization(this)"]').val()
  var element2 = $('input[data-key=' + option2 + '][onchange="canvasColorization(this)"]').attr('value');
  var element2Val = $('input[data-key=' + option2 + '][onchange="canvasColorization(this)"]').val();
  if ($(_this).attr('data-key').includes('_v')) {
    option1 = $(_this).attr('data-key');
    option2 = option2 + '_v' + $(_this).attr('data-key').split('_v')[1];
    varID = varID + '_v' + $(_this).attr('data-key').split('_v')[1];
    element1 = $('input[data-key=' + option1 + '][onchange="canvasVariation(this)"]').attr('value');
    element2 = $('input[data-key=' + option2 + '][onchange="canvasVariation(this)"]').attr('value');
    element1Val = $('input[data-key=' + option1 + '][onchange="canvasVariation(this)"]').val();
    element2Val = $('input[data-key=' + option2 + '][onchange="canvasVariation(this)"]').val();
  }
  if (element1 === '' && element2 === '') {
    return undefined;
  }
  if (MedalPattern[element1] && MedalPattern[element1][element2] != undefined) {
    if (MedalPC) {
      applyMedalPC(element1Val, varID)
    }
    return MedalPattern[element1][element2];
  }
  else if (MedalPattern[element2] && MedalPattern[element2][element1] != undefined) {
    if (MedalPC) {
      applyMedalPC(element2Val, varID)
    }
    return MedalPattern[element2][element1];
  }
  if (element2 == '' || element1) {
    if ((element2 != getDefaultElementValue(option2) || element2 == '')) {
      element2 = getDefaultElementValue(option2)
      if (MedalPattern[element1] && MedalPattern[element1][element2] != undefined) {
        prefillAutocomplete(element2, option2);
        if (MedalPC) {
          applyMedalPC(element1Val, varID)
        }
        return MedalPattern[element1][element2];
      }
      else if (MedalPattern[element2] && MedalPattern[element2][element1] != undefined) {
        prefillAutocomplete(element2, option2);
        if (MedalPC) {
          applyMedalPC(element2Val, varID)
        }
        return MedalPattern[element2][element1];
      }
    }
  }
}

function getDefaultElementValue(configkey) {
  if (MedalConfig['_' + configkey.split('_v')[0]] === 'Finish') return getfirstoption(configkey);
  if (MedalConfig['_' + configkey.split('_v')[0]] === 'Medal') return getfirstoption(configkey);
  return '';
}
function prefillAutocomplete(element, option) {
  const domObjectac = $(".autocomplete[data-key=" + option + "]")[0];
  if (element !== undefined) {
    const selectizeObject = domObjectac !== undefined ? domObjectac.selectize : false;
    const imageId = element;
    if (selectizeObject) selectizeObject.setValue(imageId, false);
  }
}
function applyMedalPC(val, varID) {
  const domObjectac = $(".autocomplete[data-key=" + varID + "]")[0];
  const selectizeObject = domObjectac !== undefined ? domObjectac.selectize : false;
  let imageId;
  if (selectizeObject) {
    if (selectizeObject.items[0]) if (selectizeObject.items[0].includes(val)) return false;
    const selectedOptions = selectizeObject.options;
    for (const key in selectedOptions) {
      if (selectedOptions[key]['id'].includes(val)) {
        imageId = selectedOptions[key]['id'];
        break;
      }
    }
    if (selectizeObject) selectizeObject.setValue(imageId, false);
  }
}

function getfirstoption(option) {
  var valueId;
  const domObjectac = $(".autocomplete[data-key=" + option + "]")[0];
  const selectizeObject = domObjectac !== undefined ? domObjectac.selectize : false;
  if (selectizeObject) {
    valueId = Object.keys(selectizeObject.options)[0];
  }
  return selectizeObject['options'][valueId]['id'];
}

function fontedit(_this, id, label, size, isVariation) {

if ($(_this).hasClass('fontEdit') && window.innerWidth>=999) {
  $(_this).addClass('showborder');
}
  event.preventDefault();
  const fontFamilySelect = $(".fontFamilyEdit");
  const fontSizeSelect = $(".fontSizeEdit");
  fontFamilySelect.off('change');
  fontSizeSelect.off('change');
  const defaultFonts = ProductDefaultFont;
  // Array of font family names and font sizes
  const fontFamilies = productFamily
  const fontSizes = size.split(',')
  // Populate the select fields with options
  var input;
  if (isVariation == 'true') {
    var input = $(_this).parent().find('input[name="' + id + '"][oninput*="canvasVariation"][oninput*="eitherOrValidation"], select[name="' + id + '"][onchange*="eitherOrValidation"][onchange*="canvasVariation"],input[name="' + id + '"][oninput*="canvasVariation"]');
  } else {
    input = $(`#${id}:input`);
  }
  var defaultfamily = $(input).attr('data-font-family');
  var defaultSize = $(input).attr('data-font-size');
   if (/\d+/.test(label)) {
     label = label.replace(/\d+/g, '');
   }
  $("#printName").html(label)
  populateSelectOptions(fontFamilySelect, fontFamilies, defaultFonts, defaultfamily);
  populateSelectOptions(fontSizeSelect, fontSizes, defaultFonts, defaultSize);
  fontFamilySelect.on('change', function (event) {
    event.stopPropagation();
    if (isVariation == 'true') {
      changeFontFamilyVariation(input, this);
    } else {
      changeFontFamily(this, id);
    }
  });

  fontSizeSelect.on('change', function (event) {
    event.stopPropagation();
    if (isVariation == 'true') {
      changeFontSizeVariation(input, this);
    } else {
      changeFontSize(this, id);
    }
  });
  const modal = document.getElementById('fontFamilyPopup');
  window.addEventListener('click', function (event) {

    if (event.target == modal) {
    $('.showborder').removeClass('showborder');

      modal.style.display = 'none';

    }
  });

  $('#fontFamilyPopup').css('display', 'block');
}

function populateSelectOptions(selectElement, optionsArray, defaultFonts, defaultfont) {
  selectElement.html(""); // Use jQuery's html method to clear options
  optionsArray.forEach((fonts) => {
    const option = $("<option></option>")
      .val(fonts.fontFamilyName ?? fonts)
      .text(fonts.fontFamilyName ?? fonts);

    if (defaultfont == undefined) {
      if (fonts.fontFamilyName == defaultFonts.fontFamily || fonts == defaultFonts.fontSize) {
        option.prop("selected", true);
      }
    } else {
      if (fonts.fontFamilyName == defaultfont || fonts == defaultfont) {
        option.prop("selected", true);
      }
    }
    selectElement.append(option);
  });
}

function VideoPopup() {
  $('#Modal_video').css('display', 'block');
}
function closepopup() {
  $('#Modal_video').css('display', 'none');
  $('#Modal_question').css('display', 'none');
  $('#View_image').css('display', 'none');


}
function closeimagepopup() {
  $('#Modal_question').css('display', 'block');
  $('#View_FAQimage').css('display', 'none');
}
function redirectToNewLink() {
  $('#Modal_question').css('display', 'block');
}
function viewCanvasImage(){
  $('#View_image').css('display', 'block');
}
function viewfaqImage(_this){
  $('#Modal_question').css('display', 'none');
  $('#View_FAQimage img').attr("src", _this.src);
  $('#View_FAQimage').css('display', 'block');
}
function closeCustomDesign(){
  $('.new_custom').css('display','block');
  $('.custom_ui').css('display', 'none');
  $('.eitheror-group').find('.pop-chosen-value.show').removeClass('show');
  $('.slider-container.eitherorSeq_option').css('display', 'none');
  $('.showtoggle').css('display','none');

}
// function openCustomizerFAQ() {
//   $('#Modal_question').css('display', 'none');
//   $('#CustomizerFAQPopup').css('display', 'block');
// }
function closeCustomizerFAQ() {
  $('.faq-answer').css('display','none')
  $('.faq-answer1').css('display','block')
  $('.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right')
  $('.fa-caret-right').eq(0).removeClass('fa-caret-right').addClass('fa-caret-down')
  $('#Modal_question').css('display', 'none')
}
function toggleAnswer(answerId,_this) {
  let previous=$(_this).children().eq(0).attr('class');
$('.faq-answer1').css('display','none')
$('.faq-answer').css('display','none')
$('.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right')
$(_this).children().eq(0).attr('class',previous)
  var answerElement = document.getElementById(answerId);
   $(_this).children().toggleClass('fa-caret-right fa-caret-down')
  if (previous.includes('down')) {
      answerElement.style.display = 'none';
  } else {
      answerElement.style.display = 'block';
  }
}
function expandProperties(){
  let imgElement = document.getElementById('expand-details');
  console.log(imgElement,'imggggg');
  let stickyCard = document.querySelector('.card--sticky');
  // let currentSrc = imgElement.getAttribute('src');
  if (stickyCard.style.display === 'none') {
    $('.close-span').remove();
 $(".product-meta").removeClass('addCssforexpand')
    // $(".product-block-list__item--description").css("display","block")
    $("#shopify-section-footer").css("display","block")
    $(".product-recommendations").css("display","block")
$("#main .shopify-section:nth-child(2)").css("display","block")

    stickyCard.style.display = 'block';
    imgElement.setAttribute('src', '');
  } else {
    $(".product-meta").addClass('addCssforexpand')
  // $(".product-block-list__item--description").css("display","none")
  $("#shopify-section-footer").css("display","none")
  $(".product-recommendations").css("display","none")
$("#main .shopify-section:nth-child(2)").css("display","none")
    stickyCard.style.display = 'none';
    $('#expand-details').append(`
  <span class="close-span" style="color:red;cursor:pointer;float:right;margin-right: 26px;margin-top: -29px; font-size: 25px;" 
  onclick="expandProperties()">
    <i class="fa fa-times" aria-hidden="true"></i>
  </span>
`);

    //imgElement.setAttribute('src', 'https://cdn.shopify.com/s/files/1/0691/7082/3461/files/minimize.png?v=1721291119');
  }
}
function updateImageSrc(canvasObjUrl) {
  var canvasUrl = canvasObjUrl.toDataURL();
  $("#MobileCanvasImage img").attr("src", canvasUrl);
  $(".view_custom_canvas img").attr("src", canvasUrl);
}
function applyRuler(isclick) {
  let ele = $('.ruler');
  if (isclick) $(ele).toggleClass("showruler-slash");
  if (rulerObject) {
    const objectToRemove = canvas.getObjects().find((obj) => obj.id === 'ruler');
    const objectToRemove2 = canvas2.getObjects().find((obj) => obj.id === 'ruler');
    if (objectToRemove || objectToRemove2) {
      canvas.remove(objectToRemove);
      canvas2.remove(objectToRemove2);
      const baseObj = canvas.getObjects().find((obj) => obj.isBaseimg !=undefined);
      canvas.setHeight(baseObj.height);canvas2.setHeight(baseObj.height);
       if(window.innerWidth<=767){
      // var dataURL = canvas.toDataURL();
      // var dataURL2 = canvas2.toDataURL();
       if($('.view_slider').hasClass('isSelect')){
        let view = $('.view_slider.isSelect'); 
      let ID = $(view).attr('id').split('V')[1];
      // if(window.innerWidth<=999){
    if(ID == undefined){
          // $("#MobileCanvasImage img").attr("src", dataURL);
          // $(".view_custom_canvas img").attr("src", dataURL);
          updateImageSrc(canvas);
        }
    else{
          // $("#MobileCanvasImage img").attr("src", dataURL2);
          // $(".view_custom_canvas img").attr("src", dataURL2);
        updateImageSrc(canvas2);

      }
       }
      }
    }
    if (ele.attr('class').includes('slash')) {
      canvas.setHeight(rulerObject.height);canvas2.setHeight(rulerObject.height);
      canvas.add(rulerObject);
      canvas.renderAll();
      canvas2.add(rulerObject);
      canvas2.renderAll();
      if(window.innerWidth<=767){
      var dataURL = canvas.toDataURL();
      var dataURL2 = canvas2.toDataURL();
      // if(window.innerWidth<=999){
       if($('.view_slider').hasClass('isSelect')){
        let view = $('.view_slider.isSelect'); 
        let ID = $(view).attr('id').split('V')[1];
        // if(window.innerWidth<=999){
      if(ID == undefined){
            // $("#MobileCanvasImage img").attr("src", dataURL);
            // $(".view_custom_canvas img").attr("src", dataURL);
           updateImageSrc(canvas);
          }
      else{
            // $("#MobileCanvasImage img").attr("src", dataURL2);
            // $(".view_custom_canvas img").attr("src", dataURL2);
           updateImageSrc(canvas2);
        }
       }
      }
    }
  }
}

function sortelement(_canvasProp) {
  let _li;
  $(Object.keys(_canvasProp)).each((index, element) => {

    if (element == "eitherorSeq") {
      element = _canvasProp[element].split('~')[3];
      _li = $("[data-option-id='" + element + "']");
      element = 'eitherorSeq';
    } else if (element.includes('ExtraField')) {
      _li = $("[data-option-id='" + element.split('ExtraField')[0] + "']");
    }
    else {
      _li = $("[data-option-id='" + element + "']");
    }
    if (_li.attr("class") == "content_comes_here") _li = _li.parent();
    _li = _li.closest("li");

    if (_canvasProp[element]) {
      let sortOrder = _canvasProp[element].split("~")[4];
      if (sortOrder) {
        _li.attr("data-sort", Number(sortOrder));
      }
    }
  });

  sortElement_editOrder();
}

function rendercommonOption(canvas2, variationObject,id) {
  for (element of $("#CommonOptions li")) {
    let _input = $(element);
    _input = _input.find("input[onchange='canvasColorization(this)']");
    var optionId = $(_input).attr('id');
    if (optionId!=undefined && optionId.includes('_')) {

      optionId = optionId.split('_').slice(0, -1).join('_');
    }
    for (var option of CanvasOptions) {
      if (optionId == option.optionId) {
        if (OptionsType[optionId] == "Border" && !variationObject[optionId]) {
          let objectsOnCanvas1 = canvas.getObjects().find(obj => obj.border == true);
          let objectsOnCanvas2 = canvas2.getObjects().find(obj => obj.border == true);
          if (objectsOnCanvas1 != undefined && objectsOnCanvas2 != undefined) {
            if (objectsOnCanvas1.toObject().src == objectsOnCanvas2.toObject().src) {
              return false
            }
          }
          if (objectsOnCanvas1 != undefined || objectsOnCanvas2 == undefined) {
            let obj = canvas2.getObjects().filter(obj => obj.id == option.optionId);
            canvas2.remove(...obj)
            canvas2.add(...borderObjects)
            canvasObjects[id].push(...borderObjects)

          }
        }
      }
    }
  }
}

// function updateSrc(Canvas,Id,edit = false){
//   var canvasUrl
// if($('.image-container').length > 0 ){
//   if(edit){
//     var newCanvas = new fabric.Canvas();
//     newCanvas.add.apply(newCanvas, Canvas);
//      canvasUrl = newCanvas.toDataURL({
//       multiplier: 1,
//       format: "png",
//       width:canvas.width,
//       height:canvas.height
//     });
    
//   }else{
//   Canvas.getObjects().forEach(obj => {
//     if (obj.id === 'ruler' || obj.id === 'magnifizer') {
//       obj.excludeFromExport = true;
//     }
//   });
//   canvasUrl = Canvas.toDataURL({
//     multiplier: 1,
//     format: "png",
//     width:canvas.width,
//     height:canvas.height
//   });
// }
//   if($(`#${Id}`).length > 0 ){
//   $(`#${Id}`).attr('src',`${canvasUrl}`)
//   }else{
//   // $('.image-container').append(`<img id='${Id}' src='${canvasUrl}' onclick='displayCanvass(${Id})'>`)
//   $('.image-container').append(`<img id='${Id}' class='view_slider'  src='${canvasUrl}' onclick='displaySliderCanvas(this)'>`)
//   }
//  }
// }
async function updateSrc(Canvas, Id, edit = false,editcustom) {
  function renderCanvasToImage(can) {
    return new Promise(resolve => {
      let canvasUrl = can.toDataURL({
            // multiplier: 1,
            format: "png",
            width:canvas.width,
            height:canvas.height
          });
          
          // if(window.innerWidth<=999){
          // console.log(canvasUrl,'canvasUrlformobile');
           $("#MobileCanvasImage img").attr("src", canvasUrl);
           $(".view_custom_canvas img").attr("src", canvasUrl);

          resolve(canvasUrl)
    });
  }

  function excludeObjectsFromExport(canvas) {
    canvas.getObjects().forEach(obj => {
      if (obj.id === 'ruler' || obj.id === 'magnifier') {
        obj.excludeFromExport = true;
      }
    });
  }

  try {
    let canvasUrl;
    if (edit) {
      var newCanvas = new fabric.Canvas(null, {
        width: canvas.width, // Set the width of the canvas
        height: canvas.height, // Set the height of the canvas
    });
      newCanvas.add(...Canvas);
      canvasUrl = await renderCanvasToImage(newCanvas);
      //console.log(canvasUrl,'cnvas');
    } else {
      excludeObjectsFromExport(Canvas);
      canvasUrl = await renderCanvasToImage(Canvas);
    }
    CreateSliderElement(Id,canvasUrl,!editcustom);
  
  } catch (error) {
    console.error('Error:', error);
  }
}
function CreateSliderElement(Id,canvasUrl,isselected = true){
  if ($(`#${Id}`).length > 0) {
    $(`#${Id}`).attr('src', canvasUrl);
  } else {
    $('.image-container').append(`<img id='${Id}' class='view_slider' src='${canvasUrl}' onclick='displaySliderCanvas(this)'>`);
    if(Id !== hopsProdId){
      $(`#${Id}`).before(`<span class='sliderId' > ${Id}</span>`);
    }
    else{
      $(`#${Id}`).before(`<span class='sliderId' >Base</span>`);
    }
   if(isselected){
    $(`#${Id}`).addClass("isSelect");
    }
  }
}
function selectedSlider(_this){
  $(".view_slider").each(function() {
    $(this).removeClass("isSelect");
  });
  $(_this).addClass("isSelect");
}
// async function prefillcanvas(prop,id){
//   canvas.clear()
//   for (const element of prop) {
//     if (element.type == 'image') {
//       await fabricImage(element,canvas);
//     }
//     else if (element.type == 'text') {
//       const textObject = fabricText(element);
//       canvas.add(textObject);
//     }
//     else if (element.type == 'group') {
//       const group = await fabricGroup(element,canvas);
//      canvas.add(group);
//     }
//   }
//   canvas.renderAll();
//   canvasObjects[id.split('_')[0]] = canvas.getObjects();
//   updateSrc(canvas,id.split('_')[0]);
// }
async function prefillcanvas(){
  for (element of $("#CommonOptions li")) {
    let _input = $(element);
    _input = _input.find("input[onchange='canvasColorization(this)']");
    var optionId = $(_input).attr('id');
    if (optionId!=undefined && optionId.includes('_')) {
      optionId = optionId.split('_').slice(0, -1).join('_');
    }
    let option = CanvasOptions.find((option)=> option.optionId == optionId)
          if(option != undefined){
            if (OptionsType[optionId] == "Color") {
              var obj = canvas.getObjects().find(obj => obj.id === option.layer);
              await findColorOrPattern(obj, _input, option);
            } else if (OptionsType[optionId] == "PrintColor") {
              findPrintColor(_input);
            } else if (OptionsType[optionId] == "Border") {
              await findBorder(_input, option)
            }
          }
  }
  await renderTextOnCanvas();
  renderCanvas()
  }


function loadSpecsInCanvas(id){
  canvas.clear();
  canvasObjects[id].forEach(obj => {
      canvas.add(obj);
  });
  canvas.renderAll();
  const data = canvas.toDatalessJSON(['id','isBaseimg','border'])
 return  JSON.stringify(data.objects)
}


function onSliderChange_new(_this,id){
  var value = $(_this).val();
  var slider = $(_this).next().first();
  var input = $(`#${id}:input`);
  slider.text(value);
  input.attr('data-slider', value);
  input.val(value);
  input.trigger('change')

}

function calculateRemainingSpace(_this,Id){
  var Id =Id;
  var bool = true;
  if(Id == 'topSpacer'){
    input = $(_this).nextAll('LI').first().find('input[onchange], input[oninput], select[onchange]');
    let id = $(input).attr('name')
    Id = id
  }else if(Id == 'bottomSpacer'){
    input = $(`#${Id}`).parent().children('LI').last().find('input[onchange], input[oninput],select[onchange]')
    let id = $(input).attr('name')
    Id = id;
  }else if(Id == 'eitherorSeq_option'){
    input = onSlidereitherorChange(_this);
    let id = $(input).attr('name');
    Id = id;
    if(id.includes("_")){
      Id = id.split('_')[0];
    }
  }
  if (Id.includes('ExtraField')) {
    Id = Id.split('ExtraField')[0];
  }

  canvas.getObjects().forEach(element => {
    if(element.type == 'group' ){
      if(element.getObjects().find(i=> i.id == Id))
      var remainingSpace = layerSpecs[element.id].printLength - getTotalHeight(element.getObjects());
      if(remainingSpace <= 15){ 
        showToaster(); 
        bool = false;
      }
    }
  });
  return bool;
}

function showToaster() {
  // Check for an existing toaster
  var existingToaster = document.getElementById('toaster');
  // If an existing toaster is found, destroy it immediately
  if (existingToaster) {
    closeToaster(existingToaster);
  }
  // Create the toaster element
  var toaster = document.createElement('div');
  toaster.id = 'toaster';
  var toasterdiv = document.createElement('div');
  toasterdiv.id = 'toaster-div';
  // Create the close button
  var closeButton = document.createElement('button');
  closeButton.id = 'close-button';
  closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Corrected line
  closeButton.onclick = function () {
    closeToaster(toaster);
  };
  // Create the message span
  var warnIcon = document.createElement('i');
  warnIcon.className = 'fa fa-exclamation-circle';
  warnIcon.id ="toaster-warnIcon";
  var messageSpan = document.createElement('span');
  messageSpan.id = 'toaster-message';
  messageSpan.textContent = "  Maximum Space Exceeded";
  toasterdiv.appendChild(warnIcon)
  toasterdiv.appendChild(messageSpan)
  toaster.appendChild(toasterdiv);
  toaster.appendChild(closeButton);
  // Append the toaster to the document body
  document.body.appendChild(toaster);

  // Show the toaster with fadeIn animation
  setTimeout(function () {
    toaster.style.opacity = '1';
  }, 10); // Use a minimal delay to ensure the transition is applied

   // Automatically close the toaster after 3000 milliseconds (3 seconds)
   setTimeout(function () {
    closeToaster(toaster);
  }, 1000);
}

function closeToaster(toaster) {
  // Check if the toaster is already in the process of being removed
  if (toaster.dataset.isRemoving === 'true') {
    return;
  }
  // Set the flag to indicate that removal is in progress
  toaster.dataset.isRemoving = 'true';
  // Hide the toaster with fadeOut animation
  toaster.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
  toaster.style.opacity = '0';
  toaster.style.transform = 'translateY(30px)'; // Adjust the distance as needed
  setTimeout(function () {
    // Check if the toaster is still a child of the document
    if (document.body.contains(toaster)) {
      // Remove the toaster from the document
      document.body.removeChild(toaster);
    }
    // Reset the flag
    toaster.dataset.isRemoving = 'false';
  }, 500); // Adjust to match the transition duration
}

(function() {
   
  let cart = $('#cart-new'),
  soda = $('#soda'),
  meat = $('#meat'),
  mustard = $('#mustard'),
  path = [{x:-250, y:0}, {x:-100, y:-90}, {x:0, y:0}],
  path2 = [{x:250, y:0}, {x:150, y:-80}, {x:60, y:0}],
  path3 = [{x:-170, y:0}, {x:-80, y:-70}, {x:70, y:0}];
  // path4 =[{x:160,y:0},{x:120, y:-60}, {x:80, y:0}];
  let xvalue=750;
  if(window.innerWidth<=767){
    xvalue=300;
  }
  
  var setupSequence = function() {
    let tl = new TimelineMax({repeat: -1, timeScale: 1.8});
    if(window.innerWidth<=767){
      xvalue=300;
    }
    
    tl.set(mustard, {x:-250})
    .set(meat, {x:250})
    .set(soda, {x:-170})

    .to(cart, 2.1, { 
      x:xvalue, 
      ease: SlowMo.ease.config(0.5, 0.5, false),
    })
    .to(mustard, 1, {
      bezier: {curviness: 0.3, values:path},
      opacity: 1,
      scale:1,
      ease: Back.easeOut.config(1.4)
    }, 0.5)
    .to(mustard, .2, {
      scale: 0,
    }, 0.8)
    .to(meat, 1, {
      bezier: {curviness: 0.3, values:path2},
      opacity: 1,
      scale:1,
      ease: Back.easeOut.config(1.4)
    }, 0.8)
    .to(meat, .2, {
      scale: 0
    }, 1.2)
    .to(soda, .7, {
      bezier: {curviness: 0.3, values:path3},
      opacity: 1,
      scale:1,
      ease: Back.easeOut.config(1.4)
    }, 1.2)
    .to(soda, .1, {
      scale: 0,
    },1.5);
  }
  
  setupSequence();
  
})();
// window.addEventListener('scroll', function() {
//   if (document.activeElement && document.activeElement.tagName === 'INPUT') {
//       document.activeElement.blur();
//   }
// });
// const inputFields = document.querySelectorAll('input[type="text"]');
// if(window.innerWidth<=767 && _isCanvasEnabled){
//        const canvasDiv = document.getElementById('info-btn');
//         const sortableOptionsInputs = document.querySelectorAll('#sortableoptions .list-group-item[data-type="input-text"] input[type="text"],#sortableoptions .list-group-item[data-type="select"] input[type="text"]');
//         // let originalHeight = window.innerHeight;
  
//         function showCanvas() {
//             //canvasDiv.style.display = 'block';
//             canvasDiv.scrollIntoView({ behavior: 'smooth' });
//         }
//       sortableOptionsInputs.forEach(inputField => {
//             inputField.addEventListener('focus', () => {
//                 setTimeout(showCanvas, 500); // Delay to ensure keyboard is fully up
//             });
//             //inputField.addEventListener('input', showCanvas);
//         });
//         const showInputsBtn = document.getElementById('varAddBtn');
//         showInputsBtn.addEventListener('click', () => {
//            const variationList = document.querySelectorAll('#variant_list .list-group-item[data-type="select"] input[type="text"], #variant_list .list-group-item[data-type="input-text"] input[type="text"]');
//           variationList.forEach(inputField => {
//               inputField.addEventListener('focus', () => {
//                   setTimeout(showCanvas, 500);
//               });
//           });
//       });
// }


function tabkeyBehavior(){
  var inputsAndSelects = $('.content_comes_here input');
  inputsAndSelects.off('keydown')
  inputsAndSelects.on('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var currentIndex = inputsAndSelects.index(this);
      var nextIndex = currentIndex + 1;
      if (nextIndex >= inputsAndSelects.length) {
        nextIndex = 0;
      }
      inputsAndSelects.eq(nextIndex).focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const dropdownToggle = document.getElementById('dropdownToggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  // Toggle dropdown on button click
  dropdownToggle.addEventListener('click', function () {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    dropdownToggle.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (event) {
    if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = 'none';
      dropdownToggle.classList.remove('active');
    }
  });

  // Close dropdown when selecting an item
  dropdownMenu.addEventListener('click', function () {
    dropdownMenu.style.display = 'none';
    dropdownToggle.classList.remove('active');
  });
});

// if (window.location.pathname.includes('/products/')) {
//   // Define the beforeunload handler
//   const beforeUnloadHandler = function (event) {
//     // Prevent the default action of leaving the page
//     event.preventDefault();
//     event.returnValue = ''; // Triggers the generic warning message
//     return '';
//   };

//   // Add the beforeunload event listener on the products page
//   window.addEventListener('beforeunload', beforeUnloadHandler);

//   // Function to remove the beforeunload event listener
//   function removeBeforeUnloadListener() {
//     window.removeEventListener('beforeunload', beforeUnloadHandler);
//   }
//   // Get the cart button by its ID
//   const cartButton = document.getElementById('cart-actions');

//   if (cartButton) {
//     // Add event listener to the cart button
//     cartButton.addEventListener('click', function (event) {
//       // Remove the beforeunload event listener when navigating to the cart
//       removeBeforeUnloadListener();

//     });
//   }
// }
// if(window.innerWidth<=767 && _isCanvasEnabled){
// // Function to show the custom modal
// function showUnsavedChangesModal() {
//   document.getElementById("unsavedChangesModal").style.display = "block";
// }

// // Function to hide the modal
// function hideUnsavedChangesModal() {
//   document.getElementById("unsavedChangesModal").style.display = "none";
// }

// // Handle "Stay" button click
// document.getElementById("stayBtn").addEventListener("click", function() {
//   hideUnsavedChangesModal();
//   history.pushState({}, ''); // Push the state back after staying on the page
// });

// // Handle "Leave page" button click
// document.getElementById("leaveBtn").addEventListener("click", function() {
//   window.onpopstate = null; // Allow leaving without the modal
//   window.history.back(); // Go back to the previous page
// });

// // Detect browser back/forward navigation
// window.addEventListener('popstate', function(event) {
//   showUnsavedChangesModal();
// });

// // Push a dummy state into the history so that the popstate event is triggered on back/forward navigation
// window.history.pushState({}, '');

// document.querySelectorAll('a').forEach(link => {
//   // Check if the link is inside an excluded <li> or has an excluded class
//   const isExcluded = link.classList.contains('header__action-item-link') || link.classList.contains('close');
//   if (!isExcluded) {
//     link.addEventListener('click', function(event) {
//       event.preventDefault(); // Prevent navigation
//       console.log(link.getAttribute('href'),'link.getAttribute');
//       if (link.getAttribute('href') !== "#") {
//         showUnsavedChangesModal(); // Show the custom modal
//     }
//       // Handle "Leave page" button click in modal
//       document.getElementById("leaveBtn").addEventListener("click", function() {
//         window.location.href = link.href; // Navigate to the clicked link after confirmation
//       }, { once: true }); // Use { once: true } to ensure the event listener is removed after being triggered once
//     });
//   }
// });

// // Intercept form submissions
// document.querySelectorAll('form').forEach(form => {
//   form.addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent form submission
//     showUnsavedChangesModal(); // Show custom modal

//     // Handle "Leave page" button click
//     document.getElementById("leaveBtn").addEventListener("click", function() {
//       form.submit(); // Submit the form after confirmation
//     });
//   });
// });

// }

// let initialFormState = {};  // Object to store initial values
// let isPageModified = false;  // To track if any changes were made
// let pendingNavigationUrl = "";  // To store the pending URL if the user wants to leave

// // Save initial form state
// function saveInitialState() {
//     document.querySelectorAll('input[type="text"]').forEach(element => {
//         initialFormState[element.id] = element.value;
//     });
// }

// // Compare current state with initial state to detect changes
// function checkIfFormModified() {
//     let modified = false;
// // console.log(document.querySelectorAll('input[type="text"]'),'modified');
//     document.querySelectorAll('input[type="text"]').forEach(element => {
//         let currentValue = element.value;
//         let initialValue = initialFormState[element.id];
//         console.log(initialFormState,'initialFormState');
//         // If the value is different from the initial value, mark as modified
//         if ((currentValue !== initialValue) && initialValue!=undefined) {
//           console.log(currentValue,'currentValue');
//           console.log(initialValue,'initialValue');

//             modified = true;
//         }
//     });

//     return modified;
// }

// // Track form changes (text inputs, textareas, select elements)
// document.querySelectorAll('input[type="text"]').forEach(element => {
//     element.addEventListener('input[type="text"]', () => {
//         isPageModified = checkIfFormModified();
//     });

//     element.addEventListener('change', () => {
//         isPageModified = checkIfFormModified();
//     });

//     // For undo scenario, on every keyup event, re-check form state
//     element.addEventListener('keyup', () => {
//         isPageModified = checkIfFormModified();
//     });
// });

// // Handle form reset, reset the modified flag and save new initial state
// document.querySelectorAll('form').forEach(form => {
//     form.addEventListener('reset', () => {
//         saveInitialState();  // Re-save the initial state after reset
//         isPageModified = false;  // Reset modified flag
//     });
// });

// // Show the custom modal when unsaved changes exist
// function showUnsavedChangesModal() {
//     const modal = document.getElementById('unsavedChangesModal');
//     modal.style.display = 'block';  // Show modal

//     // Stay on the current page
//     document.getElementById('stayBtn').addEventListener('click', () => {
//         modal.style.display = 'none';  // Hide modal
//     });

//     // Leave the page
//     document.getElementById('leaveBtn').addEventListener('click', () => {
//         isPageModified = false;  // Reset modified flag
//         modal.style.display = 'none';  // Hide modal
//         window.location.href = pendingNavigationUrl;  // Redirect to the stored URL
//     });
// }

// // Intercept all link clicks to check if form is modified
// document.querySelectorAll('a').forEach(link => {
//     link.addEventListener('click', function(event) {
//         if (isPageModified) {
//             event.preventDefault();  // Prevent default navigation
//             pendingNavigationUrl = event.target.href;  // Store the URL for later
//             showUnsavedChangesModal();  // Show the modal
//         } 
//         // else {
//         //     // Allow normal navigation if no changes were made
//         //     window.location.href = event.target.href;
//         // }
//     });
// });

// // Save the initial form state when the page loads
// window.onload = saveInitialState;
if (window.innerWidth <= 767 && _isCanvasEnabled) {
if (window.location.pathname.includes('/products/')) {

  let pendingNavigationUrl = "";
  let isPageModified = false;
  let isNavigatingToCart = false; // Add a flag to track cart navigation

  // Show unsaved changes modal
  function showUnsavedChangesModal() {
    const modal = document.getElementById('unsavedChangesModal');
    modal.style.display = 'block'; // Show modal

    // Stay on the page
    document.getElementById('stayBtn').onclick = () => {
      modal.style.display = 'none'; // Hide modal
      isPageModified = false;
    };

    // Leave the page
    document.getElementById('leaveBtn').onclick = () => {
      modal.style.display = 'none'; // Hide modal
      window.location.href = pendingNavigationUrl; // Redirect to the pending URL
    };
  }

  // Function to remove the beforeunload listener
  function removeBeforeUnloadListener() {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }

  // Intercept link clicks and show the modal if necessary
  document.querySelectorAll('a').forEach(link => {
    if (
      !link.classList.contains('close') &&
      !link.classList.contains('header__action-item-link') &&
      !link.classList.contains('product-gallery__thumbnail')
    ) {
      link.addEventListener('click', function (event) {
        // Check if the link has target="_blank"
        if (link.target === '_blank') {
          return; // Skip showing the custom modal for links with target="_blank"
        }

        if (!isPageModified) {
          event.preventDefault(); // Prevent default navigation
          const anchor = event.target.closest('a');
          if (anchor) {
            pendingNavigationUrl = anchor.href; // Store the URL to navigate to later
            showUnsavedChangesModal(); // Show the custom modal
            isPageModified = true;
          }
        }
      });
    }
  });

  // Disable the default beforeunload popup, but exclude cart navigation
  window.addEventListener('beforeunload', function (event) {
    if (isNavigatingToCart) {
      return; // Do not trigger beforeunload if navigating to the cart
    }

    if (!isPageModified) {
  // window.addEventListener('beforeunload', handleBeforeUnload);  
      event.preventDefault(); // Trigger the confirmation
      event.returnValue = ''; // Show the native confirmation dialog
    }
  });

  // Handle the cart button separately
  const cartButton = document.getElementById('cart-actions');

  if (cartButton) {
    cartButton.addEventListener('click', function (event) {
      // Set the flag to true to prevent the beforeunload popup from showing
      isNavigatingToCart = true;

      // Remove the beforeunload event listener when navigating to the cart
      removeBeforeUnloadListener();

      // Optional: Delay the navigation to ensure the event listener is removed first
      // setTimeout(() => {
      //   window.location.href = "/cart"; // Redirect to the cart page
      // }, 100);
    });
  }

  // Function to handle the beforeunload event
  function handleBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = ''; // Show the confirmation dialog
  }

  // Attach beforeunload listener when page is modified
  // window.addEventListener('beforeunload', handleBeforeUnload);
}
}

function removeFocus() {
  document.activeElement.blur();
}

document.addEventListener('DOMContentLoaded', function() {
  // Store the original scroll position
  let scrollPosition = 0;
  const focusableElements = document.querySelectorAll('input, textarea, select');
});

// Function to check if the element is visible
function isElementVisible(selector) {
  const $element = $(selector);
  return $element.css('display') === 'block';
}


// Listen for touchstart event
window.addEventListener('touchstart', function() {
  const skippedElements = ['.choose-value-container'];
   // IDs or class selectors of elements to skip
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
    return; // Skip removeFocus if the touch occurred in an input or textarea
  }
  // Check if the touch event occurred in any of the specific elements
  if (skippedElements.some(selector => event.target.closest(selector))) {
    return; // Skip removeFocus if the touch occurred in the specific elements
  }
  removeFocus();
});

// // Listen for keydown event to detect Enter/Go press
window.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    removeFocus();
    window.scrollTo(0, scrollPosition);
  }
});


const handleElements = document.querySelectorAll('.my-handle','.canvasimagecss');
// Loop through each element and add the 'contextmenu' event listener
handleElements.forEach(element => {
  element.addEventListener('contextmenu', function(event) {
    // Prevent the default context menu from showing up
    event.preventDefault();
  });
});
