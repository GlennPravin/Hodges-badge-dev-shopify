// trigger reorder
function myAccountAddtoCart(lineItems, lineNo) {
  // return console.log('lineItems',lineItems)
  myAccountCartItems(lineItems, lineNo);
}
function clearLocalStorage() {
  localStorage.clear();
}
// check cart zero or nonzero
function myAccountCartItems(lineItems, lineNo) {
  let validateEmpty = lineItems.filter((item) => {
    return item.product.product_type != "HiddenCharges";
  });
  if (validateEmpty.length == 0) return false;
  clearLocalStorage();
  document.getElementById("loaderbg").style.display = "block";

  let NonHiddenItems = [];
  let HiddenItems = [];

  $.get("/cart.js").done((_cartData) => {
    let cartData = JSON.parse(_cartData);

    if (cartData.items.length > 0) {
      NonHiddenItems = cartData.items.filter(
        (item) => item.product_type != "HiddenCharges"
      );
      HiddenItems = cartData.items.filter(
        (item) => item.product_type == "HiddenCharges"
      );

      myAcc_cartNonZero(lineItems, lineNo, NonHiddenItems, HiddenItems);
    } else {
      myAcc_cartZero(lineItems, lineNo);
    }
  });
}

function myAcc_cartNonZero(lineItems, lineNo, cartData, cartDataHiddenItems) {
  if (lineNo == undefined) {
    myAcc_addBulk_NonZero(lineItems, cartData, lineNo, cartDataHiddenItems);
  } else {
    myAcc_addSingle_NonZero(lineItems, lineNo, cartData, cartDataHiddenItems);
  }
}

function myAcc_cartZero(lineItems, lineNo) {
  if (lineNo == undefined) {
    myAcc_addBulk(lineItems, lineNo);
  } else {
    myAcc_addSingle(lineItems, lineNo);
  }
}

function myAcc_addBulk_NonZero(
  lineItems,
  cartData,
  lineNo,
  cartDataHiddenItems
) {
  let tempSetupItems = [];
  let tempDesigns = "";
  let variants = {};
  $(lineItems).each((index1, item) => {
    if (item.product.product_type != "HiddenCharges") {
      // let item = lineItems[lineNo - 1];
      let itemId = item.variant_id;
      let itemQty = item.quantity;
      var part1 = item.title
        .substring(item.title.lastIndexOf(" - "))
        .split(" - ")[1];
      var itemStrSize = part1;
      if (part1.includes("/")) itemStrSize = part1.split(" / ")[0];
      let totQty = item.quantity;
      let _baseAc = 0;
      let _hopsId = "";
      let _hopsUId = "";
      let _productSubType = "";
      let _prodType = "";
      let props = {};
      let oldHopsuid = 0;
      let printOnBack = myAcc_validateprintOnBack(item.properties);
      let previous;
      $(item.properties).each((index, prop) => {
        if (prop[0] == "Streamer Size") {
          let propString = prop[1].replace("&quot;", '"');
          props[prop[0]] = propString;
            let nextProp=item.properties[index +1];
            [itemStrSize,value] = validate_streamerValue(nextProp,propString) || itemStrSize ; 
            item.properties[index+1]=value;
        } else if (typeof prop[1] === "string") {
          if (
            prop[0].includes("_") &&
            !handlePrinOnBack(printOnBack, prop[0])
          ) {
            delete props[previous];
          } else if (
            prop[0] === "CustomDesign" ||
            prop[0] === "CustomDesignCenter" ||
            prop[0] === "Base Additional Charge"
          ) {
            props["_" + prop[0]] = prop[1];
          } else {
            props[prop[0].includes(".~") ? prop[0].split(".~")[1] : prop[0]] =
              prop[1]
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&#39;", "'")
                .replaceAll("&quot;", '"');
            previous = prop[0];
          }
        } else {
          props[prop[0]] = prop[1];
        }
        if (prop[0] == "_baseAc") {
          _baseAc = prop[1];
        }
        if (prop[0] == "_hopsId") {
          _hopsId = prop[1];
        }
        if (prop[0] == "_hopsUId") {
          if (variants[prop[1]]) {
            _hopsUId = variants[prop[1]];
            oldHopsuid = prop[1];
            props["_hopsUId"] = variants[prop[1]];
          } else {
            let currentdate = new Date();
            let timestamp = currentdate.getTime() + index1;
            let _hopUId = props["_hopsId"] + "_" + timestamp;
            _hopsUId = _hopUId;
            props["_hopsUId"] = _hopUId;
            variants[prop[1]] = _hopUId;
            oldHopsuid = prop[1];
          }
        }
        if (prop[0] == "_hopsVId") {
          props["_hopsVId"] = prop[1];
          let vationIDs = prop[1].split("_V");
          if (props["Variation"]) {
            if (!vationIDs[1].startsWith("0") && vationIDs[1] < 10)
              props["_hopsVId"] = vationIDs[0] + "_V0" + vationIDs[1];
          }
        }
      //   if (prop[0] == "_productSubType") {
      //     _productSubType = prop[1];
      //   }
        if (prop[0] == "_prodType") {
          _prodType = prop[1];
        }
        if (prop[0] == "_design") {
          if (tempDesigns == "") {
            tempDesigns = prop[1].toUpperCase();
          } else {
            tempDesigns = tempDesigns + "," + prop[1].toUpperCase();
          }
          props[prop[0]] = prop[1].toUpperCase();
        }
      });
     let myAcc_SetupCharge = myAcc_validateSetupCharge(_hopsId);
     _productSubType = myAcc_GetproductSubType(myAcc_SetupCharge,props); 
      if (_baseAc > 0) {
        calAC_myAcc(itemQty, props, itemStrSize, item.product.id);
      }
      if (_productSubType != "") {
        if (tempSetupItems.length == 0) {
          let setItem = {
            subType: _productSubType,
            hopsId: _hopsId,
            hopsUId: _hopsUId,
            prodType: _prodType,
            itemQty: itemQty,
          };
          tempSetupItems.push(setItem);
        } else {
          let tsetItems = tempSetupItems.filter((s) => s.hopsUId == _hopsUId);
          if (tsetItems.length == 0) {
            let setItem = {
              subType: _productSubType,
              hopsId: _hopsId,
              hopsUId: _hopsUId,
              prodType: _prodType,
              itemQty: itemQty,
            };
            tempSetupItems.push(setItem);
          } else {
            tsetItems[0].itemQty += itemQty;
          }
        }
      }

      props["orderType"] = "ReOrder";
      var itemAdd = {
        quantity: itemQty,
        id: itemId,
        properties: props,
      };
        prodIdAgainstQty_bulkNonZero(item, lineItems, itemAdd, oldHopsuid,itemStrSize);
    }
  });

  if (tempSetupItems.length > 0) {
    $(tempSetupItems).each((index, item) => {
      myAcc_removeCartItems(item.hopsId, item.hopsUId, cartDataHiddenItems);
      let pQty = myAcc_GetSetupChargeProdsQty(
        item.hopsId,
        item.hopsUId,
        cartData
      );
      item.itemQty += pQty;
      calSetupCharge_MyAcc(
        item.subType,
        item.hopsId,
        item.hopsUId,
        item.prodType,
        item.itemQty
      );
    });
  }

  myAcc_flatChargesUpdate(
    cartDataHiddenItems,
    cartData,
    lineItems,
    lineNo,
    tempDesigns
  );
  myAcc_addRemoveCart();
}

function myAcc_addSingle_NonZero(
  lineItems,
  lineNo,
  cartData,
  cartDataHiddenItems
) {
  let tempDesigns = "";
  let item = lineItems[lineNo - 1];
  // return console.log(item);
  let itemId = item.variant_id;
  let itemQty = item.quantity;
  var part1 = item.title
    .substring(item.title.lastIndexOf(" - "))
    .split(" - ")[1];
  var itemStrSize = part1;
  if (part1.includes("/")) itemStrSize = part1.split(" / ")[0];
  let totQty = itemQty;
  let _baseAc = 0;
  let _hopsId = "";
  let _hopsUId = "";
  let _productSubType = "";
  let _prodType = "";
  let props = {};
  let oldHopsuid = 0;
  let baseprod = 0;
  let printOnBack = myAcc_validateprintOnBack(item.properties);
  let previous;
  $(lineItems[lineNo - 1].properties).each((index, prop) => {
    if (prop[0] == "Streamer Size") {
      let propString = prop[1].replace("&quot;", '"');
      props[prop[0]] = propString;
        let nextProp=item.properties[index +1];
        [itemStrSize,value] = validate_streamerValue(nextProp,propString) || itemStrSize ; 
        item.properties[index+1]=value;
    } else if (typeof prop[1] === "string") {
      if (prop[0].includes("_") && !handlePrinOnBack(printOnBack, prop[0])) {
        delete props[previous];
      } else if (
        prop[0] === "CustomDesign" ||
        prop[0] === "CustomDesignCenter" ||
        prop[0] === "Base Additional Charge"
      ) {
        props["_" + prop[0]] = prop[1];
      } else {
        props[prop[0].includes(".~") ? prop[0].split(".~")[1] : prop[0]] =
          prop[1]
            .replaceAll("&amp;", "&")
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("&#39;", "'")
            .replaceAll("&quot;", '"');
        previous = prop[0];
      }
    } else {
      props[prop[0]] = prop[1];
    }

    if (prop[0] == "_baseAc") {
      _baseAc = prop[1];
    }
    if (prop[0] == "_hopsId") {
      _hopsId = prop[1];
    }
    if (prop[0] == "_hopsUId") {
      let currentdate = new Date();
      let timestamp = currentdate.getTime() + index;
      let _hopUId = props["_hopsId"] + "_" + timestamp;
      _hopsUId = _hopUId;
      oldHopsuid = prop[1];
      props["_hopsUId"] = _hopUId;
    }
    if (prop[0] == "_hopsVId") {
      props["_hopsVId"] = prop[1];
      let vationIDs = prop[1].split("_V");
      if (props["Variation"]) {
        if (!vationIDs[1].startsWith("0") && vationIDs[1] < 10)
          props["_hopsVId"] = vationIDs[0] + "_V0" + vationIDs[1];
      }
    }
  //   if (prop[0] == "_productSubType") {
  //     _productSubType = prop[1];
  //   }
    if (prop[0] == "_prodType") {
      _prodType = prop[1];
    }
    if (prop[0] == "_design") {
      if (tempDesigns == "") {
        tempDesigns = prop[1].toUpperCase();
      } else {
        tempDesigns = tempDesigns + "," + prop[1].toUpperCase();
      }
      props[prop[0]] = prop[1].toUpperCase();
    }
  });
  if (_hopsUId) {
    let allitems = lineItems.filter((item, index) => {
      for (const [key, value] of Object.entries(item.properties)) {
        if (
          (value[0] === "_hopsUId" && value[1] === oldHopsuid) ||
          item.product.product_type === "HiddenCharges"
        ) {
          if (item.product.product_type !== "HiddenCharges") {
            baseprod++; // Increment baseprod
          }
          return true; // Include the item in the filtered array
        }
      }
      return false; // Exclude the item from the filtered array
    });

    if (allitems && baseprod > 1) {
      myAcc_addBulk_NonZero(allitems, cartData, 0, cartDataHiddenItems);
      return;
    }
  }
  let myAcc_SetupCharge = myAcc_validateSetupCharge(_hopsId);
  _productSubType = myAcc_GetproductSubType(myAcc_SetupCharge,props); 
  if (_baseAc > 0) {
    calAC_myAcc(itemQty, props, itemStrSize, item.product.id);
  }

  if (_hopsId != "") {
    totQty += myAcc_GetSetupChargeProdsQty(_hopsId, _hopsUId, cartData);
    calSetupCharge_MyAcc(_productSubType, _hopsId, _hopsUId, _prodType, totQty);
  }

  props["orderType"] = "ReOrder";
  var itemAdd = {
    quantity: itemQty,
    id: itemId,
    properties: props,
  };

  myAcc_removeCartItems(_hopsId, _hopsUId, cartDataHiddenItems);
  myAcc_flatChargesUpdate(
    cartDataHiddenItems,
    cartData,
    lineItems,
    lineNo,
    tempDesigns
  );
    updateProdIdAgainstQty(item, totQty, itemAdd,itemStrSize);
}

function myAcc_addBulk(lineItems, lineNo) {
  let tempSetupItems = [];
  let _design = "";
  let variants = {};
  $(lineItems).each((index1, item) => {
    if (item.product.product_type != "HiddenCharges") {
      // let item = lineItems[lineNo - 1];
      let itemId = item.variant_id;
      let itemQty = item.quantity;
      var part1 = item.title
        .substring(item.title.lastIndexOf(" - "))
        .split(" - ")[1];
      var itemStrSize = part1;
      if (part1.includes("/")) itemStrSize = part1.split(" / ")[0];
      let _baseAc = 0;
      let _hopsId = "";
      let _hopsUId = "";
      let _productSubType = "";
      let _prodType = "";
      let props = {};
      let oldHopsuid = 0;
      let printOnBack = myAcc_validateprintOnBack(item.properties);
      let previous;
      $(item.properties).each((index, prop) => {
        if (prop[0] == "Streamer Size") {
          let propString = prop[1].replace("&quot;", '"');
          props[prop[0]] = propString;
            let nextProp=item.properties[index +1];
            [itemStrSize,value] = validate_streamerValue(nextProp,propString) || itemStrSize ; 
            item.properties[index+1]=value;
        } else if (typeof prop[1] === "string") {
          if (
            prop[0].includes("_") &&
            !handlePrinOnBack(printOnBack, prop[0])
          ) {
            delete props[previous];
          } else if (
            prop[0] === "CustomDesign" ||
            prop[0] === "CustomDesignCenter" ||
            prop[0] === "Base Additional Charge"
          ) {
            props["_" + prop[0]] = prop[1];
          } else {
            props[prop[0].includes(".~") ? prop[0].split(".~")[1] : prop[0]] =
              prop[1]
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&#39;", "'")
                .replaceAll("&quot;", '"');
            previous = prop[0];
          }
        } else {
          props[prop[0]] = prop[1];
        }
        if (prop[0] == "_hopsVId") {
          props["_hopsVId"] = prop[1];
          let vationIDs = prop[1].split("_V");
          if (props["Variation"]) {
            if (!vationIDs[1].startsWith("0") && vationIDs[1] < 10)
              props["_hopsVId"] = vationIDs[0] + "_V0" + vationIDs[1];
          }
        }
        if (prop[0] == "_baseAc") {
          _baseAc = prop[1];
        }
        if (prop[0] == "_hopsId") {
          _hopsId = prop[1];
        }
        if (prop[0] == "_hopsUId") {
          if (variants[prop[1]]) {
            _hopsUId = variants[prop[1]];
            props["_hopsUId"] = variants[prop[1]];
            oldHopsuid = prop[1];
          } else {
            let currentdate = new Date();
            let timestamp = currentdate.getTime() + index1;
            let _hopUId = props["_hopsId"] + "_" + timestamp;
            _hopsUId = _hopUId;
            props["_hopsUId"] = _hopUId;
            variants[prop[1]] = _hopUId;
            oldHopsuid = prop[1];
          }
        }
      //   if (prop[0] == "_productSubType") {
      //     _productSubType = prop[1];
      //   }
        if (prop[0] == "_prodType") {
          _prodType = prop[1];
        }
        if (prop[0] == "_design") {
          if (_design) {
            _design = _design + "," + prop[1].toUpperCase();
          } else {
            _design = prop[1].toUpperCase();
          }
          props[prop[0]] = prop[1].toUpperCase();
        }
      });
      let myAcc_SetupCharge = myAcc_validateSetupCharge(_hopsId);
      _productSubType = myAcc_GetproductSubType(myAcc_SetupCharge,props); 

      if (_baseAc > 0) {
        calAC_myAcc(itemQty, props, itemStrSize, item.product.id);
      }
      if (_productSubType != "") {
        if (tempSetupItems.length == 0) {
          let setItem = {
            subType: _productSubType,
            hopsId: _hopsId,
            hopsUId: _hopsUId,
            prodType: _prodType,
            itemQty: itemQty,
          };
          tempSetupItems.push(setItem);
        } else {
          let tsetItems = tempSetupItems.filter((s) => s.hopsUId == _hopsUId);
          if (tsetItems.length == 0) {
            let setItem = {
              subType: _productSubType,
              hopsId: _hopsId,
              hopsUId: _hopsUId,
              prodType: _prodType,
              itemQty: itemQty,
            };
            tempSetupItems.push(setItem);
          } else {
            tsetItems[0].itemQty += itemQty;
          }
        }
      }

      props["orderType"] = "ReOrder";
      var itemAdd = {
        quantity: itemQty,
        id: itemId,
        properties: props,
      };
        prodIdAgainstQty_bulkNonZero(item, lineItems, itemAdd, oldHopsuid, itemStrSize);
    }
  });
  if (tempSetupItems.length > 0) {
    $(tempSetupItems).each((index, item) => {
      calSetupCharge_MyAcc(
        item.subType,
        item.hopsId,
        item.hopsUId,
        item.prodType,
        item.itemQty
      );
    });
  }
  myAcc_zeroflatChargesUpdate(lineItems, lineNo, _design);
  myAcc_addRemoveCart();
}

function myAcc_addSingle(lineItems, lineNo) {
  let item = lineItems[lineNo - 1];
  let itemId = item.variant_id;
  var part1 = item.title
    .substring(item.title.lastIndexOf(" - "))
    .split(" - ")[1];
  var itemStrSize = part1;
  if (part1.includes("/")) itemStrSize = part1.split(" / ")[0];
  let itemQty = item.quantity;
  let _baseAc = 0;
  let _hopsId = "";
  let _hopsUId = "";
  let _productSubType = "";
  let _prodType = "";
  let _design = "";
  let props = {};
  let oldHopsuid = 0;
  let baseprod = 0;
  let printOnBack = myAcc_validateprintOnBack(item.properties);
  let previous;
  $(lineItems[lineNo - 1].properties).each((index, prop) => {
    if (prop[0] == "Streamer Size") {
      let propString = prop[1].replace("&quot;", '"');
      props[prop[0]] = propString;
        let nextProp=item.properties[index +1];
        [itemStrSize,value] = validate_streamerValue(nextProp,propString) || itemStrSize ; 
        item.properties[index+1]=value;
    } else if (typeof prop[1] === "string") {
      if (prop[0].includes("_") && !handlePrinOnBack(printOnBack, prop[0])) {
        delete props[previous];
      } else if (
        prop[0] === "CustomDesign" ||
        prop[0] === "CustomDesignCenter" ||
        prop[0] === "Base Additional Charge"
      ) {
        props["_" + prop[0]] = prop[1];
      } else {
        props[prop[0].includes(".~") ? prop[0].split(".~")[1] : prop[0]] =
          prop[1]
            .replaceAll("&amp;", "&")
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("&#39;", "'")
            .replaceAll("&quot;", '"');
        previous = prop[0];
      }
    } else {
      props[prop[0]] = prop[1];
    }
    if (prop[0] == "_hopsVId") {
      props["_hopsVId"] = prop[1];
      let vationIDs = prop[1].split("_V");
      if (props["Variation"]) {
        if (!vationIDs[1].startsWith("0") && vationIDs[1] < 10)
          props["_hopsVId"] = vationIDs[0] + "_V0" + vationIDs[1];
      }
    }
    if (prop[0] == "_baseAc") {
      _baseAc = prop[1];
    }
    if (prop[0] == "_hopsId") {
      _hopsId = prop[1];
    }
    if (prop[0] == "_hopsUId") {
      let currentdate = new Date();
      let timestamp = currentdate.getTime() + index;
      let _hopUId = props["_hopsId"] + "_" + timestamp;
      _hopsUId = _hopUId;
      oldHopsuid = prop[1];
      props["_hopsUId"] = _hopUId;
    }
  //   if (prop[0] == "_productSubType") {
  //     _productSubType = prop[1];
  //   }
    if (prop[0] == "_prodType") {
      _prodType = prop[1];
    }
    if (prop[0] == "_design") {
      if (_design) {
        _design = _design + "," + prop[1].toUpperCase();
      } else {
        _design = prop[1].toUpperCase();
      }
      props[prop[0]] = prop[1].toUpperCase();
    }
  });
  if (_hopsUId) {
    let allitems = lineItems.filter((item, index) => {
      for (const [key, value] of Object.entries(item.properties)) {
        if (
          (value[0] === "_hopsUId" && value[1] === oldHopsuid) ||
          item.product.product_type === "HiddenCharges"
        ) {
          if (item.product.product_type !== "HiddenCharges") {
            baseprod++; // Increment baseprod
          }
          return true; // Include the item in the filtered array
        }
      }
      return false; // Exclude the item from the filtered array
    });
    if (allitems && baseprod > 1) {
      myAcc_addBulk(allitems, undefined);
      return;
    }
  }
  let myAcc_SetupCharge = myAcc_validateSetupCharge(_hopsId);
  _productSubType = myAcc_GetproductSubType(myAcc_SetupCharge,props); 

  if (_baseAc > 0) {
    calAC_myAcc(itemQty, props, itemStrSize, item.product.id);
  }
  if (_productSubType != "") {
    calSetupCharge_MyAcc(
      _productSubType,
      _hopsId,
      _hopsUId,
      _prodType,
      itemQty
    );
  }
  props["orderType"] = "ReOrder";

  var itemAdd = {
    quantity: itemQty,
    id: itemId,
    properties: props,
  };

  myAcc_zeroflatChargesUpdate(lineItems, lineNo, _design);
    updateProdIdAgainstQty(item, itemQty, itemAdd,itemStrSize);
}

function calAC_myAcc(itemQty, properties, itemStrSize, itemid) {
  // let ac;
  let nextprop = false;
  let previous;
  // let check;
  let newprice;
  let str;
  let options;
  let additionalChargeAmount = 0;
  const regex = /- ADD: \$([\d.]+)/;
  let code = chargeCode.find((obj) => Object.keys(obj) == itemid);
  for (prop in properties) {
    if (prop != "_selectedStocks") {
      if (nextprop) {
        let centercode = myAcc_commonOptions[prop.slice(1)].values.find(
          (obj) => obj.id == properties[prop].split("~")[0]
        );
        const match1 = properties[previous].match(regex);
        if (match1) {
          properties[previous] = properties[previous].replace(
            match1[1],
            centercode.additionalCharge
          );
          additionalChargeAmount += Number(centercode.additionalCharge);
        }
        nextprop = false;
        continue;
      }
      let check = properties[prop].toString().split("~");
      if (check[2] != "" && check[2] != undefined && check[2] != 0) {
        let charges = code[itemid];
        if (charges[check[2]]) {
          newprice = charges[check[2]][itemStrSize];
          str = properties[previous];
        } else {
          if (properties["Variation"]) {
            options = myAcc_VariationOptions[prop.slice(1)].values;
          } else {
            options = myAcc_commonOptions[prop.slice(1)].values;
          }
          let optionId_values = options.find((obj) => obj.id == check[0]);
          newprice = Number(optionId_values.additionalCharge);
          str = properties[previous];
        }
        const match = str.match(regex);
        if (match) {
          str = str.replace(match[1], newprice);
          additionalChargeAmount += Number(newprice);
          properties[previous] = str;
          check[3] = newprice;
          properties[prop] = check.join("~");
        }
      }
      previous = prop;
      if (prop == "CENTER" && properties[prop].match(regex)) {
        nextprop = true;
      }
    }
  }

  if (additionalChargeAmount > 0) {
    let reorderAdditional = parseFloat(additionalChargeAmount.toFixed(3));
    let reorderRounded = (
      Math.round((reorderAdditional + Number.EPSILON) * 100) / 100
    ).toFixed(2);
    properties["_Base Additional Charge"] = "$" + reorderRounded;
    properties["_baseAc"] = reorderRounded;
    properties["Total Additional Charge"] =
      "$" + (properties["_baseAc"] * itemQty).toFixed(2);
    properties["_totalAc"] = (properties["_baseAc"] * itemQty).toFixed(2);
  }
}

function calSetupCharge_MyAcc(
  _productSubType,
  _hopsId,
  _hopsUId,
  _prodType,
  itemQty
) {
  let pSupType = "00" + _productSubType;
  let setupChargeValues = myAcc_setupCharges[pSupType];
  if (setupChargeValues == undefined) return;

  let setupLimit = Number(setupChargeValues.split(",")[0]);

  if (itemQty < setupLimit) {
    let setupValueId = setupChargeValues.split(",")[1];
    let prId = myAcc_SetupChargeVariants[setupValueId];

    let props = {};
    props["ChargeType"] = "Setup Charge";
    props["_SetupCharge"] = setupValueId;
    props["_hopsId"] = _hopsId;
    props["_hopsUId"] = _hopsUId;
    props["_prodType"] = _prodType;
    if (!props["_legacy_product_as_fee_title"]) {
      props["_legacy_product_as_fee_title"] = "Setup Charges";
      props["_legacy_product_as_fee_description"] = "Setup Charges";
    }

    var item = {
      quantity: 1,
      id: prId,
      properties: props,
    };
    myAcc_CartItems.push(item);
  }
}

function myAcc_GetSetupChargeProdsQty(_hopsId, _hopsUId, cartData) {
  let qty = 0;

  let sameProdTypeItems = cartData.filter(
    (item) => item.properties["_hopsUId"] == _hopsUId
  );
  $(sameProdTypeItems).each((index, prod) => {
    qty += prod.quantity;
  });

  return qty;
}

function myAcc_removeCartItems(_hopsId, _hopsUId, cartDataHiddenItems) {
  $(cartDataHiddenItems).each((index, prod) => {
    if (prod.title.includes("Setup Charges")) {
      if (prod.properties["_hopsUId"] == _hopsUId) {
        myAcc_CartItemsRemove[prod.key] = 0;
      }
    }
    if (prod.title.includes("Premium Processing")) {
      myAcc_CartItemsRemove[prod.key] = 0;
    }
  });
}

function myAcc_flatChargesUpdate(
  cartDataHiddenItems,
  cartData,
  lineItems,
  lineNo,
  reOrderDesigns
) {
  $(lineItems).each((index, item) => {
    let props1 = {};
    $(item.properties).each((index, property) => {
      props1[property[0]] = property[1];
    });
    item.properties = props1;
  });
  let TotalItems = cartDataHiddenItems.concat(lineItems);
  let flatItems = TotalItems.filter((item) =>
    item.title.includes("Flat Charges")
  );
  if (lineNo != "" && lineNo != undefined) {
    lineItems = lineItems[lineNo - 1];
  }
  let TotalItems2 = cartData.concat(lineItems);
  let _logoItems = TotalItems2.filter(
    (x) => x.properties["_chargeType"] == "logo"  &&
    !(PromotionProductsReorder || []).includes(x.product_id || x.product.id)
  );
  let _logoQty = 0;
  $(_logoItems).each((index, item) => {
    _logoQty += item.quantity;
  });

  // let redsgn = $.unique(reOrderDesigns.split(","));
  let redsgn = [...new Set(reOrderDesigns.split(","))];
  let cartdie = 0;
  let cartlogo = 0;
  $(flatItems).each((index, item) => {
    let cartDesigns;
    if (item.properties["ChargeType"] == "Die Charge") {
      if (item.key) {
        myAcc_CartItemsRemove[item.key] = 0;
        cartDesigns = item.properties["_design"].split(",");
      }
      if (cartDesigns) {
        if (cartDesigns.length > 0 && redsgn.length > 0 && redsgn != "") {
          reOrderDesigns = cartDesigns.concat(
            redsgn.filter((item) => !cartDesigns.includes(item))
          );
        } else {
          reOrderDesigns = cartDesigns;
        }
      } else {
        reOrderDesigns = redsgn;
      }
      if (cartdie == 0 && (reOrderDesigns != "" || cartDesigns != undefined)) {
        let props = item.properties;
        props["_design"] = reOrderDesigns.toString();
        props["Design"] = reOrderDesigns.toString();
        props["designQty"] = reOrderDesigns.length;
        if (!props["_legacy_product_as_fee_title"]) {
          props["_legacy_product_as_fee_title"] = "Die Charges";
          props["_legacy_product_as_fee_description"] = "Die Charges";
        }
        var itemAdd = {
          quantity: reOrderDesigns.length,
          id: myAcc_flatCharges[props["option"]].variant,
          properties: props,
        };
        myAcc_CartItems.push(itemAdd);
        cartdie = 1;
      }
    } else {
      if (item.key) {
        myAcc_CartItemsRemove[item.key] = 0;
      }
      if (cartlogo == 0 && _logoQty > 0) {
        let props = item.properties;
        props["_design"] = item.properties["_design"];
        props["Design"] = item.properties["Design"];
        if (!props["_legacy_product_as_fee_title"]) {
          props["_legacy_product_as_fee_title"] = "Logo Charges";
          props["_legacy_product_as_fee_description"] = "Logo Charges";
        }
        var itemAdd = {
          quantity: _logoQty,
          id: myAcc_flatCharges[props["option"]].variant,
          properties: props,
        };
        myAcc_CartItems.push(itemAdd);
        cartlogo = 1;
      }
    }
  });
  const hasLogoCharge = flatItems.some(item => {
    const props = Array.isArray(item.properties)
      ? item.properties
      : Object.entries(item.properties || {});
  
    return props.some(([key, value]) => key === "ChargeType" && value === "Logo Charge");
  });
  
  if(!hasLogoCharge && _logoQty){
    logoChargeUpdation(_logoItems,_logoQty);
  }
}

function myAcc_zeroflatChargesUpdate(
  cartDataHiddenItems,
  lineNo,
  reOrderDesigns
) {
  let flatItems = cartDataHiddenItems.filter((item) =>
    item.title.includes("Flat Charges")
  );
  let logoItems = [];
  let lineItems = cartDataHiddenItems;
  if (lineNo != "" && lineNo != undefined) {
    lineItems = lineItems[lineNo - 1];
  }
  $(lineItems).each((index, item) => {
    $(item.properties).each((index, prop) => {
      if (prop[0] == "_chargeType" && prop[1] === "logo" && !(PromotionProductsReorder || []).includes(item.product.id)) {
        logoItems.push(item);
      }
    });
  });
  let _logoQty = 0;
  $(logoItems).each((index, item) => {
    _logoQty += item.quantity;
  });
  $(flatItems).each((index, item) => {
    let props = {};
    let quantity = 0;
    $(item.properties).each((index, prop) => {
      props[prop[0]] = prop[1];
      if (props["ChargeType"] == "Die Charge" && reOrderDesigns != "") {
        if (props["designQty"]) {
          // prop[1]= reOrderDesigns !=''? $.unique(reOrderDesigns.split(",")) : prop[1];
          prop[1] =
            reOrderDesigns !== ""
              ? [...new Set(reOrderDesigns.split(","))]
              : prop[1];
          props["Design"] = prop[1].toString();
          props["_design"] = prop[1].toString();
          props["designQty"] = prop[1].length;
          quantity = props["designQty"];
        }
      } else {
        props["designQty"] = _logoQty;
      }
    });
    if (_logoQty && props["ChargeType"] == "Logo Charge") {
      if (!props["_legacy_product_as_fee_title"]) {
        props["_legacy_product_as_fee_title"] = "Logo Charges";
        props["_legacy_product_as_fee_description"] = "Logo Charges";
      }
      var itemAdd = {
        quantity: _logoQty,
        id: myAcc_flatCharges[props["option"]].variant,
        properties: props,
      };
      myAcc_CartItems.push(itemAdd);
    } else {
      if (reOrderDesigns != "" && props["ChargeType"] == "Die Charge") {
        if (!props["_legacy_product_as_fee_title"]) {
          props["_legacy_product_as_fee_title"] = "Die Charges";
          props["_legacy_product_as_fee_description"] = "Die Charges";
        }
        var itemAdd = {
          quantity: quantity,
          id: myAcc_flatCharges[props["option"]].variant,
          properties: props,
        };
        myAcc_CartItems.push(itemAdd);
      }
    }
  });

  const hasLogoCharge = flatItems.some(item => {
    return item.properties.some(prop => prop[0] === "ChargeType" && prop[1] === "Logo Charge");
  });
  if(!hasLogoCharge && _logoQty){
    logoChargeUpdation(logoItems,_logoQty);
  }
}
function getProductQty(lineitems, Hopsuid) {
  let prodqty = 0;
  $(lineitems).each((index, item) => {
    $(item.properties).each((index, property) => {
      if (
        property[0] == "_hopsUId" &&
        property[1] == Hopsuid &&
        item.product.product_type != "HiddenCharges"
      ) {
        prodqty += item.quantity;
      }
    });
  });
  return prodqty;
}

  function updateProdIdAgainstQty(item, totQty, accItem,itemStrSize) {
  let isStreamer = false;
  var part1 = item.title
    .substring(item.title.lastIndexOf(" - "))
    .split(" - ")[1];
  if (part1.includes("/")) {
    isStreamer = true;
  }
  let prodUrl = "/products/" + item.product.handle;

  jQuery.getJSON(prodUrl, function (product) {
    var strVariants;
    if (isStreamer) {
      strVariants = product.product.variants.filter(function (v) {
          return v.title.includes(itemStrSize);
      });
    } else {
      strVariants = product.product.variants;
    }

    let variId = 0;
    let variQtyRange = "";

    for (vari in strVariants) {
      if (isStreamer) {
        variQtyRange = strVariants[vari].title.split("/")[1].trim();
      } else {
        variQtyRange = strVariants[vari].title.trim();
      }

      let vari_minRange = Number(variQtyRange.split("-")[0].trim());
      let vari_maxRange = Number(variQtyRange.split("-")[1].trim());

      if (Number(totQty) >= vari_minRange && Number(totQty) <= vari_maxRange) {
        variId = strVariants[vari].id;
        break;
      }
    }

    if (variId != 0) {
      var ItemAdd = {
        quantity: totQty,
        id: variId,
        properties: accItem.properties,
      };
      myAcc_CartItems.push(ItemAdd);
      myAcc_addRemoveCart();
    } else {
      window.location.href = "/cart";
    }
  });
}

  function prodIdAgainstQty_bulkNonZero(item, lineItems, accItem, Hopsuid,newStreamer) {
  let isStreamer = false;
  let prodqty = getProductQty(lineItems, Hopsuid);
  var part1 = item.title
    .substring(item.title.lastIndexOf(" - "))
    .split(" - ")[1];
  var streamer;
  if (part1.includes("/")) {
      //streamer = part1.split(" / ")[0];
    isStreamer = true;
  }
  var strVariants;
  if (isStreamer) {
    strVariants = item.product.variants.filter(function (v) {
        return v.title.includes(newStreamer);
    });
  } else {
    strVariants = item.product.variants;
  }
  let variId = 0;
  let variQtyRange = "";

  for (vari in strVariants) {
    if (isStreamer) {
      variQtyRange = strVariants[vari].title.split("/")[1].trim();
    } else {
      variQtyRange = strVariants[vari].title.trim();
    }

    let vari_minRange = Number(variQtyRange.split("-")[0].trim());
    let vari_maxRange = Number(variQtyRange.split("-")[1].trim());

    if (Number(prodqty) >= vari_minRange && Number(prodqty) <= vari_maxRange) {
      accItem.properties["_prodQty"] = prodqty;
      variId = strVariants[vari].id;
      break;
    }
  }

  var ItemAdd = {
    quantity: item.quantity,
    id: variId,
    properties: accItem.properties,
  };
  myAcc_CartItems.push(ItemAdd);
}

function myAcc_addRemoveCart() {
  var addCart = { items: myAcc_CartItems.reverse() };

  jQuery
    .post("/cart/update.js", { updates: myAcc_CartItemsRemove })
    .done(function () {
      fetch("/cart/add.js", {
        body: JSON.stringify(addCart),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "xmlhttprequest",
        },
        method: "POST",
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          CartMOA(myAcc_minLimits, myAcc_moaAmnts);
        })
        .catch((err) => {
          /* uh oh, we have error. */
          console.error(err);
        });
    });
}
function handlePrinOnBack(value, prop) {
  if (value && myAcc_printonBackLines.includes(prop.slice(1))) {
    return false;
  }
  return true;
}

function myAcc_validateprintOnBack(props) {
  const properties = Object.fromEntries(props);
  const value = myAcc_printonBack.some((item) => {
    if (
      typeof properties["_" + item] == "string" &&
      properties["_" + item].split("~")[0] == "NO"
    ) {
      return true;
    }
  });
  return value;
}

  function validate_streamerValue(prop,streamerSize){
      let optionKey = prop[0].split("_").slice(1).join("_");
      let newStreamer = myAcc_commonOptions[optionKey]?.values?.find(
        (obj) => obj.name == streamerSize
      )?.id;
      if(newStreamer){
        let oldStreamer = prop[1].split('~')[0];
        prop[1]=prop[1].replace(oldStreamer,newStreamer);
        return [newStreamer,prop];
        }
        return undefined;
  }

  function logoChargeUpdation(logoItems, _logoQty) {
    let item = Array.isArray(logoItems) ? logoItems[0] : logoItems;
  
    // Normalize properties → always an array of [key, value]
    const props = Array.isArray(item?.properties)
      ? item.properties
      : Object.entries(item?.properties || {});
  
    // Find the first property in props that matches a key in myAcc_flatCharges
    let matchedProp = null;
  
    for (const [key, value] of props) {
      // Only process keys starting with "_"
      if (!key.startsWith("_")) continue;
  
      // Extract flatKey from key (after first underscore)
      let flatKey = key.split("_")[1];
  
      // Find matching chargeKey in myAcc_flatCharges
      let chargeKey = Object.keys(myAcc_flatCharges).find(c => c === flatKey);
  
      if (chargeKey) {
        matchedProp = key;
        break; // stop at first match
      }
    }
  
    // Extract charge
    const charge = matchedProp ? matchedProp.split("_")[1] : null;
  
    const keysToCheck = [
      `_${charge.toUpperCase()}_enterUploadfile`,
      `_${charge.toUpperCase()}_uploadImage`,
      `_${charge.toUpperCase()}`
    ];
    let value;
    for (const key of keysToCheck) {
      value = props.find(([k]) => k === key);
      if (value) break; // stop once found
    }
     
    const designCode = value[1].split("~")[0];
  
  
    // Build new props
    let newProps = {};
    newProps["ChargeType"] = myAcc_flatCharges[charge].displayName;
    newProps["_" + myAcc_flatCharges[charge].optionId] = myAcc_flatCharges[charge].valueId;
    newProps["Design"] = designCode;
    newProps["_design"] = designCode;
    newProps["option"] = myAcc_flatCharges[charge].optionId;
    newProps["designQty"] = item.quantity.toString();
    newProps["_legacy_product_as_fee_title"] = "Logo Charges";
    newProps["_legacy_product_as_fee_description"] = "Logo Charges";
  
    // Prepare item to add
    var itemAdd = {
      quantity: _logoQty,
      id: myAcc_flatCharges[charge].variant,
      properties: newProps,
    };
  
    myAcc_CartItems.push(itemAdd);
  }
  
  function myAcc_validateSetupCharge(product_id){
    let isSetup="";
    let productSubType = myAcc_productSubType[product_id] || "" ;  
    if (subTypeIds.includes(productSubType)) {
      isSetup = productSubType;
    }
    if (excludeProductsSC.includes(product_id)) {
      isSetup="";
    }
    return isSetup;
  }

  function myAcc_GetproductSubType(myAcc_SetupCharge,props){
    if(myAcc_SetupCharge == ""){
      if ("_productSubType" in props) {
        delete props["_productSubType"];
      }
      return "";
    }
    else{
      if (props["_productSubType"] !== myAcc_SetupCharge) {
        props["_productSubType"] = myAcc_SetupCharge;
      }
      return myAcc_SetupCharge;
    }
  }