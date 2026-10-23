/**
 * @author: Subash lakshmanan <subash@bezohminds.com>
 * @description: to render the canvas.
 */

const dpi = 72;

// Function to add an image to the canvas
function addImageToCanvas(imageUrl, id) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imageUrl, (img) => {
      // console.log(imageUrl,'imageurl');
      img.set({ selectable: false, id: id, isBaseimg: true });
      img.objectCaching = false;
      if (id == 'ruler') {
        rulerObject = img
      } else {
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);
        canvas2.setWidth(img.width);
        canvas2.setHeight(img.height);
        canvas.add(img);

      }
      resolve(img);
    }, { crossOrigin: 'Anonymous' });
  });
}

// Function to apply print color to objects
function applyPrintColor(objects, clr) {
  var color = clr == undefined ? 'black' : clr;
  objects.forEach(obj => {
    if (obj.type === 'group') {
      obj.getObjects().forEach(obj => {
        if (obj.type === 'text') obj.set('fill', color);
        else if (obj.type === 'image') {
          if (!obj.isBaseimg) {
            obj.filters = [];
            obj.filters.push(new fabric.Image.filters.BlendColor({
              color: clr,
              mode: 'add',
            }));
            obj.applyFilters();
          }
        }
      })
    } else {
      if (obj.type === 'image') {
        if (!obj.isBaseimg) {
          console.log(obj.getScaledHeight(), 'pcheight')
          obj.filters = [];
          obj.filters.push(new fabric.Image.filters.BlendColor({
            color: clr,
            mode: 'add',
          }));
          obj.applyFilters();
        }
      }
    }
  });
  canvas.renderAll();
}

// Function to apply pattern to an object
function applyPattern(obj, Imageurl, color) {
  return new Promise((resolve, reject) => {
    var clr = color || null;
    fabric.Image.fromURL(Imageurl, function (newImg) {
      newImg.getElement().crossOrigin = 'Anonymous';
      obj.setElement(newImg.getElement());
      obj.set({ width: newImg.width, height: newImg.height });
      if (color) {
        obj.filters = [new fabric.Image.filters.BlendColor({ color: color })];
      } else {
        obj.filters = [];
      }
      obj.objectCaching = false;
      obj.applyFilters();
            resolve(obj)
    }, { crossOrigin: 'Anonymous' });
  });
}

function removeAllObjects() {
  canvas.forEachObject(function (object) {
    if (object.type === 'group') {
      canvas.remove(object);
      canvas.renderAll();
      return; // Exit the loop after removal
    }
  });
}
function removeAllObjectsvariation(id) {
  canvas2.forEachObject(function (object) {
    if (object.type === 'group' || object.id == id) {
      canvas2.remove(object);
      canvas2.renderAll();
      return; // Exit the loop after removal
    }
  });
}
// Function to remove existing objects with a specific ID
function removeExisitingObject(id) {
  canvas.forEachObject(function (object) {
    if (object.type === 'group' && object.id == id) {
      canvas.remove(object);
      canvas.renderAll();
      return; // Exit the loop after removal
    }
  });
}

// Function to apply fonts to the canvas
function applyFonts(value, x, y, fillColor, family, fontSize, id) {
  var Value = value.trim();
  var fontSize = fontSize;
  if (Value == '') fontSize = 0
  // const fontFactor = (3.7 / 360) * dpi / 2.58;
  const fontFactor = (3.7 / 360) * dpi;
  var Text = new fabric.Text(value, {
    left: x,
    top: y,
    fontSize: fontSize * fontFactor,
    fontFamily: family,
    fill: fillColor || 'black',
    selectable: false,
    id: id
  });
  Text.objectCaching = false;
  return Text;
}

// Function to calculate font size to fit within a specific width
function calculateFontSize(Text, width, x) {
  var textWidth = Text.width
  while (textWidth > width && Text.fontSize > 1) {
    Text.set('fontSize', Text.fontSize - 1);
    textWidth = Text.getScaledWidth();
  }
  var center = (width - textWidth) / 2;
  Text.set({ left: (center + x) })
}

// Function to convert pixels to a specific conversion unit
function pixelConverstion(specWidth, specMaxWidth, RibbonWidth) {
  return ((specWidth / specMaxWidth) * RibbonWidth) * dpi;
}

// Function to apply an image to the canvas
function renderImage(imageUrl, x, y, width, clr, optionId, scaledValue) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      imageUrl,
      function (img) {
        // const scalingFactor = (Number(scaledValue) / 100) * (width / img.width);
        var scalingWidth = width * (scaledValue / 100);
        // const imgWidth = img.width * scalingFactor;
        const imgObj = img.set({
          // left: newX,
          top: y,
          // scaleX: scalingFactor,
          // scaleY: scalingFactor,
          id: optionId,
          selectable: false
        });
        // Apply color overlay (if clr is provided)
        if (clr) {
          imgObj.filters.push(
            new fabric.Image.filters.BlendColor({
              color: clr,
              mode: 'add',
            })
          );
          imgObj.objectCaching = false;
          imgObj.scaleToWidth(scalingWidth);
          if(imgObj.getScaledHeight() > scalingWidth){
          imgObj.scaleToHeight(scalingWidth);
          }
          const newX = x + (width - img.getScaledWidth()) / 2;
          imgObj.set({left:newX});
          if (scalingWidth > width) imgObj.scaleToWidth(width);
          imgObj.applyFilters();
        }
        resolve(imgObj);
      },
      { crossOrigin: 'Anonymous' }
    );
  });
}  

function drawBorders(id, imageUrl, width, height, x, y, flip) {
  return new Promise((resolve, reject) => {
    // Load the image from the provided URL
    fabric.Image.fromURL(imageUrl, function (img) {
      var totalBorderHeight = 0;
      var positionLeft = x;
      var positionTop = y;
      if (PrintColor) {
        var filter = new fabric.Image.filters.BlendColor({
          color: PrintColor,
          mode: 'add'
        });
        img.filters.push(filter);
        img.applyFilters();
      }
      do {
        // Clone the image object 
        var borderImageObject = fabric.util.object.clone(img);
        // Set the left and top position of the border image object
        borderImageObject.set({
          left: positionLeft,
          top: positionTop,
          originX: 0,
          originY: 0,
          id: id,
          border: true,
          flipX: flip,
          selectable: false
        });
        // Scale the border image object to the specified width
        borderImageObject.scaleToWidth(width);
        // Calculate the total border height
        totalBorderHeight += borderImageObject.getScaledHeight();
        // Adjust the border image object if the total height exceeds the ribbon height
        if (totalBorderHeight > height) {
          const numborderImages = Math.ceil(height / borderImageObject.getScaledHeight());
          const Totalborderheightt = (numborderImages - 1) * borderImageObject.getScaledHeight();
          const Cropvalue = height - Totalborderheightt;
          var ScalePercent = (Cropvalue / borderImageObject.getScaledHeight()) * 100;
          var ImageHeightPercent = (ScalePercent * borderImageObject.height) / 100;
          var borderheight = borderImageObject.height - ImageHeightPercent;
          borderImageObject.set({
            height: borderImageObject.height - borderheight,
          });
        }
        console.log(borderImageObject.getScaledHeight(), 'drawheight')
        // Update the position top for the next border image object
        positionTop += borderImageObject.getScaledHeight();
        // Add the border image object to the render group
        canvas.add(borderImageObject);
      } while (totalBorderHeight < height);
      // Resolve the promise with a value of true
      resolve(true);
    },
      { crossOrigin: 'Anonymous' });
  });
}
// function drawBorders(imageUrl, height, x, y, flip) {
//   return new Promise((resolve, reject) => {
//     // Load the image from the provided URL
//     // fabric.Image.fromURL("https://cdn.shopify.com/s/files/1/0801/3820/7544/files/transparent_image_4.png?v=1696240694", function (img) {
//     fabric.Image.fromURL("https://cdn.shopify.com/s/files/1/0801/3820/7544/files/cropped.png?v=1696323643", function (img) {
//       var totalBorderHeight = 0;
//       var positionLeft = x;
//       var positionTop = y;
//       img.scaleToWidth(200)
//       // Check if PrintColor is defined and apply color filter to the image
//       if (typeof PrintColor !== 'undefined' && PrintColor) {
//         var filter = new fabric.Image.filters.BlendColor({
//           color: PrintColor,
//           mode: 'add'
//         });
//         img.filters.push(filter);
//         img.applyFilters();
//       }
//       do {
//         // Clone the image object
//         var borderImageObject = fabric.util.object.clone(img);
//         // Set the left and top position of the border image object
//         borderImageObject.set({
//           left: positionLeft,
//           top: positionTop,
//           originX: 'left',
//           originY: 'top',
//           id:'Border',
//           flipX: flip,
//         });
//         // Calculate the available height for the current border image object
//         var availableHeight = height - totalBorderHeight;
//         // // Calculate the height of the border image object (minimum of availableHeight and original height)
//         var borderImageHeight = Math.min(borderImageObject.height, availableHeight);
//         borderImageObject.scaleToHeight(height);
//         borderImageObject.scaleToWidth(border);
//         // Update the position top for the next border image object
//         positionTop += borderImageHeight;
//         // Add the border image object to the canvas
//         canvas.add(borderImageObject);
//         // Update the total border height
//         totalBorderHeight += borderImageHeight;
//       } while (totalBorderHeight < height);
//       // Resolve the promise with a value of true
//       resolve(true);
//     },
//     { crossOrigin: 'Anonymous' });
//   });
// }


// Function to calculate the total height of objects on the canvas
function getTotalHeight(objects) {
  var sum = 0;
  objects.forEach(function (obj) {
    if (obj.type === 'text') {
      sum += obj.height;
    } else if (obj.type === 'image') {
      sum += obj.getBoundingRect().height;
    }
  });
  return sum;
}

//Function to render a text Center position
function renderTextCenter(objects, width, x) {

  objects.forEach(function (obj, index) {
    if (obj.type == "text") {
      var textWidth = obj.getScaledWidth();
      var center = (width - textWidth) / 2;
      obj.set({ left: (center + x) })
    }
  })
}

function removeExisitingObjectvariation() {
  canvas2.forEachObject(function (object) {
    if (object.type === 'group') {
      canvas2.remove(object);
      canvas2.renderAll();
      return; // Exit the loop after removal
    }
  });
}


//zoom functionality

// function zoomCanvas(event) {
//   var delta = event.e.deltaY;
//   var zoom = canvas.getZoom();
//   console.log('zoom',zoom);
//   if (delta < 0) {
//     if(zoom < 1) return false
//   }
//   var newZoom = zoom + delta / 1000;
//   if (newZoom > 5) newZoom = 5;
//   if (newZoom < 0.1) newZoom = 0.1;

//   var clientX = event.e.clientX;
//   var clientY = event.e.clientY;
//   zoomToPoint({ x: clientX, y: clientY }, newZoom);

//   event.e.preventDefault();
// }

// function zoomToPoint(point, newZoom) {
//   canvas.zoomToPoint(point, newZoom);
//   isZoomed = true;
//   canvas.requestRenderAll();
// }
// function zoomCanvas2(event) {
//   var delta = event.e.deltaY;
//   var zoom = canvas2.getZoom();
//   if (delta < 0) {
//     if(zoom < 1) return false
//   }
//   var newZoom = zoom + delta / 1000;
//   if (newZoom > 5) newZoom = 5;
//   if (newZoom < 0.1) newZoom = 0.1;

//   var clientX = event.e.clientX;
//   var clientY = event.e.clientY;
//   zoomToPoint2({ x: clientX, y: clientY }, newZoom);

//   event.e.preventDefault();
// }

// function zoomToPoint2(point, newZoom) {
//   canvas2.zoomToPoint(point, newZoom);
//   isZoomed2 = true;
//   canvas2.requestRenderAll();
// }
// function resetZoom() {
//   canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset viewport transform
//   isZoomed = false;
// }
// function resetZoom2() {
//   canvas2.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset viewport transform
//   isZoomed2 = false;
// }