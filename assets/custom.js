(function () {
  try {
    var path = (window.location.pathname || "").replace(/\/+$/, "") || "/";
    var savedTab = sessionStorage.getItem("accountPage2Tab");
    if (path === "/account/addresses" || (savedTab === "addresses" && path === "/account")) {
      window.location.replace("/pages/account-page#addresses");
      return;
    }
    if (path === "/account") {
      window.location.replace("/pages/account-page");
    }
  } catch (e) {}
})();

/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

/**
 * @author: Jino R Krishnan <jino@bezohminds.com>
 * @description: To display options in the product details page
 */
$(document).ready(() => {
  $("#streamer-size").change((event) => {
    let chosen_value = event.target.value;
    $(".quantity-price-section.show").removeClass("show");
    $(
      ".quantity-price-section[data-streamer-id=" + chosen_value + "]"
    ).addClass("show");
     $(".error.streamer-size").hide();
    ReBindingAutoComplete();
 
  });
  $('[data-toggle="tooltip"]').tooltip();
// Store the original title
let originalTitle = $('.my-handle').attr('data-original-title');

  const sortableoptions = document.getElementById("sortableoptions");
  Sortable.create(sortableoptions, {
    handle: ".my-handle,.sort_index",
    animation: 150,
     ghostClass: 'ghost',
    dragClass: "drag",
    forceFallback: true,
    draggable:".list-group-item",
    scroll: sortableoptions,
   scrollSensitivity: 250, // px, how near the mouse must be to an edge to start scrolling.
    scrollSpeed: 5, // px, speed of the scrolling

    onEnd: (event) => {
$('.my-handle').attr('data-original-title', originalTitle);

      const draggableElement = event.item;
      let value = $(draggableElement).find('input')
      canvasColorization(value);
      reorder_sort_indexes();
      tabkeyBehavior();
      if(window.innerWidth<=767){
      const stickyCanvas = document.getElementById('customized-image');
      if (stickyCanvas) {
        stickyCanvas.classList.add('sticky-canvas');
      }
    }
  },
        onMove: function (/**Event*/evt, /**Event*/originalEvent) {
          $('.my-handle').removeAttr('data-original-title');

      if(window.innerWidth<=767){
      const stickyCanvas = document.getElementById('customized-image');
      if (stickyCanvas) {
        stickyCanvas.classList.remove('sticky-canvas');
      }
    }
    },
  });
  $(".meta-reference-master").change((event) => {
    let target_id = $(event.target).val();

    const container_code = $(event.target).data("containerCode");

    if (container_code != undefined) {
      $(
        "#dependent-values-container[data-id=" +
          container_code +
          "] .dependent-values[data-meta-ref-id=" +
          target_id +
          "]"
      ).addClass("show");
    } else {
      $(".dependent-values.show").removeClass("show");

      $(".dependent-values[data-meta-ref-id=" + target_id + "]").addClass(
        "show"
      );
    }
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
  reorder_sort_indexes();
});


document.addEventListener('DOMContentLoaded', function() {
  var menu=document.getElementById('menuSection');
  //const body = document.body;
  const html = document.documentElement;
    console.log(menu);

   // Function to toggle menu visibility and scrollbar
  function toggleMenu() {
     const isOpen = menu.getAttribute('aria-expanded') === 'false';
    if(isOpen){
      console.log('enter into isopen')
      //body.classList.toggle('menu-openss');
      html.classList.toggle('menu-opens');
    }
    else{
      html.classList.remove('menu-opens');
    }
  }

  // Event listener for menu toggle
  menu.addEventListener('click', toggleMenu);
});



function reorder_sort_indexes() {
  $(".sort_index").each((index, obj) => {
    // $(obj).text(index + 1);
    var inputElement = $(obj).siblings("input,select").first();
    if (!inputElement.length) {
      console.log($(obj).siblings("div").find('input,select').first())
      inputElement = $(obj).siblings("div").find('input,select').first();
    }
    if ($(obj).closest('LI').hasClass("eitheror-group")) {
      let id = index + 1
      $("#sortableoptions li.eitheror-group div.content_comes_here").each(
        (number, element) => {
          let input = $(element);
          let data_type = $(element).data("type");

          if (data_type == 'popup') {
            inputElement = input.find("input[data-bind=autocomplete]");
            inputElement.attr("data-sortingorder", id);
          }
          if (data_type == "input-file") {
            input = input.find("input");
            if (input.attr("name") == "uploadclick_seq") {
              inputElement = $("#yourZoom_uploader").find("input");
              inputElement.attr("data-sortingorder", id);
            }
          }
        });
    } else {
      inputElement.attr("data-sortingorder", index + 1);
    }
  });
}

function popUpClose() {
  $(".overlay").css("visibility", "hidden");
  $(".overlay").css("opacity", "0");
  $(".popup").css("display", "none");
  $("#img_enlargeImage").attr("src", ""); 
    $("#img_enlargeImage_p").html( "");
}

function selectedImage(src, id, txt, _this, container_code, charges, valAdd) {
  if (container_code == "undefined") container_code = undefined;
  // if (pushableProperties["_selectedStocks"]) {
  //   pushableProperties["_selectedStocks"] =
  //     pushableProperties["_selectedStocks"] +
  //     "~" +
  //     id +
  //     "," +
  //     src +
  //     "," +
  //     txt +
  //     "," +
  //     charges +
  //     "," +
  //     valAdd;
  // } 
    if (pushableProperties["_selectedStocks"]) {
          var _selStkArray = pushableProperties["_selectedStocks"].split('~');
          for (let i = 0; i < _selStkArray.length; i++) {
          if( _selStkArray[i].split(',')[0] == id)
          {
            _selStkArray.splice(i,1)
          }
         }
          pushableProperties["_selectedStocks"]=_selStkArray.join('~');

      pushableProperties["_selectedStocks"] =
      pushableProperties["_selectedStocks"] +
      "~" +
      id +
      "," +
      src +
      "," +
      txt +
      "," +
      charges +
      "," +
      valAdd;
  } 
  else {
    pushableProperties["_selectedStocks"] =
      id + "," + src + "," + txt + "," + charges + "," + valAdd;
  }

  const domObjectac = $(".autocomplete[data-key=" + id + "]")[0];
  if (_this !== undefined) {
    const selectizeObject =
      domObjectac !== undefined ? domObjectac.selectize : false;
    const imageId = $(_this).data("id");
    if (selectizeObject) selectizeObject.setValue(imageId, false);
  }
  $("#" + id).attr("src", src);
  $("#" + id).css("visibility", "visible");
  if(src == undefined || src =="") $("#" + id).css("visibility",'hidden');
 // $("#" + id + "_btn").val("Change an Option");
 $("#" + id + "_btn").val("Change a Stock Design");
  $("#" + id + "_txt").css("visibility", "visible");
  $("#" + id + "_txt").text(txt);

  additionalChargesListFromPopup[id] = charges;

  $("#" + id + "_id").attr("data-charge", charges);
  $("#" + id + "_id").attr("data-chargeCode", valAdd);

  $("#" + id + "_dn").attr("data-dn", txt);
  $("#" + id + "_dn").attr("data-charge", charges);
  $("#" + id + "_dn").attr("data-chargeCode", valAdd);

  if (container_code !== undefined) {
    $("#" + id + "_id").data("containerCode", container_code);
  }

  $(".pop-chosen-value[data-option-id=" + id + "]").addClass("show");


  //     if ($($("#" + id + "_btn").closest("ul")).attr("id") == "CommonOptions") {
  //   if($(".dependent-values.show #enterCenterUploadfile").val()!=""){
  //     $(".dependent-values.show #enterCenterUploadfile").val("");
  //     $(".dependent-values.show #yourZoom_centerUploader input").val("");
  //    }

  // }else{

  //   if($("#enterUploadfile").val()!=""){
  //     $("#enterUploadfile").val("");
  //     $("#yourZoom_uploader input").val("");
  //    }

  // }
  
  

  

  if (
    $("#" + id + "_btn")
      .closest("li")
      .find(".or_clause_text")[0] != undefined
  ) {
   
    if (
      $("#" + id + "_btn")
        .closest("li")
        .find(".uploader-preview")[0] != undefined
    ) {
     
      if ($($("#" + id + "_btn").closest("ul")).attr("id") == "CommonOptions") {
        $(".dependent-values.show #yourZoom_centerUploader input").val("");
        $(".dependent-values.show #yourZoom_centerUploader").hide();
        // if (
        //   $($(".dependent-values.show #yourZoom_centerUploader").find(".uploader-preview")[0]).is(
        //     ":visible"
        //   )
        // ) {
        //   $(".dependent-values.show #yourZoom_centerUploader input").val("");
        //   $(".dependent-values.show #yourZoom_centerUploader").find(".uploader-preview").hide();
        // }
      } else {
        $("#yourZoom_uploader input").val("");
          $("#yourZoom_uploader").hide();
        // if (
        //   $($("#yourZoom_uploader").find(".uploader-preview")[0]).is(":visible")
        // ) {
        //   $("#yourZoom_uploader input").val("");
        //   $("#yourZoom_uploader").find(".uploader-preview").hide();
        // }
      }
    }
  }
  popUpClose();
    if (_this !== undefined) {
    const _id = $(_this).data("id");
    $("#" + id + "_id")
      .val(_id)
      .trigger("change");
  }
}
async function selectedImage_Cart(src, id, txt, _this, container_code, charges, valAdd, product_hopsUId, color_label) {
$("#popup1").css("display", "none");
document.getElementById("loaderbg").style.display = "block";

try {
    let cart = await fetch('/cart.js').then(response => response.json());

    let matchingItems = cart.items.filter(item => 
        item.properties && 
        item.properties["_hopsUId"] === product_hopsUId &&
        item.product_type &&
        item.product_type !== "HiddenCharges"
    );

    let updates = matchingItems.map(item => {
        let printColorValue = item.properties["_" + id];
        let LookUpValue = _this.dataset.id ? _this.dataset.id.trim() : "";

        if (printColorValue) {
            let remainingValue = printColorValue.split("~~");
            let updatedValue = `${LookUpValue}~~${remainingValue.slice(1).join("~~")}`;

            return {
                id: item.key,
                quantity: item.quantity,
                properties: {
                    ...item.properties,
                    [color_label]: txt,
                    ["_" + id]: updatedValue,
                }
            };
        }
        return null;
    }).filter(update => update !== null);
    for (let update of updates) {

        await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
        }).then(res => res.json());

        await new Promise(resolve => setTimeout(resolve, 300)); 
    }

    $(".table-wrapper").load(location.href + " .table-wrapper > *", function() {
        document.getElementById("loaderbg").style.display = "none";
    });

} catch (error) {
    document.getElementById("loaderbg").style.display = "none";
}
}


/**
 * @author: Jino R Krishnan<jino@bezohminds.com>
 * @description: Add to cart functionality
 */
// addtocart properties functionality - start
let pushableProperties = {};
let streamerSizeId = "";
let flatChargeOptions = [];
let additionalChargesProperties = {};
let additionalChargesListFromPopup = {};
let additionalChargeInAmount = 0;
let additionalChargeInAmountV = 0;
var canvasProperties = {};
var canvasVariationProperties = {};
let editcanvasprops ={};
let fileNamesArr={};
function glideThoughFormElements(flatCharges) {
  getStreamerSizeFromForm();
  getCommonOptionValues(flatCharges);
  getSequenceableOptionValues(flatCharges);
  getFooterOptionValues();
  // createPushablePropertiesInDom();
  // createAdditionalChargeDom();
}

function createAdditionalChargeDom() {
  var _dom = document.createElement("input");
  _dom.setAttribute("type", "hidden");
  _dom.setAttribute("name", "properties[additionalCharge]");
  _dom.setAttribute("value", additionalChargeInAmount);
  $(".product-form").append(_dom);
  if (localStorage.getItem("debug") === true) {
    const _serializedData = $(".product-form").serializeArray();
  }
}

function getStreamerSizeFromForm() {
  let _product_type = $("#product-type").val();
  let _lbl = $("#streamer-size").attr("data-label");
  let _name = $("#streamer-size").attr("name");
  let _val = $("#streamer-size").val();
  let _valTxt = $("#streamer-size option:selected").text();

  if (_name !== undefined && _val !== undefined) {
    // streamerSizeId = $("#streamer-size").val();
    pushableProperties[_lbl] = _valTxt;
    // pushableProperties["_" + _name] = _val;
    pushableProperties["_" + _name] =
      _val.toUpperCase() + "~" + "" + "~" + "" + "~" + ""+"~~~";
    if (_val == "") {
      $(".product-form__payment-container").prepend(
        "<div class='product-form__error-container' style='display: block; width: 100%;color: red;'>Please choose streamer size to continue</div>"
      );
    }
  }
  // } else if (_val == 124) {
  //   $(".product-form__payment-container").prepend(
  //     "<div class='product-form__error-container' style='display: block; width: 100%;color: red;'>Please choose streamer size to continue</div>"
  //   );
  // }
}
function getCommonOptionValues(flatCharges) {
  $("#CommonOptions li").each((index, element) => {
    // const _input = $(element).find(".choose-value-container .autocomplete");
    let data_type = $(element).data("type");
    let isSelect = false;
    let _input = $(element);
    if (data_type == "dependent-popup") {
      _input = _input.find(".choose-value-container .autocomplete");
    } else if (data_type == "dependent-select") {
      _input = _input.find("select");
      isSelect = true;
    } else if (data_type == "input-file") {
      _input = _input.find("input");
    } else if (data_type == "input-text") {
      _input = _input.find("input");
    } else if (data_type == "popup") {
        if(_input.find('.choose-value-container .WithoutAutoComplete').length > 0){
          _input = _input.find(".choose-value-container .WithoutAutoComplete");
        }
         else{
          _input = _input.find(".choose-value-container .autocomplete");
        }
    } else if (data_type == "select") {
      _input = _input.find("select");
      isSelect = true;
    }

    const _lbl = _input.attr("data-label");
    let _dn = _input.attr("data-dn");

    const _name = _input.attr("name");
    let _value = $(element).find(".pop-chosen-value > input").val();
    if (!_value) _value = _input.val();
    if (isSelect) _dn = _input.find("option:selected").text();
    const _key = _input.attr("data-key");

    let _add_Charge = _input.attr("data-charge");
    let _add_ChargeCode = _input.attr("data-chargeCode");

    if (_add_Charge == undefined) {
      _add_Charge = 0;
    }
    if (_add_ChargeCode == undefined) {
      _add_ChargeCode = "";
    }
    // let _aca = getAdditionalPrice(element, data_type, _key);
    // additionalChargeInAmount += _aca;
    // alert(additionalChargeInAmount);

    if (Number(_add_Charge) > 0) {
      additionalChargeInAmount += Number(_add_Charge);
    }

    if (
      _name !== undefined &&
      _value !== undefined &&
      _value.toUpperCase() != ""
    ) {
      if (_name.includes("_uploadCenter")) {
        pushableProperties["_CustomDesignCenter"] = $(
          ".dependent-values.show #yourZoom_centerUploader .uploader-preview img"
        ).attr("src");
      }

      if (_dn !== undefined && _dn !== "") {
        pushableProperties[_lbl] = _dn.toUpperCase();
      } else {
        pushableProperties[_lbl] = _value.toUpperCase();
      }

      pushableProperties["_" + _name] =
        _value.toUpperCase() +
        "~" +
        "" +
        "~" +
        _add_ChargeCode +
        "~" +
        _add_Charge+"~~~";

      for (charge in flatCharges) {
        if (charge.toUpperCase() == _name.toUpperCase()) {
          if (flatCharges[charge].displayName.toLowerCase().includes("logo")) {
            pushableProperties["_chargeType"] = "logo";
          }
          if (flatCharges[charge].displayName.toLowerCase().includes("die")) {
            pushableProperties["_chargeType"] = "die";
          }
          if (pushableProperties["_design"]) {
            pushableProperties["_design"] =
              pushableProperties["_design"] + "," + _value;
          } else {
            pushableProperties["_design"] = _value;
          }
          pushableProperties["_" + charge + "_" + _value] =
            charge + "_" + _value;
          pushableProperties["_" + _value] = charge + "_" + _value;
          if (flatChargeOptions.indexOf(charge + "_" + _value) == -1) {
            flatChargeOptions.push(charge + "_" + _value);
          }
        }
      }
    }

    _input = $(element).find(".dependent-values.show");
    if (_input) {
      if (data_type == "dependent-popup") {
        _input = _input.find("input[data-bind=autocomplete]");

        if (_input.val() == "") {
          _input = $(element).find(".dependent-values.show #yourZoom_centerUploader input");
         
        }
      } else if (data_type == "dependent-select") {
        _input = _input.find("select");
      } else if (data_type == "input-file") {
        _input = _input.find("input");
      } else if (data_type == "input-text") {
        _input = _input.find("input");
      } else if (data_type == "popup") {
        _input = _input.find("input[data-bind=autocomplete]");
      } else if (data_type == "select") {
        _input = _input.find("select");
      }

      let _lbl = _input.attr("data-label");
      const _dn = _input.attr("data-dn");
      let _name = _input.attr("name");
      // const _value = _input.val();
       let _value = _input.val() != undefined ?  _input.val().trim(): _input.val();
      const _key = _input.attr("data-key");
      const _dsgnId = _input.attr("data-designId");
      const _stockDesign = _input.attr("data-design");

      let _addCharge = _input.attr("data-charge");
      let _addChargeCode = _input.attr("data-chargeCode");

      if (_addCharge == undefined) {
        _addCharge = 0;
      }
      if (_addChargeCode == undefined) {
        _addChargeCode = "";
      }

      if (Number(_addCharge) > 0) {
        additionalChargeInAmount += Number(_addCharge);
      }
  
      // let _aca = getAdditionalPrice(element, data_type, _key);
      // additionalChargeInAmount += _aca;
      // alert(additionalChargeInAmount);
         let hopspName = "CenterStockDesign";
         let nxtlvlValue = _value;
         let refCode = "";
      if (_name !== undefined) {
        if (_name.includes("_uploadCenter") && _value.toUpperCase() != "") {
          if($(".dependent-values.show #enterCenterUploadfile").val()!=""){
            _name =  _name.replace("uploadCenter", "enterCenterUploadfile");
            pushableProperties["CenterPreviousDesign"] = _value;
           // pushableProperties["_CenterPreviousDesign"] = _value;
           hopspName="CenterPreviousDesign";

          }else{

            if (
              $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("src") !=
              undefined
            ) {
              pushableProperties["_CustomDesignCenter"] = $(
                ".dependent-values.show #yourZoom_centerUploader .uploader-preview img"
              ).attr("src");
              hopspName="CustomDesignCenter";
              nxtlvlValue=$(".dependent-values.show #yourZoom_centerUploader .uploader-preview .filename").text();
              refCode = $(".dependent-values.show #yourZoom_centerUploader .uploader-preview .filename").data('refcode');
              //pushableProperties["_CenterCustomDesign"] = $("#yourZoom_centerUploader .uploader-preview .filename").text()+'~'+ _value;
            } else {
              _lbl = undefined;
              _name = undefined;
            }

          }

        }
      }
      if (
        _name !== undefined &&
        _value !== undefined &&
        _value.toUpperCase() != ""
      ) {
       // if(_stockDesign == "Stock") pushableProperties["_CenterStockDesign"] = _value.toUpperCase(); 
        if (_lbl !== undefined && _lbl !== "") {
          if (_dn !== undefined && _dn !== "") {
            pushableProperties[_lbl] = _dn.toUpperCase();
          } else {
            pushableProperties[_lbl] = _value.toUpperCase();
          }
        }
        if(_name.includes('~'))
        {
                  
          pushableProperties["_" + _name.split('~')[0].trim()] =
          _name.split('~')[1].trim().toUpperCase() +
          "~" +
          "" +
          "~" +
         (_add_ChargeCode ? _add_ChargeCode:_addChargeCode) +
          "~" +
         (_add_Charge ? _add_Charge : _addCharge) +
          "~" +
          hopspName +
          "~" +
          nxtlvlValue+
          "~"+
          refCode;

        }
        else if (_name.includes('_enterCenterUploadfile')){
          pushableProperties["_" + _name.split('_enterCenterUploadfile')[0].trim()] =
          pushableProperties["_" + _name.split('_enterCenterUploadfile')[0].trim()].split('~')[0] +
          "~" +
          "" +
          "~" +
          (_add_ChargeCode ? _add_ChargeCode:_addChargeCode) +
          "~" +
          (_add_Charge ? _add_Charge : _addCharge) +
          "~" +
          hopspName +
          "~" +
          nxtlvlValue+
          "~"+
          refCode;
        }
        else if (_name.includes('_uploadCenter')){
          pushableProperties["_" + _name.split('_uploadCenter')[0].trim()] =
          pushableProperties["_" + _name.split('_uploadCenter')[0].trim()].split('~')[0] +
          "~" +
          "" +
          "~" +
          (_add_ChargeCode ? _add_ChargeCode:_addChargeCode) +
          "~" +
          (_add_Charge ? _add_Charge : _addCharge) +
          "~" +
          hopspName +
          "~" +
          nxtlvlValue+
          "~"+
          refCode;
        }
        pushableProperties["_" + _name] =
        _value.toUpperCase() +
        "~" +
        "" +
        "~" +
        _addChargeCode +
        "~" +
        _addCharge+
        "~" +
        hopspName +
        "~" +
        nxtlvlValue+
        "~"+
        refCode;
        

        let _nameFlat = _name;
        // if (_name.includes("_")) {
        //   _nameFlat = _dsgnId;
        // }
        if (_name.includes("_uploadCenter")) {
          if (_dsgnId == "Black") _nameFlat = "28CSDES";
        }
      
        for (charge in flatCharges) {
          if (charge.toUpperCase() == _nameFlat.toUpperCase()) {
            if (
              flatCharges[charge].displayName.toLowerCase().includes("logo")
            ) {
              pushableProperties["_chargeType"] = "logo";
            }
            if (flatCharges[charge].displayName.toLowerCase().includes("die")) {
              pushableProperties["_chargeType"] = "die";
            }
            if (pushableProperties["_design"]) {
              if(pushableProperties["_design"].toString().split(',').includes(_value))
              {


              }else{
                
                pushableProperties["_design"] =
                pushableProperties["_design"] + "," + _value;

              }
             
            } else {
              if(pushableProperties["_chargeType"]=="die")
              {
                if(_value.toString().includes('.')) pushableProperties["_design"] = _value;                
              }else{
                pushableProperties["_design"] = _value;
              }
              
            }
            pushableProperties["_" + charge + "_" + _value] =
              charge + "_" + _value;
            pushableProperties["_" + _value] = charge + "_" + _value;
            let _val = _value;

            if (_name.includes("_uploadCenter")) {
              _val = $(
                ".dependent-values.show #yourZoom_centerUploader .uploader-preview .filename"
              ).text();
              pushableProperties["_" + charge + "_" + _val] = _value;
              if (pushableProperties["_design"]) {
                pushableProperties["_design"] =
                  pushableProperties["_design"] + "," + _val;
              } else {
                pushableProperties["_design"] =  _val;
              }
            }else{
              if (pushableProperties["_design"]) {
                pushableProperties["_design"] =
                  pushableProperties["_design"] + "," + _value;
              } else {
                pushableProperties["_design"] = _value;
              }
            }
           
            if (flatChargeOptions.indexOf(charge + "_" + pushableProperties["_chargeType"]+"~"+  _val) == -1) {
            
              flatChargeOptions.push(charge + "_" + pushableProperties["_chargeType"]+"~"+  _val);
            }
          }
        }
        
      }
    }
  });
}

function getSequenceableOptionValues(flatCharges) {
  let seqSP = 0;
  let seqlbl = 0;
  $("#sortableoptions li").each((index, element) => {
    if (!$(element).hasClass("eitheror-group")) {
      let data_type = $(element).data("type");
      let isSelect = false;
      let _input = $(element);
      let _input2 = $(element);
      let _txtinput2 = "";
      let _nameinput2 = "";
      if (data_type == "dependent-popup") {
        _input = _input.find(".choose-value-container .autocomplete");
      } else if (data_type == "dependent-select") {
        _input = _input.find("select");
      } else if (data_type == "input-file") {
        _input = _input.find("input");
      } else if (data_type == "input-text") {
        _input = _input.find("input");
      } else if (data_type == "popup") {
        _input = _input.find(".choose-value-container .autocomplete");
      } else if (data_type == "select") {
        _input = _input.find("select");
        _input2 = _input2.find("input");
        _input2.attr('data-sortingorder', _input.attr('data-sortingorder'));
        _txtinput2 = _input2.val();
         isSelect = true;
      }
      if ($(_input).attr("id") && _isCanvasEnabled == true) {
        if (_input.val() == '' && isSelect) {


          canvasProperties[$(_input2).attr("id").split('_')[0]] = createProperties(_input2);
        } else {

          canvasProperties[$(_input).attr("id").split('_')[0]] = createProperties(_input);
        }
      }
      let _dn = _input.attr("data-dn");
      const _name = _input.attr("name");

      let _lbl = _input.attr("data-label");
      if (_isCanvasEnabled) {
        if (/\d+/.test(_lbl)) {
         _lbl = _lbl.replace(/\d+/g, '');
        }
      }
      let _value = $(element).find(".pop-chosen-value > input").val();
      if (!_value) _value = _input.val();
      if (!_dn) _dn = _value;
      if (isSelect) {
        _dn = _input.find("option:selected").text();
      }

      if (_txtinput2 != "" && _txtinput2 != undefined) {
        _dn = _txtinput2;
        _nameinput2 = _input2.attr("name");
      }
      // if (_input[0]) {
      //   if (_input[0].tagName == "SELECT")
      //     _dn = $(_input).find("option:selected").text();
      // }
      const _key = _input.attr("data-key");

      let _addCharge = _input.attr("data-charge");
      let _addChargeCode = _input.attr("data-chargeCode");
      let _sortingOrder = _input.attr("data-sortingorder") || undefined;

      if (_addCharge == undefined) {
        _addCharge = 0;
      }
      if (_addChargeCode == undefined) {
        _addChargeCode = "";
      }
      if (_addCharge > 0) {
        additionalChargeInAmount += _addCharge;

      }
      if (_txtinput2 != "" && _txtinput2 != undefined) {

        if (_lbl !== undefined) {
          // seqlbl = seqlbl + 1;
          // _lbl = seqlbl.toString() + ".~" + _lbl;
          _lbl = _lbl;
          pushableProperties[_lbl] = _dn.toUpperCase();
        }
        seqSP = seqSP + 1;
        pushableProperties["_" + _name] =
          _dn.toUpperCase() +
          "~" +
          seqSP.toString() +
          "~" +
          _addChargeCode +
          "~" +
          _addCharge +
          "~~~";
        
        pushableProperties["_" + _nameinput2] =
          _dn.toUpperCase() +
          "~" +
          seqSP.toString() +
          "~" +
          _addChargeCode +
          "~" +
          _addCharge +
          "~~~";
         
      }
     
      

      if (_name !== undefined && _value !== undefined  &&
         _value != null && (_txtinput2 == "" || _txtinput2 == undefined)) {
        if (
          _value.toUpperCase() != "- SELECT AN OPTION -" &&
          _value.toUpperCase() != "" 
        ) {
          if (_name.includes("_uploadImage")) {
            // alert('tta');
            // alert($('.uploader-preview img').attr('src')) ;
            pushableProperties["_CustomDesign"] = _value.toUpperCase();
          }
          if (_lbl !== undefined) {
            if(_isCanvasEnabled && (_lbl.includes("Print")|| _lbl.includes("Text"))){
            seqlbl = seqlbl + 1;
              _lbl =  _lbl + " " +seqlbl.toString() 
            }else{
              _lbl = _lbl
            }
            pushableProperties[_lbl] = _dn.toUpperCase();
          }

          
          // if (_addCharge > 0) {
          seqSP = seqSP + 1;
          pushableProperties["_" + _name] =
            _value.toUpperCase() +
            "~" +
            seqSP.toString() +
            "~" +
            _addChargeCode +
            "~" +
            _addCharge +
            "~~~";
          // } else {
          //   pushableProperties["_" + _name] = _value.toUpperCase();
          // }
          for (charge in flatCharges) {
            if (charge.toUpperCase() == _name.toUpperCase()) {
              if (
                flatCharges[charge].displayName.toLowerCase().includes("logo")
              ) {
                pushableProperties["_chargeType"] = "logo";
              }
              if (
                flatCharges[charge].displayName.toLowerCase().includes("die")
              ) {
                pushableProperties["_chargeType"] = "die";
              }
              if (pushableProperties["_design"]) {
                pushableProperties["_design"] =
                  pushableProperties["_design"] + "," + _value;
              } else {
                pushableProperties["_design"] = _value;
              }
              pushableProperties["_" + charge + "_" + _value] =
                charge + "_" + _value;
              pushableProperties["_" + _value] = charge + "_" + _value;
              if (flatChargeOptions.indexOf(charge + "_" + _value) == -1) {
                flatChargeOptions.push(charge + "_" + _value);
              }
            }
          }
        }
      }
    } else {
      $("#sortableoptions li.eitheror-group div.content_comes_here").each(
        (index, element) => {
          let data_type = $(element).data("type");
          let _input = $(element);
          if (data_type == "dependent-popup") {
            _input = _input.find("input[data-bind=autocomplete]");
          } else if (data_type == "dependent-select") {
            _input = _input.find("select");
          } else if (data_type == "input-file") {
            _input = _input.find("input");
          } else if (data_type == "input-text") {
            _input = _input.find("input");
          } else if (data_type == "popup") {
            _input = _input.find("input[data-bind=autocomplete]");
          } else if (data_type == "select") {
            _input = _input.find("select");
          }
          if(_input.attr("name") == "uploadclick_seq") {
            _input = $("#yourZoom_uploader").find("input");
          }
          let _name = _input.attr("name");
          let _lbl = _input.attr("data-label");
          if (_isCanvasEnabled) {
          if (/\d+/.test(_lbl)) {
             _lbl = _lbl.replace(/\d+/g, '');
            }
          }
          let _value = _input.val() != undefined ?  _input.val().trim(): _input.val();
          const _key = _input.attr("data-key");
          const _stockDesign = _input.attr("data-design");

          let _addCharge = _input.attr("data-charge");
          let _addChargeCode = _input.attr("data-chargeCode");
           let _sortingOrder = _input.attr("data-sortingorder") || undefined;

          if (_addCharge == undefined) {
            _addCharge = 0;
          }
          if (_addChargeCode == undefined) {
            _addChargeCode = "";
          }

          if (_addCharge > 0) {
            additionalChargeInAmount += _addCharge;
          }
          // let _aca = getAdditionalPrice(element, data_type, _key);
          // if (_aca > 0) {
          //   additionalChargeInAmount += _aca;
          // }
          //var dataSpacerValue = $("#uploadclick_seq").attr("data-spacer");
          var Spacer = $('.spacer.eitherorSeq_option').children().length;
          var datasortingorder=$("#yourZoom_uploader").find('input').attr('data-sortingorder');
            if 
            (
                !(_name.includes("_uploadImage")) && 
                _value.toUpperCase() === "" && 
                (Spacer != 0 || datasortingorder!=0)
            )
         {
            canvasProperties['eitherorSeq'] = geteitherOrSeqvalues(_input);
        }
          let hopspName = "StockDesign";
          let nxtlvlValue = "";
          let refCode = "";
          if ((_name.includes("_uploadImage") && _value.toUpperCase() != "")) {
           
            if ($("#enterUploadfile").val() != "") {
              _name = _name.replace("uploadImage", "enterUploadfile");
              pushableProperties["PreviousDesign"] = _value;
              if ($(_input).attr("id") && _isCanvasEnabled == true) {
                canvasProperties['eitherorSeq'] = geteitherOrSeqvalues(_input);
              }
              //pushableProperties["_PreviousDesign"] = _value;
              hopspName = "PreviousDesign";
              nxtlvlValue = _value;
            } else {
              if (
                $("#yourZoom_uploader .uploader-preview img").attr("src") !=
                undefined
              ) {
               
                pushableProperties["_CustomDesign"] = $(
                  "#yourZoom_uploader .uploader-preview img"
                ).attr("src");
                if ($(_input).attr("id") && _isCanvasEnabled == true) {
                  canvasProperties['eitherorSeq'] = geteitherOrSeqvalues(_input);
                }
                hopspName = "CustomDesign";
                nxtlvlValue = $(
                  "#yourZoom_uploader .uploader-preview .filename"
                ).text();
                refCode =  $("#yourZoom_uploader .uploader-preview .filename").data('refcode');
                // pushableProperties["_CustomDesign"] = $("#yourZoom_uploader .uploader-preview .filename").text()+"~"+_value;
              } else {
                _lbl = undefined;
                _name = undefined;
              }
            }
          }

          if (_name !== undefined && _value !== undefined) {
            if (
              _value.toUpperCase() != "- SELECT AN OPTION -" &&
              _value.toUpperCase() != "" &&
              _value.toUpperCase() != "CKV27C7D700013O7ONKHJFFVQ"
            ) {
              // if(_stockDesign == "Stock") pushableProperties["_StockDesign"] = _value.toUpperCase();
              if ($(_input).attr("id") && _isCanvasEnabled == true) {
                canvasProperties['eitherorSeq'] = geteitherOrSeqvalues(_input);
              }
              if (_lbl !== undefined && _lbl != "") {
                pushableProperties[_lbl] = _value.toUpperCase();
              }
              // pushableProperties[_lbl] = _value.toUpperCase();
              seqSP = seqSP + 1;

              if (_name.includes("_uploadImage")) {
                pushableProperties[
                  "_" + _name.split("_uploadImage")[0].trim()
                ] =
                  "0" +
                  "~" +
                  seqSP.toString() +
                  "~" +
                  _addChargeCode +
                  "~" +
                  _addCharge +
                  "~" +
                  hopspName +
                  "~" +
                  nxtlvlValue +
                  "~" +
                  refCode;
              } else if (_name.includes("_enterUploadfile")) {
                pushableProperties[
                  "_" + _name.split("_enterUploadfile")[0].trim()
                ] =
                  "0" +
                  "~" +
                  seqSP.toString() +
                  "~" +
                  _addChargeCode +
                  "~" +
                  _addCharge +
                  "~" +
                  hopspName +
                  "~" +
                  nxtlvlValue +
                  "~" +
                  refCode;
              }
              pushableProperties["_" + _name] =
                _value.toUpperCase() +
                "~" +
                seqSP.toString() +
                "~" +
                _addChargeCode +
                "~" +
                _addCharge +
                "~" +
                hopspName +
                "~" +
                nxtlvlValue +
                "~" +
                refCode;

              let tmpName = _name;
              if (_name.includes("_uploadImage"))
                tmpName = tmpName.replace("_uploadImage", "");
          if (_name.includes("_enterUploadfile"))
                tmpName = tmpName.replace("_enterUploadfile", "");
              for (charge in flatCharges) {
                if (charge.toUpperCase() == tmpName.toUpperCase()) {
                  if (
                    flatCharges[charge].displayName
                      .toLowerCase()
                      .includes("logo")
                  ) {
                    pushableProperties["_chargeType"] = "logo";
                  }
                  if (
                    flatCharges[charge].displayName
                      .toLowerCase()
                      .includes("die")
                  ) {
              if (_name.includes("_enterUploadfile")) {
                      continue
                    }
                    pushableProperties["_chargeType"] = "die";
                  }

                  pushableProperties["_" + charge + "_" + _value] =
                    charge + "_" + _value;
                  pushableProperties["_" + _value] = charge + "_" + _value;
                  let _val = _value;
                  if (_name.includes("_uploadImage")) {
                    _val = $(
                      "#yourZoom_uploader .uploader-preview .filename"
                    ).text();
                    pushableProperties["_" + charge + "_" + _val] = _value;

                    if (pushableProperties["_design"]) {
                      if (
                        pushableProperties["_design"]
                          .toString()
                          .split(",")
                          .includes(_val)
                      ) {
                      } else {
                        pushableProperties["_design"] =
                          pushableProperties["_design"] + "," + _val;
                      }
                    } else {
                      if (pushableProperties["_chargeType"] == "die") {
                        if (_val.toString().includes("."))
                          pushableProperties["_design"] = _val;
                      }
                    }
                  } else {
                    if (pushableProperties["_design"]) {
                      pushableProperties["_design"] =
                        pushableProperties["_design"] + "," + _val;
                    } else {
                      if (pushableProperties["_chargeType"] == "die") {
                        if (_val.toString().includes("."))
                          pushableProperties["_design"] = _val;
                      }
                    }
                  }
                  if (
                    flatChargeOptions.indexOf(
                      charge +
                        "_" +
                        pushableProperties["_chargeType"] +
                        "~" +
                        _val
                    ) == -1
                  ) {
                    flatChargeOptions.push(
                      charge +
                        "_" +
                        pushableProperties["_chargeType"] +
                        "~" +
                        _val
                    );
                  }
                }
              }
            }
          }
        }
      );
    }
  });
  console.log("pushableProperties", pushableProperties);
}

function getFooterOptionValues() {
  $("#FooterOptions li").each((index, element) => {
    let _input = $(element);
    //_input = _input.find("input");
    _input = _input.find("textarea");

    const _lbl = _input.attr("data-label");
    const _dn = _input.attr("data-dn");
    const _name = _input.attr("name");
    let _value = _input.val();

    const _key = _input.attr("data-key");
    let _addCharge = _input.attr("data-charge");
    let _addChargeCode = _input.attr("data-chargeCode");

    if (_addCharge == undefined) {
      _addCharge = 0;
    }
    if (_addChargeCode == undefined) {
      _addChargeCode = "";
    }
    if (Number(_addCharge) > 0) {
      additionalChargeInAmount += Number(_addCharge);
    }

    if (
      _name !== undefined &&
      _value !== undefined &&
      _value.toUpperCase() != ""
    ) {
      if (_dn !== undefined && _dn !== "") {
        pushableProperties[_lbl] = _dn.toUpperCase();
      } else {
        pushableProperties[_lbl] = _value.toUpperCase();
      }

      pushableProperties["_" + _name] =
        _value.toUpperCase() +
        "~" +
        "" +
        "~" +
        _addChargeCode +
        "~" +
        _addCharge+"~~~";
    }
  });
}
function createPushablePropertiesInDom() {
  // create hidden inputs in the name of properties for the cart.
  pushableProperties.forEach((_property) => {
    var _dom = document.createElement("input");
    _dom.setAttribute("type", "hidden");
    _dom.setAttribute("name", "properties[" + _property["name"] + "]");
    _dom.setAttribute("value", _property["value"]);
    $(".product-form").append(_dom);
    if (localStorage.getItem("debug") === true) {
      const _serializedData = $(".product-form").serializeArray();
    }
  });
}
// $(document).ready(() => {
//   $(".product-form__add-button[data-action=add-to-cart]").click((event) => {
//     event.stopPropagation();
//     event.preventDefault();
//     glideThoughFormElements();
//     $(".product-form").submit();
//   });
// });
// addtocart properties functionality - end

/**
 * @author: Jino R Krishnan <jino@bezohminds.com>
 * @description: Product info autocomplete functionality
 */
function getChosenValue(_valueList, _chosen) {
  let _chosenObject = {};
  $.each(_valueList, (index, object) => {
    if (object["id"] == _chosen) {
      _chosenObject = object;
      return false;
    }
  });
  return _chosenObject;
}
function displayChosenValue(object, value, ac_key, choosenItemName) {
  if (object.id == undefined) return;
  var popvalues = object;
  var valId = popvalues.id;
  var valName = popvalues.name;
  var valImage = popvalues.image;
  var valAdd = popvalues.additionalCharge;
  var valChargeType = popvalues.chargeType;
  let str_val = valAdd;
  var value_name_add = valName + " - Add: $" + valAdd;
  var categoryType = popvalues.valueCategory4;

  if (valChargeType != "Amount") {
    value_name_add = valName;

    if (
      valAdd != "0" &&
      valAdd != "" &&
      $("#streamer-size").val() != undefined
    ) {
      var charges = charge_code[valAdd];

      var strsize = $("#streamer-size").val().toString();
      str_val = charges[strsize];
      value_name_add = valName + " - Add: $" + str_val;
    }
  }

  $("#" + ac_key + "_txt").html(value_name_add);
  $("#" + ac_key).attr("src", object["image"]);
  if(object["image"]==undefined || object["image"]=='')$("#" + ac_key).css("visibility",'hidden');
  $("#" + ac_key + "_id").attr("data-charge", str_val);
  $("#" + ac_key + "_id").attr("data-chargeCode", valAdd);
  $("#" + ac_key + "_dn").attr("data-dn", value_name_add);
  $("#" + ac_key + "_dn").attr("data-charge", str_val);
  $("#" + ac_key + "_dn").attr("data-categoryType", categoryType);
  $("#" + ac_key + "_dn").attr("data-chargeCode", valAdd);
  $("#" + ac_key + "_dn").val(value_name_add);
  $("#" + ac_key + "_id").val(value);
  if($('#'+ac_key+"_dn").attr('data-value')=='retainOptionsVariant' ){
    localStorage.setItem('retainVariant',value)
  }
  $(".pop-chosen-value[data-option-id=" + ac_key + "]").addClass("show");
}
function checkDependentValues(object) {
  if (
    object["valueType"] !== undefined ||
    (object["dependOption"] != "" && object["dependOption"] != null)
  ) {
    $(".dependent-values").each((index, element) => {
      $(element).removeClass("show");
    });

    $(".dependent-values[data-meta-ref-id=" + object["id"] + "]").addClass(
      "show"
    );
    $(".dependent-values[data-meta-ref-id=" + object["id"] + "] #yourZoom_centerUploader").hide(); 
    $("#yourZoom_uploader").hide();
    $(".dependent-values.show .pop-chosen-value input").val('');
    $('.dependent-values.show #yourZoom_centerUploader input').val('')
    $('.dependent-values.show #enterCenterUploadfile').val('');
    $("#dependent-values-container .pop-chosen-value.show").removeClass('show');
    $(".dependent-values.show .btn_stockValue").val("Select a Stock Design");
    $(".dependent-values.show #uploadclick").val("Upload Your Design");
    $('#error-messageCenter').hide();
  }

  if (object["dependOption"] == "") {
    $(".dependent-values").each((index, element) => {
      $(element).removeClass("show");
    });
  }
}

let prodQty = 0;
let addCartItems = [];
let finalCartItems = [];
let CartChargeItems = [];
let flatChargeItems = [];
let RemoveCartItems = {};

 function baseItem(prodId,hopsProdId) {
  let baseVarQty = $("#varQty").val();
  if (additionalChargeInAmount > 0) {
    let baseAdditional =parseFloat(additionalChargeInAmount.toFixed(3));
      let roundedNum = (Math.round((baseAdditional + Number.EPSILON) * 100) / 100).toFixed(2);
     pushableProperties["_baseAc"] = roundedNum;
    pushableProperties["_Base Additional Charge"] =
      "$" + roundedNum;
    pushableProperties["Total Additional Charge"] =
    "$" + (pushableProperties["_baseAc"] * baseVarQty).toFixed(2);
    pushableProperties["_totalAc"] = (pushableProperties["_baseAc"] * baseVarQty).toFixed(2);
  }

  prodQty += Number(baseVarQty);
  let hpId = hopsProdId;

  // pushableProperties["hopsId"] = hpId;
  pushableProperties["_hopsId"] = hpId;
  pushableProperties["_hopsVId"] = hpId;
  pushableProperties["_prodType"] = prodType;
  // pushableProperties["_prodQty"] = prodQty;
if (_isCanvasEnabled) {
    if (canvasObjects[hopsProdId]) {
      pushableProperties["_canvasImage"] = getThumbSrc(hopsProdId)
      //pushableProperties["_canvasSpec"] = loadSpecsInCanvas(hopsProdId);
      canvasProperties['spacer'] = gettopBottomSpacer();
      canvasProperties['Apply'] = getApplyFontdetails();
      pushableProperties["_canvasProperties"] = JSON.stringify(canvasProperties);
    }
  }
  if(isSetupCharge) pushableProperties["_productSubType"] = productSubType;
  // localStorage.setItem(_this.id, _this.value);

  // let hpIdCount = 1;
  // if (localStorage.getItem(hpId)) {
  //   hpIdCount += Number(localStorage.getItem(hpId));
  // }
  // localStorage.setItem(hpId, hpIdCount);
  // let _hpUId = hpId + "_" + hpIdCount;
  let hpIdCount
  let Datecurrent = new Date();
  hpIdCount = Datecurrent.getTime();
  let _hpUId = hpId + "_" + hpIdCount;
  localStorage.setItem(hpId, hpIdCount);
  pushableProperties["_hopsUId"] = _hpUId;
  var Item = {
    quantity: baseVarQty,
    id: prodId,
    properties: pushableProperties,
  };
  addCartItems.push(Item);
}

 function variationItems(prodId,hopsProdId) {
  if ($(".variationsAddToCart")[0]) {
    $(".variationsAddToCart").each((index, element) => {
      canvasVariationProperties = {}
      const _varId = $(element).attr("id");
      const _qtyEle = $(element).find(".varQtyAddToCart");

      let qty = _qtyEle.val();
      prodQty += Number(qty);

      let variationProperties = {};
      let variationCount = "V"+(index + 1).toString();
      let hpId ; 
      if((index + 1)< 10){
        hpId = hopsProdId.toString() + "_" +"V"+'0'+(index + 1).toString();
      }
      else{
        hpId = hopsProdId.toString() + "_" + variationCount;
      }

      variationProperties["Variation"] = variationCount;

      $("#" + _varId + " li").each((index, element) => {
        let _input = $(element).find("input, select");
        let _input2;
        let _txtinput2 = "";
        let _nameinput2 = "";
        const _name = _input.attr("name");
        const _lbl = _input.attr("data-label");
        let _dn = _input.attr("data-dn");
        if (_isCanvasEnabled) {
          if(_input[0].tagName == "SELECT" && $(_input[0]).find("option:selected").text() =='' || $(_input[0]).find("option:selected").text() == " - Select an Option - "){
          canvasVariationProperties[_input.eq(1).attr("id")] = createProperties(_input.eq(1));
        }else{
          canvasVariationProperties[_input.attr("id")] = createProperties(_input);
        }
        }
        if (_dn == undefined) {
          if (_input[0].tagName == "SELECT") {
            _dn = $(_input[0]).find("option:selected").text();
            
            if(_dn == ""|| _dn == " - Select an Option - "){
              _input2 =  $(_input[1]);
              _dn = _input2.val();
              _txtinput2 = _input2.val();
             
            }
          }
          if (_input[0].tagName == "INPUT") {
            _dn = _input.val();
          }
        }
        let _value = _input.attr("value");
        if (_value == undefined) {
          _value = _input.val();
        }
        if (_txtinput2 != "" && _txtinput2 != undefined) {
          _value = _input2.val();
          _nameinput2 = _input2.attr("name");
        }

        let _addCharge = _input.attr("data-charge");
        let _addChargeCode = _input.attr("data-chargeCode");

        if (_addCharge == undefined) {
          _addCharge = 0;
        }
        if (_addChargeCode == undefined) {
          _addChargeCode = "";
        }

        if (_lbl !== undefined && _dn !== undefined ) {
          
            variationProperties[_lbl] = _dn.toUpperCase();

            variationProperties["_" + _name] =
              _value.toUpperCase() +
              "~" +
              "" +
              "~" +
              _addChargeCode +
              "~" +
              _addCharge+"~~~";
        if (_txtinput2 != "" && _txtinput2 != undefined) {
                variationProperties["_" + _nameinput2] =
                  _value.toUpperCase() +
                  "~" +
                  "" +
                  "~" +
                  _addChargeCode +
                  "~" +
                  _addCharge+"~~~";
              }

            
            const _inputAC = $(element).find(".pop-chosen-value input");
            const _charge = _inputAC.attr("data-charge");
            let _acv = Number(_charge);

            if (_acv > 0) {
              additionalChargeInAmountV += _acv;
            }
        }
      });

      // variationProperties["hopsId"] = hpId;
      variationProperties["_hopsVId"] = hpId;
      variationProperties["_hopsId"] = hopsProdId;
      variationProperties["_prodType"] = prodType;
      if (_isCanvasEnabled) {
        if (canvasObjects[variationCount]) {
          variationProperties["_canvasImage"] = getThumbSrc(variationCount);
          //variationProperties["_canvasSpec"] = loadSpecsInCanvas(variationCount);
          variationProperties["_canvasProperties"] = JSON.stringify(canvasVariationProperties);
        }
      }
      //variationProperties["_hopsUId"] =  pushableProperties["_hopsUId"];

      for (props in pushableProperties) {
        var prop = props;
        if(props.split('~')[1]) prop = props.split('~')[1];
        if(variationProperties[prop] && pushableProperties[props] && typeof variationProperties[prop] == 'string'){
           if(prop != '_canvasImage' && prop != '_canvasProperties'  ){
          if(variationProperties[prop].toString().includes("~") && pushableProperties[prop].toString().includes("~")){
            let test = variationProperties[prop].split('~');
            test[1] = pushableProperties[prop].split('~')[1];
            variationProperties[prop] = test.join('~');
              }
          }
        }
        if (
          !variationProperties[prop] &&
          variationProperties[prop] != "" &&
          variationProperties[prop] != "- SELECT AN OPTION -" &&
          props != "_totalAc" &&
          props != "_baseAc" &&
          props != "Total Additional Charge" &&
          props != "_Base Additional Charge"  &&
          props != "_selectedStocks" &&
          !props.includes('ExtraField')
        ) {
          variationProperties[props] = pushableProperties[props];
          if(pushableProperties[props].toString().includes("~")){
            if (pushableProperties[props].split("~")[3]) {
              additionalChargeInAmountV += Number(
                pushableProperties[props].split("~")[3]
              );
            }
          }
        }
      }
function removeEmptyProperties(variationProperties) {
    var cleanedData = {};
    let previous;
    const includesPrintOnBack = Object.keys(variationProperties).some(key => {
        const sanitizedKey = typeof key === 'string' ? key.split("_")[1] : key;
        const isKeyInPrintOnBack = printonBack.includes(sanitizedKey);
        if (isKeyInPrintOnBack) {
            const value = variationProperties[key];
            const isConditionMet = value && value.split('~')[0] === 'NO' ? true : false;
            return isConditionMet;
        }
        return false;
    });
    for (var prop in variationProperties) {
        if (variationProperties.hasOwnProperty(prop)) {
            var value = variationProperties[prop];
            if (
                prop === "_minQty" ||
                prop === "_stockCustomRider" ||
                typeof value === 'string' &&
                value.trim() !== "" &&
                !value.startsWith("~") &&
                value.indexOf("- SELECT AN OPTION -") === -1 &&
                removePrintonBackLines(cleanedData,prop,previous,includesPrintOnBack)
            ) {
                cleanedData[prop] = value;
                previous = prop;
            }
        }
    }
    return cleanedData;
}

var cleanedData = removeEmptyProperties(variationProperties);
console.log(cleanedData, "cleanedData");
      if (additionalChargeInAmountV > 0) {
        let variationAdditional =parseFloat(additionalChargeInAmountV.toFixed(3));;
        let variationrounded = (Math.round((variationAdditional + Number.EPSILON) * 100) / 100).toFixed(2);
        cleanedData["_Base Additional Charge"] =
          "$" + variationrounded;

        cleanedData["_baseAc"] = variationrounded;
        cleanedData["Total Additional Charge"] =
          "$" + (cleanedData["_baseAc"] * qty).toFixed(2).toString();
        cleanedData["_totalAc"] = (cleanedData["_baseAc"] * qty).toFixed(2);
      }
      const OrderedValues = {};
      var prop;
      for ( prop in pushableProperties) {
             if (cleanedData.hasOwnProperty("Variation")) {
              OrderedValues["Variation"] = cleanedData["Variation"];
            }
         if(cleanedData.hasOwnProperty(prop.split('~')[1])) prop = prop.split('~')[1];   
        if (cleanedData.hasOwnProperty(prop)) {
          OrderedValues[prop] = cleanedData[prop];
        }
      }
      for (const prop in cleanedData) {
         if (!OrderedValues.hasOwnProperty(prop)) {
    // Add property from variationProperties to OrderedValues if not already included
        OrderedValues[prop] = cleanedData[prop];
     }
  }
      var item = {
        quantity: qty,
        id: prodId,
        properties: OrderedValues,
      };
      
      addCartItems.push(item);
      additionalChargeInAmountV = 0;
      
    })
  }
}

function GetFlatCharges(flatCharges) {
    if(isFlatCharges){
  for (option in flatChargeOptions) {
    for (charge in flatCharges) {
      if (flatChargeOptions[option].split("_")[0] == charge) {
        if (flatCharges[charge].addChargeValue > 0) {
          let fltaddchrge = flatCharges[charge].addChargeValue;
          let prId = flatCharges[charge].variant;
          // let prId = flatChargeVariants["F" + fltaddchrge];
          if (prId == undefined) {
            return;
          }
          for (addCartItem in addCartItems) {
            console.log("addCartItem", addCartItems[addCartItem].properties);
            console.log("flatChargeOptions[option]", flatChargeOptions[option]);
            if (
              addCartItems[addCartItem].properties[
                "_" + flatChargeOptions[option]
              ]
            ) {
              addCartItems[addCartItem].properties[
                flatCharges[charge].displayName +
                  " for " +
                  flatChargeOptions[option].split("~")[1]
              ] = "$" + fltaddchrge.toFixed(2).toString();
            }
          }

          var checkFlat = flatChargeItems.filter(function (f) {
            return f.id == prId;
          });
          let dqty = 1;
          // let chrgTyp="die"
          if (flatCharges[charge].displayName.toLowerCase().includes("logo")) {
            dqty = prodQty;
            // chrgTyp="logo";
          }

          if (checkFlat.length > 0) {
            let dsngty = parseInt(checkFlat[0].properties["designQty"]);
            checkFlat[0].properties["Design"] =
              checkFlat[0].properties["Design"] +
              "," +
              flatChargeOptions[option].split("~")[1];
            checkFlat[0].properties["_design"] =
              checkFlat[0].properties["_design"] +
              "," +
              flatChargeOptions[option].split("~")[1];
            dsngty += dqty;
            checkFlat[0].properties["designQty"] = dsngty.toString();

            checkFlat[0].quantity = dsngty;
          } else {
            let props = {};

            props["ChargeType"] = flatCharges[charge].displayName;
            props["_" + flatCharges[charge].optionId] =
              flatCharges[charge].valueId;
            props["Design"] = flatChargeOptions[option].split("~")[1];
            props["_design"] = flatChargeOptions[option].split("~")[1];
            props["option"] = flatCharges[charge].optionId;
            props["designQty"] = dqty.toString();
            if (flatCharges[charge].displayName.toLowerCase().includes("logo")) {
              props["_legacy_product_as_fee_title"] = "Logo Charges";
              props["_legacy_product_as_fee_description"] = "Logo Charges";
              }else{
              props["_legacy_product_as_fee_title"] = "Die Charges";
              props["_legacy_product_as_fee_description"] = "Die Charges";
              }
           // props["_prodType"] = prodType;


            // props[flatChargeOptions[option].split('_')[1]] = flatCharges[charge].optionId;

            var item = {
              quantity: dqty,
              id: prId,
              properties: props,
            };

            flatChargeItems.push(item);
            }
          }
        }
      }
    }
  }
}

function GetSetupCharges(
  setupCharges,
  SetupChargeVariants,
  hopsProdId,
  SetupQuantity,
  hopsProdUId
) {
  let pSupType = "00" + productSubType;
  let setupChargeValues = setupCharges[pSupType];
  if (setupChargeValues == undefined) return false;
  let setupLimit = Number(setupChargeValues.split(",")[0]);

  if (SetupQuantity < setupLimit) {
    let setupValueId = setupChargeValues.split(",")[1];
    let prId = SetupChargeVariants[setupValueId];

    let props = {};
    props["ChargeType"] = "Setup Charge";
    props["_SetupCharge"] = setupValueId;
    props["_hopsId"] = hopsProdId;
    props["_hopsUId"] = hopsProdUId;
    props["_prodType"] = prodType;
    props["_legacy_product_as_fee_title"] = "Setup Charges";
    props["_legacy_product_as_fee_description"] = "Setup Charges";
    // props["hopsId"] = hopsProdId;

    var item = {
      quantity: 1,
      id: prId,
      properties: props,
    };
    CartChargeItems.push(item);
  }
}
function CartCharges_productPage(prodType, minLimits, moaAmnts, hopsProdId) {
  var cartContents = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      let cartTotal = data.total_price / 100;
      if (cartTotal > 0) {
        let cartItems = data.items;

        let SetupItem = 0;
        let SetupItemPrice = 0;
        let SetupQuantity = 0;
        let hopsProdUId = hopsProdId;
        if (localStorage.getItem(hopsProdId)) {
          hopsProdUId = hopsProdUId + "_" + localStorage.getItem(hopsProdId);
        }

        let _designItems = cartItems.filter(
          (x) =>
            x.properties["_design"] &&
            !x.title.includes("Flat Charges") &&
            x.properties["_chargeType"] != "logo"
        );
        let _designsAll = [];
        $(_designItems).each((index, item) => {
          if (_designsAll.length == 0) {
            if(item.properties["_design"].includes(','))
            {              
              $(item.properties["_design"].split(',')).each((index, dsgn)  =>{
                if(!_designsAll.includes(dsgn))  _designsAll.push(dsgn);
              });
            }else{
              _designsAll.push(item.properties["_design"]);
            }
          
          } else {


            if(item.properties["_design"].includes(','))
            {              
              $(item.properties["_design"].split(',')).each((index, dsgn)  =>{
                if(!_designsAll.includes(dsgn))  _designsAll.push(dsgn);
              });
            }else{
              if(!_designsAll.includes(item.properties["_design"])) _designsAll.push(item.properties["_design"]);
            }           
          }
        });

        let _logoItems = cartItems.filter(
            (x) => x.properties["_chargeType"] == "logo" && !(promotionProductsEdit || []).includes(x.product_id)
        );

        let _logoQty = 0;
        $(_logoItems).each((index, item) => {
          _logoQty += item.quantity;
        });

       // let _designsAll_uniq = $.unique(_designsAll.split(","));

        for (item in cartItems) {
          if (cartItems[item].product_type == "HiddenCharges") {
            if (
              cartItems[item].title.includes("Setup Charge") &&
              cartItems[item].properties["_hopsUId"] == hopsProdUId
              //cartItems[item].properties["_hopsId"] == hopsProdId
            ) {
              SetupItem = cartItems[item].id;
              SetupItemPrice = (
                Math.round(cartItems[item].price) / 100
              ).toFixed(2);
            }

            if (cartItems[item].title.includes("Premium Processing")) {
              RemoveCartItems[cartItems[item].key] = 0;
            }

            if (cartItems[item].title.includes("Flat Charge")) {
              for (flat in flatChargeItems) {
                if (flatChargeItems[flat].id == cartItems[item].id) {
                  if (
                    flatChargeItems[flat].properties["ChargeType"]
                      .toLowerCase()
                      .includes("logo")
                  ) {
                    flatChargeItems[flat].quantity = _logoQty;
                  } else {

                    let fltdsnQty = _designsAll.length;
                    flatChargeItems[flat].properties["designQty"] =
                    fltdsnQty.toString();
                    flatChargeItems[flat].quantity = fltdsnQty;
                    flatChargeItems[flat].properties["_design"]= _designsAll.toString();
                    flatChargeItems[flat].properties["Design"]= _designsAll.toString();
                    
                    // let fltdsnQty = parseInt(
                    //   flatChargeItems[flat].properties["designQty"]
                    // );
                    // let designArr =
                    //   cartItems[item].properties["_design"].split(",");
                    // if (_designsAll_uniq.length > 0) {
                    //   designArr = designArr.filter((c) =>
                    //     _designsAll_uniq.includes(c)
                    //   );
                    // }
                    // let flatdesignArr =
                    //   flatChargeItems[flat].properties["_design"].split(",");
                    // for (fitem in designArr) {
                    //   if (!flatdesignArr.includes(designArr[fitem])) {
                    //     flatChargeItems[flat].properties["Design"] =
                    //       flatChargeItems[flat].properties["Design"] +
                    //       "," +
                    //       designArr[fitem];
                    //     flatChargeItems[flat].properties["_design"] =
                    //       flatChargeItems[flat].properties["_design"] +
                    //       "," +
                    //       designArr[fitem];

                    //     fltdsnQty += 1;
                    //     flatChargeItems[flat].properties["designQty"] =
                    //       fltdsnQty.toString();
                    //     flatChargeItems[flat].quantity = fltdsnQty;
                    //   }
                    // }
                  }
                  RemoveCartItems[cartItems[item].key] = 0;
                }
              }
             if(_designsAll.length==0) {
              if(cartItems[item].properties["ChargeType"].toLowerCase().includes("die"))  RemoveCartItems[cartItems[item].key] = 0;
             }else{
              if(cartItems[item].properties["ChargeType"].toLowerCase().includes("die")){
               if(flatChargeItems.length > 0){
                   const dieChargeExists = flatChargeItems.some((flatItem) =>
                   flatItem.properties["ChargeType"].toLowerCase().includes("die"));
                for (flat in flatChargeItems) {
                    if(dieChargeExists){
                      continue
                    }
                  if(flatChargeItems[flat].properties["ChargeType"].toLowerCase().includes("logo")){
                  cartItems[item].properties["_design"] = _designsAll.toString();
                  cartItems[item].properties["Design"] = _designsAll.toString();
                  cartItems[item].properties["designQty"] = _designsAll.length.toString();
                  var fitem = {
                    quantity: _designsAll.length,
                    id: cartItems[item].id,
                    properties: cartItems[item].properties,
                  };
                  flatChargeItems.push(fitem);
                  RemoveCartItems[cartItems[item].key] = 0;
                }
              }
          }
            else{
                  cartItems[item].properties["_design"] = _designsAll.toString();
                  cartItems[item].properties["Design"] = _designsAll.toString();
                  cartItems[item].properties["designQty"] = _designsAll.length.toString();
                  var fitem = {
                    quantity: _designsAll.length,
                    id: cartItems[item].id,
                    properties: cartItems[item].properties,
                  };
                  flatChargeItems.push(fitem);
                  RemoveCartItems[cartItems[item].key] = 0;
                }
        }
      }
              if(_logoQty == 0 ){
              if(cartItems[item].properties["ChargeType"].toLowerCase().includes("logo"))  RemoveCartItems[cartItems[item].key] = 0; 
             }else{
              if(cartItems[item].properties["ChargeType"].toLowerCase().includes("logo")){
                  if(flatChargeItems.length > 0){
                      const logoChargeExists = flatChargeItems.some((flatItem) =>
                      flatItem.properties["ChargeType"].toLowerCase().includes("logo")); 
                     for (flat in flatChargeItems) {
                         if(logoChargeExists){
                         continue
                         }
                       if( flatChargeItems[flat].properties["ChargeType"].toLowerCase().includes("die")){
                  // cartItems[item].properties["_design"] = _designsAll.toString();
                  // cartItems[item].properties["Design"] = _designsAll.toString();
                  cartItems[item].properties["designQty"] = _logoQty;
                  var fitem = {
                    quantity: _logoQty,
                    id: cartItems[item].id,
                    properties: cartItems[item].properties,
                  };
      
                  flatChargeItems.push(fitem);
                  RemoveCartItems[cartItems[item].key] = 0;
              }
            }
            }else{
                  cartItems[item].properties["designQty"] = _logoQty;
                  var fitem = {
                    quantity: _logoQty,
                    id: cartItems[item].id,
                    properties: cartItems[item].properties,
                  };
      
                  flatChargeItems.push(fitem);
                  RemoveCartItems[cartItems[item].key] = 0;   
            }
            }
             }
            }
          } else {
             if (cartItems[item].properties["_hopsUId"] == hopsProdUId) {
              SetupQuantity = SetupQuantity + cartItems[item].quantity;
            }
          }
        }

        if (SetupItem > 0) {
          RemoveCartItems[SetupItem] = 0;
        }

        if (isSetupCharge) {
          GetSetupCharges(
            setupCharges,
            SetupChargeVariants,
            hopsProdId,
            SetupQuantity,
            hopsProdUId
          );
        }
      }

      for (flat in flatChargeItems) {
        CartChargeItems.push(flatChargeItems[flat]);
      }
      removeAddcartChargeItems_addtocart(prodId, prodType, minLimits, moaAmnts);
    });
}
function CartMOA(minLimits, moaAmnts) {
  var cartContents = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      // let cartTotal = data.total_price / 100;
      let cartTotal = data.original_total_price / 100;

      if (cartTotal > 0) {
        let cartItems = data.items;
        let prodMinLimit = 0; //minLimits[prodType];
        let moaItem = 0;

        let moaItemPrice = 0;
        let ppPrice = 0;

        for (item in cartItems) {
          if (cartItems[item].title.includes("Minimum Order")) {
            moaItem = cartItems[item].id;
            moaItemPrice = (Math.round(cartItems[item].price) / 100).toFixed(2);
          }
          if (cartItems[item].title.includes("Premium Processing")) {
             ppPrice = (Math.round(cartItems[item].line_price) / 100).toFixed(2);
          }
          if (cartItems[item].product_type != "HiddenCharges") {
            if (cartItems[item].properties["_prodType"]) {
              let tempProd = cartItems[item].properties["_prodType"];
              let templimit = minLimits[tempProd];
              if (templimit > prodMinLimit) {
                prodMinLimit = templimit;
              }
            }
          }
        }

        let minAmnt = prodMinLimit - (cartTotal - moaItemPrice - ppPrice);
        if (minAmnt > 0) {
          if (moaItemPrice > 0) {
            let moakey = (Math.round(minAmnt * 100) / 100)
              .toFixed(2)
              .toString();
            let moaId = moaAmnts;

            jQuery
              .post("/cart/change.js", { quantity: 0, id: moaItem })
              .done(function () {
                jQuery
                  .post("/cart/add.js", {
                    items: [
                      {
                        quantity: 1,
                        id: moaId,
                        properties: {
                          MOA: moakey,
                           _legacy_product_as_fee_title: "Minimum Order Amount",
                           _legacy_product_as_fee_description: "Minimum Order Amount",
                        },
                      },
                    ],
                  })
                  .done(function () {
                    calculatePremiumProcessing();
                    // window.location.href = "/cart";
                  });
              });
          } else {
            let moakey = (Math.round(minAmnt * 100) / 100)
              .toFixed(2)
              .toString();
            let moaId = moaAmnts;

            jQuery
              .post("/cart/add.js", {
                items: [
                  {
                    quantity: 1,
                    id: moaId,
                    properties: {
                      MOA: moakey,
                      _legacy_product_as_fee_title: "Minimum Order Amount",
                      _legacy_product_as_fee_description: "Minimum Order Amount",
                    },
                  },
                ],
              })
              .done(function () {
                calculatePremiumProcessing();
                // window.location.href = "/cart";
              });
          }
        } else {
          if (moaItemPrice > 0) {
            jQuery
              .post("/cart/change.js", { quantity: 0, id: moaItem })
              .done(function () {
                calculatePremiumProcessing();
                // window.location.href = "/cart";
              });
          } else {
            calculatePremiumProcessing();
            // window.location.href = "/cart";
          }
        }
      }
    else{
        sessionStorage.setItem("isKlaviyo", "true");
        return (window.location.href = "/cart");
      }
    });
}

function getProductId(prodId) {
var strSize = $("#streamer-size").val();
var x = document.getElementById("product-select-" + prodId); 
var productOptions = Array.from(x.options); 
productOptions.sort(function(a, b) {
    var startA = parseInt(a.innerText.match(/(\d+)-\d+/)[1]); 
    var startB = parseInt(b.innerText.match(/(\d+)-\d+/)[1]); 
    return startA - startB;
});
 
  for (i = 0; i < productOptions.length; i++) {
    if (strSize == undefined) {
      var qtyRange = productOptions[i].text.split("-")[1].trim();
      outOfRangPrd = productOptions[i].value;
      outOfRangeQty = outOfRangPrd + "_" + productOptions[i].text.split(" - ")[0].trim();
      if (Number(prodQty) <= Number(qtyRange)) {
        prId = productOptions[i].value;
        prodAmnt = Number(productOptions[i].text.split("$")[1].trim()); 
        return prId + "_" + productOptions[i].text.split(" - ")[0].trim();
      }
    } else {
      if (strSize ==productOptions[i].text.split("/")[0].trim()) {
        var qtyRange = productOptions[i].text.split("/")[1].split("-")[1].trim(); 
        outOfRangPrd =productOptions[i].value;
        outOfRangeQty = outOfRangPrd + "_" + productOptions[i].text.split("/")[1].split(" - ")[0].trim(); 
        if (Number(prodQty) <= Number(qtyRange)) {
          prId = productOptions[i].value;
          prodAmnt = Number(productOptions[i].text.split("$")[1].trim()); 
          return (
            prId + "_" + productOptions[i].text.split("/")[1].split(" - ")[0].trim()
          );
        }
      }
    }
  }
  return outOfRangeQty;
}

 function cartCheck_addtoCart(
  prodId,
  prodType,
  minLimits,
  moaAmnts,
  flatCharges,
  hopsProdId
) {
  glideThoughFormElements(flatCharges);
   baseItem(prodId,hopsProdId);
   variationItems(prodId,hopsProdId);
  GetFlatCharges(flatCharges);
  cartItems_addtocart(prodId, prodType, minLimits, moaAmnts, hopsProdId);
}

function removeAddcartChargeItems_addtocart(
  prodId,
  prodType,
  minLimits,
  moaAmnts
) {
  if (Object.keys(RemoveCartItems).length > 0 ) {
    // var removeCart = { updates: RemoveCartItems };

    jQuery
      .post("/cart/update.js", { updates: RemoveCartItems })
      .done(function () {
        if (CartChargeItems.length > 0) {
          var addCart = { items: CartChargeItems };

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
              /* yay! our products were added - do something here to indicate to the user */
              CartMOA(minLimits, moaAmnts, prodId);
            })
            .catch((err) => {
              /* uh oh, we have error. */
              console.error(err);
            });
        } else {
          CartMOA(minLimits, moaAmnts, prodId);
        }
      });
  } else {
    if (CartChargeItems.length > 0) {
      var addCart = { items: CartChargeItems };

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
          /* yay! our products were added - do something here to indicate to the user */
          CartMOA(minLimits, moaAmnts, prodId);
        })
        .catch((err) => {
          /* uh oh, we have error. */
          console.error(err);
        });
    } else {
      CartMOA(minLimits, moaAmnts, prodId);
    }
  }
}
function cartItems_addtocart(
  prodId,
  prodType,
  minLimits,
  moaAmnts,
  hopsProdId
) {
  if (addCartItems.length > 0) {
    let productIdQtyRange = getProductId(prodId);
    let productId = productIdQtyRange.split("_")[0];
    let productQtyRange = productIdQtyRange.split("_")[1];
    for (item in addCartItems) {
      addCartItems[item].id = productId;
      addCartItems[item].properties["_qtyRange"] = productQtyRange;
      addCartItems[item].properties["_prodQty"] = prodQty.toString();
      finalCartItems.push(addCartItems[item]);
    }

    var addCart = { items: finalCartItems.reverse() };

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
        /* yay! our products were added - do something here to indicate to the user */
        // CartMOA(prodType, minLimits, moaAmnts, prodId);
        CartCharges_productPage(prodType, minLimits, moaAmnts, hopsProdId);
      })
      .catch((err) => {
        /* uh oh, we have error. */
        console.error(err);
      });
  }
}

function validate_streamersize(productType) {
  let _return = true;
  $form = $(".product-form");
  let optionVal;
  let label;
  let errorAvailable = false;
  // streamer size validation - start

  if (productType == 124) {
    const _streamerSizeValue = $("#streamer-size").val();
    if (!_streamerSizeValue && _streamerSizeValue!=undefined ) {
      const error_message = "Please choose the streamer size.";
      $(".error.streamer-size").html(error_message).show();
      errorAvailable = true;
      _return = false;
    } else {
      $(".error.streamer-size").hide();
    }
  } else {
    // validation not required
  }

  // streamer size validation - end
  return {
    _return: _return,
    optionVal: optionVal,
    label: label,
    errorAvailable: errorAvailable,
  };
}

function validate_commonoptions(productType = "") {
  let _return = true;
  $form = $(".product-form");
  let optionVal;
  let label;
  let errorAvailable = false;
  $("#CommonOptions li").each((index, element) => {
    let optionId = $(element).data("optionId");
    switch ($(element).data("type")) {
      case "dependent-popup":

      let ele = $(element).find(".dependent-values.show");
      let lbl = $(ele).find("label").html();

      if(lbl != undefined){
        let center =$(element).find(".choose-value-container input").val();
        optionVal = $(ele).find(".pop-chosen-value input").val();
        if(optionVal=="") {
          let uplbl = $(ele).find(".uploader-preview label").html();
          let upval = $(ele).find("#yourZoom_centerUploader input").val();
         
        
          if(upval!="" && !uplbl){
           
            upval = $(".dependent-values.show #enterCenterUploadfile").val();
            if(upval!="")uplbl=upval;
            
          }

          if(upval !="" && uplbl !="") optionVal = uplbl;
         
         
        } 
       
        if(center !=''){
              if (!optionVal) {
                $(".error." + optionId)
                  .html("Please choose the option " + lbl)
                  .show();
                errorAvailable = true;
              } else {
                $(".error." + optionId).hide();
              }
           }
        else{
          if(center == undefined || center ==''){
            optionVal = center;
            label = $(element).find("label").html();
            if (
              $(element).find(".pop-chosen-value input")[0].hasAttribute("required")
            ) {
              if (!optionVal) {
                $(".error." + optionId)
                  .html("Please choose the option " + label)
                  .show();
                errorAvailable = true;
               _return = false;
              } else {
                $(".error." + optionId).hide();
              }
            }
            }
          }
      }else{
     
        optionVal = $(element).find(".pop-chosen-value input").val();
        label = $(element).find("label").html();
        if (
          $(element).find(".pop-chosen-value input")[0].hasAttribute("required")
        ) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
      }
        break;
      case "dependent-select":
        optionVal = $(element).find("select").val();
        label = $(element).find("select").data("label");
        if ($(element).find("select")[0].hasAttribute("required")) {
          if (!optionVal && optionVal != "- Select an Option - ") {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
      case "input-file":
        optionVal = $(element).find("input").val();
        label = $(element).find("label").html();
        if ($(element).find("input")[0].hasAttribute("required")) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
      case "input-text":
        optionVal = $(element).find("input").val();
        let lengthAllowed =
          $(element).find("input").data("optionDisplay") || 12;
        if (
          !isNaN(Number(lengthAllowed)) &&
          Number(lengthAllowed) != undefined &&
          Number(lengthAllowed) != ""
        ) {
          lengthAllowed = Number(lengthAllowed);
        } else {
          lengthAllowed = 12;
        }
        label = $(element).find("label").html();
        if ($(element).find("input")[0].hasAttribute("required")) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
            // _return = false;
            // return false
          }
          // else {
          //   $(".error." + optionId).hide();
          // }
          else if (optionVal.toString().length > lengthAllowed) {
            $(".error." + optionId)
              .html(
                "A maximum of " +
                  lengthAllowed +
                  " characters are allowed in the option " +
                  label
              )
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
      case "popup":
        optionVal = $(element).find(".pop-chosen-value input").val();
        label = $(element).find("label").html();
        if (
          $(element).find(".pop-chosen-value input")[0].hasAttribute("required")
        ) {
          console.log(optionVal,'popupvalue');
            console.log(label,'label');
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
      case "select":
        optionVal = $(element).find("select").val();
        label = $(element).find("select").data("label");
        if ($(element).find("select")[0].hasAttribute("required")) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
    }
  });

  return {
    _return: _return,
    optionVal: optionVal,
    label: label,
    errorAvailable: errorAvailable,
  };
}

function validate_sortableoptions(productType) {
  let _return = true;
  $form = $(".product-form");
  let optionVal;
  let label;
  let errorAvailable = false;
  $("#sortableoptions li").each((index, element) => {
    if (!$(element).hasClass("eitheror-group")) {
      let optionId = $(element).data("optionId");
      switch ($(element).data("type")) {
        case "input-file":
          optionVal = $(element).find("input").val();
          label = $(element).find("label").html();
          if ($(element).find("input")[0].hasAttribute("required")) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
              _return = false; 
               return false;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
        case "input-text":
          optionVal = $(element).find("input").val();
          label = $(element).find("label").html();
          let lengthAllowed =
            $(element).find("input").data("optionDisplay") || 12;
          if (
            !isNaN(Number(lengthAllowed)) &&
            Number(lengthAllowed) != undefined &&
            Number(lengthAllowed) != ""
          ) {
            lengthAllowed = Number(lengthAllowed);
          } else {
            lengthAllowed = 12;
          }
          if ($(element).find("input")[0]) {
            if ($(element).find("input")[0].hasAttribute("required")) {
              if (!optionVal) {
                $(".error." + optionId)
                  .html("Please choose the option " + label)
                  .show();
                errorAvailable = true;
                 _return = false; 
                 return false;
              } else {
                $(".error." + optionId).hide();
              }
            }
          }
          if (optionVal != undefined) {
            if (optionVal.toString().length > lengthAllowed) {
              $(".error." + optionId)
                .html(
                  "A maximum of " +
                    lengthAllowed +
                    " characters are allowed in the option " +
                    label
                )
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
        case "popup":
          optionVal = $(element).find(".pop-chosen-value input").val();
          label = $(element).find("label").html();
          if (
            $(element)
              .find(".pop-chosen-value input")[0]
              .hasAttribute("required")
          ) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
        case "select":
          optionVal = $(element).find("select").val();
          label = $(element).find("select").data("label");
          if ($(element).find("select")[0].hasAttribute("required")) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
      }
    }
  });
  return {
    _return: _return,
    optionVal: optionVal,
    label: label,
    errorAvailable: errorAvailable,
  };
}

function validate_eitheroroptions(productType) {
  let _return = true;
  $form = $(".product-form");
  let optionVal;
  let label;
  let errorAvailable = false;
  $("#sortableoptions li.eitheror-group > div.content_comes_here").each(
    (index, element) => {
      let optionId = $(element).data("optionId");
      switch ($(element).data("type")) {
        case "input-file":
          optionVal = $(element).find("input").val();
          label = $(element).find("label").html();
          if ($(element).find("input")[0].hasAttribute("required")) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
        case "input-text":
          optionVal = $(element).find("input").val();
          label = $(element).find("label").html();
          let lengthAllowed =
            $(element).find("input").data("optionDisplay") || 12;
          if (
            !isNaN(Number(lengthAllowed)) &&
            Number(lengthAllowed) != undefined &&
            Number(lengthAllowed) != ""
          ) {
            lengthAllowed = Number(lengthAllowed);
          } else {
            lengthAllowed = 12;
          }
          if ($(element).find("input")[0].hasAttribute("required")) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          if (optionVal.toString().length > lengthAllowed) {
            $(".error." + optionId)
              .html(
                "A maximum of " +
                  lengthAllowed +
                  " characters are allowed in the option " +
                  label
              )
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
          break;
        case "popup":
          optionVal = $(element).find(".pop-chosen-value input").val();
          label = $(element).find("label").html();
          if (
            $(element)
              .find(".pop-chosen-value input")[0]
              .hasAttribute("required")
          ) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
        case "select":
          optionVal = $(element).find("select").val();
          label = $(element).find("select").data("label");
          if ($(element).find("select")[0].hasAttribute("required")) {
            if (!optionVal) {
              $(".error." + optionId)
                .html("Please choose the option " + label)
                .show();
              errorAvailable = true;
            } else {
              $(".error." + optionId).hide();
            }
          }
          break;
      }
    }
  );
  return {
    _return: _return,
    optionVal: optionVal,
    label: label,
    errorAvailable: errorAvailable,
  };
}

function validate_variation(productType) {
  let _return = true;
  $form = $(".product-form");
  let optionVal;
  let label;
  let errorAvailable = false;
  $("#variation li").each((index, element) => {
    // loop through variation options in a section
    let optionId = $(element).data("optionId");
    switch ($(element).data("type")) {
      case "input-file":
        optionVal = $(element).find("input").val();
        label = $(element).find("label").html();
        if ($(element).find("input")[0].hasAttribute("required")) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
      case "input-text":
        optionVal = $(element).find("input").val();
        label = $(element).find("label").html();
        let lengthAllowed =
          $(element).find("input").data("optionDisplay") || 12;
        if (
          !isNaN(Number(lengthAllowed)) &&
          Number(lengthAllowed) != undefined &&
          Number(lengthAllowed) != ""
        ) {
          lengthAllowed = Number(lengthAllowed);
        } else {
          lengthAllowed = 12;
        }
        if ($(element).find("input")[0].hasAttribute("required")) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
            _return = false;
            // return false
          }
          // else {
          //   $(".error." + optionId).hide();
          // }
        }
        else if (optionVal.toString().length > lengthAllowed) {
          $(".error." + optionId)
            .html(
              "A maximum of " +
                lengthAllowed +
                " characters are allowed in the option " +
                label
            )
            .show();
          errorAvailable = true;
        } else {
          $(".error." + optionId).hide();
        }
        break;
      case "popup":
        optionVal = $(element).find(".pop-chosen-value input").val();
        label = $(element).find("label").html();
        if (
          $(element).find(".pop-chosen-value input")[0].hasAttribute("required")
        ) {
          if (!optionVal) {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
      case "select":
        optionVal = $(element).find("select").val();
        label = $(element).find("select").data("label");
        if ($(element).find("select")[0].hasAttribute("required")) {
          if (!optionVal || optionVal == "- Select an Option -") {
            $(".error." + optionId)
              .html("Please choose the option " + label)
              .show();
            errorAvailable = true;
          } else {
            $(".error." + optionId).hide();
          }
        }
        break;
    }
  });
  return {
    _return: _return,
    optionVal: optionVal,
    label: label,
    errorAvailable: errorAvailable,
  };
}

function validate_form() {
  let _return = true;
  $form = $(".product-form");
  let optionVal;
  let label;
  let errorAvailable = false;
  let productType = $("#product-type").val();

  // streamer size validation - start
  let _response = validate_streamersize(productType);
  _return = _return ? _response["_return"] : _return;
  optionVal = optionVal ? _response["optionVal"] : optionVal;
  label = label ? _response["label"] : label;
  errorAvailable =
    errorAvailable == false && _response["errorAvailable"] == true
      ? _response["errorAvailable"]
      : errorAvailable;
  // streamer size validation - end

  // commonoptions validation - start
  _response = validate_commonoptions(productType);
  _return = _return ? _response["_return"] : _return;
  optionVal = optionVal ? _response["optionVal"] : optionVal;
  label = label ? _response["label"] : label;
  errorAvailable =
    errorAvailable == false && _response["errorAvailable"] == true
      ? _response["errorAvailable"]
      : errorAvailable;
  // commonoptions validation - end

  // sortableoptions validation - start
  _response = validate_sortableoptions(productType);
  _return = _return ? _response["_return"] : _return;
  optionVal = optionVal ? _response["optionVal"] : optionVal;
  label = label ? _response["label"] : label;
  errorAvailable =
    errorAvailable == false && _response["errorAvailable"] == true
      ? _response["errorAvailable"]
      : errorAvailable;
  // sortableoptions validation - end

  // eitheroroptions validation - start
  _response = validate_eitheroroptions(productType);
  _return = _return ? _response["_return"] : _return;
  optionVal = optionVal ? _response["optionVal"] : optionVal;
  label = label ? _response["label"] : label;
  errorAvailable =
    errorAvailable == false && _response["errorAvailable"] == true
      ? _response["errorAvailable"]
      : errorAvailable;
  // eitheroroptions validation - end

  // validation for variation - start
  // loop through all variation sections
  _response = validate_variation(productType);
  _return = _return ? _response["_return"] : _return;
  optionVal = optionVal ? _response["optionVal"] : optionVal;
  label = label ? _response["label"] : label;
  errorAvailable =
    errorAvailable == false && _response["errorAvailable"] == true
      ? _response["errorAvailable"]
      : errorAvailable;
  // validation for variation - end

  if (errorAvailable) {
    $(".error.add-to-cart")
      .html("Form incomplete. Please check the messages in Red.")
      .show();
  } else {
    $(".error.add-to-cart").hide();
  }

  return !errorAvailable;
}

async function CartAction(
  event,
  prodId,
  prodType,
  minLimits,
  moaAmnts,
  flatCharges,
  setupCharges,
  SetupChargeVariants,
  hopsProdId
) {
  event.preventDefault();
  event.stopPropagation();

  clearLocalStorage();
 let totalQty = 0;
 var minQty;
  $('.product-form__info-list').next('.err.base').remove();
  if(  $("#varQty").val()== 0){
    $("#varQty").focus()
    $('.product-form__info-list').after(
        "<div class='err base' style='display:block; color:red; font-size:11px;'>Please Enter the Quantity</div>"
      );
    $(".error.add-to-cart")
      .html("Please check the messages in Red.")
      .show();
      return false;
  }else{
   minQty = $($(".quantity-price-section.show").find('.block-swatch__item-text')[0]).text().split('-')[0].trim();
   if(minQty == "") minQty = $($(".block-swatch-list.pricing-swatch-list").find('.block-swatch__item-text')[0]).text().split('-')[0].trim();
   minQty = minQty.split('+')[0].trim();
    if (_isCanvasEnabled) {
      if (!$("#disclaimerCheck").prop("checked")) {
        $('#disclaimer_alert').css('display', 'block');
        return false;
      } else {
        $('#disclaimer_alert').css('display', 'none');
      }
    }
  //  if( Number($("#varQty").val()) < Number(minQty)){
  //   $("#varQty").focus()
  //   $('.product-form__info-list').after(
  //       "<div class='err base' style='display:block; color:red; font-size:11px;'>Please enter the minimum quantity: " + minQty + "</div>"
  //     );
  //     $(".error.add-to-cart")
  //     .html("Please check the messages in Red.")
  //     .show();
      
  //     return false;
  //  }else{
    //  if($("#varQty").attr('data-label')){
    //   pushableProperties["_stockCustomRider"] = true;
    // }
    // pushableProperties["_minQty"] = Number(minQty);
  //  }
  }

 hasZeroQuantity = false;
 $('.quantity-selector__value').each(function(index) {
   var inputElement = $(this)
   let variation =   inputElement.closest('.product-form__option').find(".lblVar")
   var labelElement = inputElement.closest('.product-form__option').find(".lblVar").nextAll('div');
   var inputValue = parseInt($(this).val());
   labelText = variation.text();
   labelElement.children('.err.variation').remove()
    if (inputValue === 0 || isNaN(inputValue)) {
      hasZeroQuantity = true;
      labelElement.append(
        "<div class='err variation' style='display: block; color: red; font-size: 11px!important;'>Please Enter Quantity for " + labelText + "</div>"
      );
       $(".error.add-to-cart")
      .html("Please check the messages in Red.")
      .show();
    }
    totalQty += inputValue;
  //     else if( inputValue < pushableProperties["_minQty"]){
  //      hasZeroQuantity = true;
  //       labelElement.append(
  // "<div class='err variation' style='display: block; color: red; font-size: 11px!important;'>Please Enter the "
  // + pushableProperties["_minQty"] +
  // " Minimum Quantity for: " + labelText + "</div>"
  //       );
  //       $(".error.add-to-cart")
  //       .html("Please check the messages in Red.")
  //       .show();
  //      }
  });
  if(totalQty < Number(minQty)){
   // $("#varQty").focus()
    // $('.product-form__info-list').after(
    //     "<div class='err base' style='display:block; color:red; font-size:11px;'>Please enter the minimum quantity: " + minQty + "</div>"
    //   );
      $(".error.add-to-cart")
      .html("Please enter the minimum quantity: " + minQty + "")
      .show();
      
      return false;
   }
   else{
    if($("#varQty").attr('data-label')){
      pushableProperties["_stockCustomRider"] = true;
    }
    pushableProperties["_minQty"] = Number(minQty);
   }
  

  if (hasZeroQuantity) {
    return false
  }else{
        $(".error.add-to-cart").hide();
  }

  const _return = validate_form();
  if (!_return) return false;
  const _returndesign_alert = validate_design();
  if (!_returndesign_alert) return false;
  validateprintOnBackLines(true);
  $(".fa-spin").show();
  console.time("time")

if(_isCanvasEnabled){
  document.getElementById("cart-page").style.display = "block";

}
else{
  document.getElementById("loaderbg").style.display = "block";
}

  let cartLineItemAvailable = checkOrderLineItemAvailable1();
  if (_isCanvasEnabled) {
    await download()
  }
  if (cartLineItemAvailable == false) {
    cartCheck_addtoCart(
      prodId,
      prodType,
      minLimits,
      moaAmnts,
      flatCharges,
      hopsProdId
    );
  } else {
    removeExistingItemOnEdit(cartLineItemAvailable);
  }

  // pushableProperties = {};
  // flatChargeOptions = [];
  // addCartItems = [];
  // finalCartItems = [];
  // CartChargeItems = [];
  // flatChargeItems =[];
  // prodQty = 0;
}

function removeExistingItemOnEdit(cartLineItemAvailable) {
  $.get("/cart.js").done((_cartData) => {
    let cartData = JSON.parse(_cartData);

    if (_cartData.length > 0) {
      let hopsId = getHopsId_ExistingItemOnEdit(
        cartData,
        cartLineItemAvailable
      );

      let remLineItems = getremLineItems_ExistingItemOnEdit(cartData, hopsId);

      if (Object.keys(remLineItems).length > 0) {
        jQuery
          .post("/cart/update.js", { updates: remLineItems })
          .done(function () {
            cartCheck_addtoCart(
              prodId,
              prodType,
              minLimits,
              moaAmnts,
              flatCharges,
              hopsProdId
            );
          });
      }
    }
  });
}
function getremLineItems_ExistingItemOnEdit(cartData, hopsId) {
  let remLines = {};
  $(cartData.items).each((index, lineItem) => {
    if (lineItem.properties["_hopsUId"]) {
      if (hopsId == lineItem.properties["_hopsUId"]) {
        remLines[lineItem.key] = 0;
      }
    }
  });
  return remLines;
}

function getHopsId_ExistingItemOnEdit(cartItems, cartLineItemAvailable) {
  let hopsId = "";
  $(cartItems.items).each((index, lineItem) => {
    if (lineItem.key == cartLineItemAvailable) {
      hopsId = lineItem.properties["_hopsUId"];
      return;
    }
  });
  return hopsId;
}

function ReBindingAutoComplete() {
  let keyValue = {};
  $(".autocomplete").each((index, element) => {
   // keyValue.push($(element).data("key") + '~' + $(element).selectize()[0].selectize.getValue());
    keyValue[$(element).data("key")] = $(element).selectize()[0].selectize.getValue();
     $(element).selectize()[0].selectize.destroy(); 
   clearChoosenValue($(element).parent().next('div').find('a')[0]) 
  });
  BindingAutoComplete();
  $(".autocomplete").each((index, element) => {

    const ac_key = $(element).data("key");  
    const _object = $(element)[0].selectize;    
    if(ac_key != undefined)    _object.setValue(keyValue[ac_key], false);
    
  });
  
}

function BindingAutoComplete() {

  let choosenItemName = "";
 // 
  $(".autocomplete").each((index, element) => {
    const ac_key = $(element).data("key");
    let originalOptions = ac[ac_key]; 
     ac[ac_key] = originalOptions.filter(
      opt => !removedPC_dropdown.includes(opt.id)
    );
    $(element).selectize({
      sortField: "text",
      maxItems: 1,
      valueField: "id",
      labelField: "name",
      searchField: ["name", "id", "additionalCharge"],
      options: ac[ac_key],
      create: false,
      
      render: {
        option: (item, escape) => {
                 
          var valAdd =
            item.additionalCharge != 0 && item.additionalCharge != ""
              ? item.additionalCharge
              : "";
          var valChargeType = item.chargeType;
          if (valChargeType != "Amount") {
            if (
              valAdd != "0" &&
              valAdd != "" &&
              $("#streamer-size").val() != undefined
            ) {
             
              var charges = charge_code[valAdd];
              var strsize = $("#streamer-size").val().toString();
              var str_val = charges[strsize];
              valAdd = " - Add: $" + str_val;
            } else {
              valAdd = "";
            }
          } else {
            if (valAdd == "0" || valAdd == "") {
              valAdd = "";
            } else {
              valAdd = " - Add: $" + valAdd;
            }
          }
          const _name = item.name
            ? '<span class="name">' + escape(item.name) + "</span>"
            : "";
          // const _email = (item.email)?('<span class="price">' + escape(item.additionCharge) + '</span>'):("");
          const _spacer = "<span style='flex: 1 1 auto;'></span>";
          const _image = item.image
            ? '<img style="height: 20px;" src="' + item.image + '" />'
            : "";
          return (
            "<div style='display: flex;' >" +
            _name +
            _spacer +
            valAdd +
            _spacer +
            _image +
            "</div>"
          );
        },
        item: (item, escape) => {
          var valAdd =
            item.additionalCharge != 0 && item.additionalCharge != ""
              ? item.additionalCharge
              : "";
          var valChargeType = item.chargeType;
          if (valChargeType != "Amount") {
            if (
              valAdd != "0" &&
              valAdd != "" &&
              $("#streamer-size").val() != undefined
            ) {
              var charges = charge_code[valAdd];
              var strsize = $("#streamer-size").val().toString();
              var str_val = charges[strsize];
              valAdd = " - Add: $" + str_val;
            } else {
              valAdd = "";
            }
          } else {
            if (valAdd == "0" || valAdd == "") {
              valAdd = "";
            } else {
              valAdd = " - Add: $" + valAdd;
            }
          }
          const _name = item.name
            ? '<span class="name">' + escape(item.name) + "</span>"
            : "";
          const _spacer = "<span style='flex: 1 1 auto;'></span>";
          choosenItemName = item.name + " " + valAdd;
          return (
            "<div style='display: flex;' >" +
            _name +
            _spacer +
            valAdd +
            _spacer +
            "</div>"
          );
        },
      },
      onChange: (value) => {
        
        const chosenObject = getChosenValue(ac[ac_key], value, ac_key);
        displayChosenValue(chosenObject, value, ac_key, choosenItemName);
        checkDependentValues(chosenObject);
        if($($(element)[0]).data('value') == "retainOptionsVariant" && !$(element).eq(0).attr('data-printOnBack')){
          $("#variation ul").each((_index, _element) => {
                          $(_element)
                            .find("li .autocomplete")
                            .each((index, element) => {
                              console.log(element);
                              const ac_key = $(element).data("key")
                              const _object = $(element)[0].selectize;
                              if($($(element)[0]).data('value')== "Variant"){
                              let a_key = localStorage.getItem('retainVariant')
                              let index = ac[ac_key].map(e => e.id).indexOf(a_key);
                              _object.setValue(ac[ac_key][index]["id"], false);
                              }
                          })
                        }) 
        }
      },
    });

    const _object = $(element)[0].selectize;
    if (ac[ac_key][0]["sequence"] == 0) {
      _object.setValue(ac[ac_key][0]["id"], false);
    }
  });
}

function BindingAutoComplete_Variations(vCount) {
  let choosenItemName = "";
  $("#variation ul").each((_index, _element) => {
    $(_element)
      .find("li .autocomplete")
      .each((index, element) => {
        const ac_key = $(element).data("key");
        if (ac_key != undefined) {
          let options_variation = ac[ac_key]; 
          ac[ac_key] = options_variation.filter(
          opt => !removedPC_dropdown.includes(opt.id)
          );
          $(element).selectize({
            sortField: "text",
            maxItems: 1,
            valueField: "id",
            labelField: "name",
            searchField: ["name", "id", "additionalCharge"],
            options: JSON.parse(JSON.stringify(ac[ac_key])),
            create: false,
            render: {
              option: (item, escape) => {
                var valAdd =
                  item.additionalCharge != 0 && item.additionalCharge != ""
                    ? item.additionalCharge
                    : "";
                var valChargeType = item.chargeType;
                if (valChargeType != "Amount") {
                  if (
                    valAdd != "0" &&
                    valAdd != "" &&
                    $("#streamer-size").val() != undefined
                  ) {
                    var charges = charge_code[valAdd];
                    var strsize = $("#streamer-size").val().toString();
                    var str_val = charges[strsize];
                    valAdd = " - Add: $" + str_val;
                  } else {
                    valAdd = "";
                  }
                } else {
                  if (valAdd == "0" || valAdd == "") {
                    valAdd = "";
                  } else {
                    valAdd = " - Add: $" + valAdd;
                  }
                }
                const _name = item.name
                  ? '<span class="name">' + escape(item.name) + "</span>"
                  : "";
                // const _email = (item.email)?('<span class="price">' + escape(item.additionCharge) + '</span>'):("");
                const _spacer = "<span style='flex: 1 1 auto;'></span>";
                const _image = item.image
                  ? '<img style="height: 20px;" src="' + item.image + '" />'
                  : "";
                return (
                  "<div style='display: flex;' >" +
                  _name +
                  valAdd +
                  _spacer +
                  _image +
                  "</div>"
                );
              },
              item: (item, escape) => {
                var valAdd =
                  item.additionalCharge != 0 && item.additionalCharge != ""
                    ? item.additionalCharge
                    : "";
                var valChargeType = item.chargeType;
                if (valChargeType != "Amount") {
                  if (
                    valAdd != "0" &&
                    valAdd != "" &&
                    $("#streamer-size").val() != undefined
                  ) {
                    var charges = charge_code[valAdd];
                    var strsize = $("#streamer-size").val().toString();
                    var str_val = charges[strsize];
                    valAdd = " - Add: $" + str_val;
                  } else {
                    valAdd = "";
                  }
                } else {
                  if (valAdd == "0" || valAdd == "") {
                    valAdd = "";
                  } else {
                    valAdd = " - Add: $" + valAdd;
                  }
                }
                const _name = item.name
                  ? '<span class="name">' + escape(item.name) + "</span>"
                  : "";
                const _spacer = "<span style='flex: 1 1 auto;'></span>";
                choosenItemName = item.name + " " + valAdd;
                return (
                  "<div style='display: flex;' >" +
                  _name +
                  _spacer +
                  valAdd +
                  _spacer +
                  "</div>"
                );
              },
            },
            onChange: (value) => {
              const chosenObject = getChosenValue(ac[ac_key], value, ac_key);
              displayChosenValue(chosenObject, value, ac_key, choosenItemName);
              checkDependentValues(chosenObject);
            },
          });

          if ($(element)[0] != undefined) {
            const _object = $(element)[0].selectize;
            if (ac[ac_key] != undefined) {
              if (ac[ac_key][0]["sequence"] == 0) {
                if(vCount == $($(element)[0]).data('key').toString().split('_').pop().slice(1))
                      _object.setValue(ac[ac_key][0]["id"], false);
              }
            }
          }
          if($($(element)[0]).data('value')== "Variant"){
            const _object = $(element)[0].selectize;
            if(vCount == $($(element)[0]).data('key').toString().split('_').pop().slice(1)){
                let a_key = localStorage.getItem('retainVariant')
                let index = ac[ac_key].map(e => e.id).indexOf(a_key);
                console.log(ac[ac_key].map(e => e.id).indexOf(a_key));
                _object.setValue(ac[ac_key][index]["id"], false);
              }
          }
        }
      });
  });
}

$(document).ready(() => {
              console.log('clicked')        
if(issBo == false){
  BindingAutoComplete();
}
  
});

function getAdditionalPrice(element, data_type, _key) {
  let additionalCharges = 0;
  if (data_type == "dependent-popup") {
    const chosen_id = $(element).find(".pop-chosen-value input").val();
    const key_id = $(element).find(".pop-chosen-value input").val();
    const dependent_id = $(element).find(".pop-chosen-value.show input").val();
    const dependent_key = $(element)
      .find(".pop-chosen-value.show input")
      .attr("data-key");
    const data_charge = $(element)
      .find(".pop-chosen-value.show input")
      .data("charge");
    const depend_charge = $(element)
      .find(".pop-chosen-value.show input")
      .data("charge");
    if (!isNaN(Number(data_charge))) additionalCharges += Number(data_charge);
    if (!isNaN(Number(depend_charge)))
      additionalCharges += Number(depend_charge);
  } else if (data_type == "dependent-select") {
    const chosen_id = $(element).find("select").val();
    const key_id = $(element).find("select").attr("data-key");
    const dependent_id = $(element).find(".dependent-values select").val();
    const dependent_key = $(element)
      .find(".dependent-values select")
      .attr("data-key");
    const data_charge = $(element).find("select").val();
    const depend_charge = $(element)
      .find(".dependent-values select")
      .data("charge");
    if (!isNaN(Number(data_charge))) additionalCharges += Number(data_charge);
    if (!isNaN(Number(depend_charge)))
      additionalCharges += Number(depend_charge);
  } else if (data_type == "input-file") {
    const chosen_id = $(element).find("input").val();
    const key_id = $(element).find("input").attr("data-key");
    const data_charge = $(element).find("input").data("charge");
    if (!isNaN(Number(data_charge))) additionalCharges += Number(data_charge);
  } else if (data_type == "input-text") {
    const chosen_id = $(element).find("input").val();
    const key_id = $(element).find("input").attr("data-key");
    const data_charge = $(element).find("input").data("charge");
    if (!isNaN(Number(data_charge))) additionalCharges += Number(data_charge);
  } else if (data_type == "popup") {
    const chosen_id = $(element).find(".pop-chosen-value.show input").val();
    const key_id = $(element)
      .find(".pop-chosen-value.show input")
      .attr("data-key");
    const data_charge = $(element)
      .find(".pop-chosen-value.show input")
      .data("charge");
    if (!isNaN(Number(data_charge))) additionalCharges += Number(data_charge);
  } else if (data_type == "select") {
    const chosen_id = $(element).find("select").val();
    const key_id = $(element).find("select").attr("data-key");
    const data_charge = $(element).find("select").data("charge");
    if (!isNaN(Number(data_charge))) additionalCharges += Number(data_charge);
  }
  return additionalCharges;
}

// function getACVariant(
//   acAmnt,
//   ac,
//   hopsProdId,
//   baseVarQty,
//   prodType,
//   hUId,
//   hVId
// ) {
//   let acDec = (Math.round(ac * 100) / 100).toFixed(2);
//   let acId = acAmnt[acDec];

  // prodQty += Number(baseVarQty);

//   var Item = {
//     quantity: baseVarQty,
//     id: acId,
//     properties: {
//       AC: ac,
//       _hopsId: hopsProdId,
//       _hopsUId: hUId,
//       _hopsVId: hVId,
//       _prodType: prodType,
//       _legacy_product_as_fee_title: "Additional Charge",
//       _legacy_product_as_fee_description: "Additional Charge Description",
//     },
//   };

//   finalCartItems.push(Item);
// }

$(document).ready(() => {
  $(".product-form__add-button[data-action=add-to-cart]").click((event) => {
    event.stopPropagation();
    event.preventDefault();
    glideThoughFormElements();
    $(".product-form").submit();
  });
});

$(document).on("click", "#yourZoom_uploader button", function (event) {
  $("#yourZoom_uploader").find(".uploader-preview").show();
  $("#yourZoom_uploader input").val(
    $("#yourZoom_uploader").attr("data-uploader-ref")
  );
  var element = $(this);
  console.log("element", element);
  $("#enterUploadfile").val("");
  if (element.closest("li").find(".or_clause_text")[0] != undefined) {
    if (element.closest("li").find(".pop-chosen-value.show")[0] != undefined) {
      let ele = element.closest("li").find(".pop-chosen-value.show")[0];
      let eleInput = $(ele).find("input")[0];
      $(ele).removeClass("show");
      $(eleInput).val("");
    }
  }
});

$(document).on("click", "#yourZoom_centerUploader button", function (event) {
  $(".dependent-values.show #yourZoom_centerUploader").find(".uploader-preview").show();
  $(".dependent-values.show #yourZoom_centerUploader input").val(
    $(".dependent-values.show #yourZoom_centerUploader").attr("data-uploader-ref")
  );
  var element = $(this);

  $(".dependent-values.show #enterCenterUploadfile").val("");
  if (element.closest("li").find(".or_clause_text")[0] != undefined) {
    
    if (
      element
        .closest("li")
        .find("#dependent-values-container .pop-chosen-value.show")[0] !=
      undefined
    ) {
      
      let ele = element
        .closest("li")
        .find("#dependent-values-container .pop-chosen-value.show")[0];
      let eleInput = $(ele).find("input")[0];
      $(ele).removeClass("show");
      $(eleInput).val("");
    }
  }
});

function clearuploadedValue() {
  _designAlert=''; 
  var imgUrl = $("  #yourZoom_uploader .uploader-preview img:first").attr("src");
  var extension = imgUrl.split(/[#?]/)[0].split('.').pop().trim();
  extension = 0+extension;
  let preview =_previwIcon[extension];
  _designSrc = $("  #yourZoom_uploader .uploader-preview img:first").attr("src");
  if(preview){
    _designSrc = preview;
  }
  if (_isCanvasEnabled) {
  $('.new_custom').css('display','block');
  $('.custom_ui').css('display', 'none');
  $('.eitheror-group').find('.pop-chosen-value.show').removeClass('show');
  $('.slider-container.eitherorSeq_option').css('display', 'none');
  $('.showtoggle').css('display','none');
  }
  removeclick()
}

function clearCenterUploadedValue() {
  $(".dependent-values.show #yourZoom_centerUploader input").val("");
  $(".dependent-values.show #yourZoom_centerUploader").hide();
  $(".dependent-values.show #uploadclick").val("Upload Your Design");
}

function clearChoosenValue(_this) {
  if($(_this).siblings().data('popup')){
  if($(_this).siblings().data('popup').includes("seq_stock")){
  _designAlert = _this;
  _designSrc = $(_this).siblings('img').attr('src');
     removeclick();
  }
  if (_isCanvasEnabled) {
      var id = $(_this).parent().attr('data-option-id')
      $('input[name=' + id + '][onchange="canvasColorization(this)"]').trigger('change', 'input');
      $('.showtoggle').css('display','none');

    }
}
 else{
  const optionId = $(_this).parent().data("optionId");
  let control = $("#" + optionId + "_dn");
  if (control[0] == undefined) control = $("#" + optionId + "_id");
  $(_this).siblings('img').attr('src', '');
  if (control[0] != undefined) {
    control = control[0].selectize;
    if (control) control.clear();
  }

  $(_this).siblings().val("");
  $(_this).closest('.dependent-values.show').find('.btn_stockValue').val("Select a Stock Design");
  $(_this).parent().removeClass("show");
}
}
function variantUpdateAgainstQty(lineKey, dataItems, lineNo, qty) {
 
let item_key = dataItems.filter(function (v) {
  return v.key == lineKey;
});
item_key = item_key[0];

  let NonHiddenItems = 0;
  let prodQty = qty;
  let remprodQty = qty;
  let prodUId = item_key.properties["_hopsUId"];
  let prodhId = item_key.properties["_hopsId"];
  let prodVId = item_key.properties["_hopsVId"];

  let flatValues = "";
  let removeflatValues = "";
  let lineflatValues = "";

  if (
    item_key.properties["_design"] &&
    item_key.properties["_chargeType"] != "logo"
  ) {
    lineflatValues = item_key.properties["_design"];
  }

  for (item in dataItems) {
    if (dataItems[item].product_type != "HiddenCharges") {
      NonHiddenItems = NonHiddenItems + 1;

      if (lineflatValues != "" && dataItems[item].key != lineKey  && qty == 0 && !dataItems[item].properties["Variation"]) {
        if (dataItems[item].properties["_design"]) {
          let flatValArray = dataItems[item].properties["_design"].split(",");
          for (fv in flatValArray) {
            if (flatValues == "") {
              flatValues = flatValArray[fv];
              continue;
            } else {
              let Values = flatValues.split(",")
                if (!Values.includes(flatValArray[fv])) {
                  flatValues = flatValues + "," + flatValArray[fv];
                }
            }
          }
        }
      }
    }

    if (
      dataItems[item].product_type != "HiddenCharges" &&
      dataItems[item].key != lineKey &&
      dataItems[item].properties["_hopsUId"] == prodUId 
     
    ) {
      prodQty += dataItems[item].quantity;
     
      if( item_key.properties["Variation"])
     remprodQty += dataItems[item].quantity;
      
    }
    

  }

  if (qty == 0 && NonHiddenItems <= 1) {
    $.ajax({
      type: "POST",
      url: "/cart/clear.js",
      success: function () {
        clearLocalStorage();
        $.ajax({
          type: "GET",
          url: '/cart.js',
          dataType: 'json',
          success: function(resp) { 
              var nullHash = {};
              for ([key, value] of Object.entries(resp.attributes)) {    
                  nullHash[key] = null;
              }
              $.ajax({
                  type: "POST",
                  url: '/cart/update.js',
                  data: {attributes:nullHash},
                  dataType: 'json'
              });
          }
      });
        sessionStorage.setItem("isKlaviyo", "true");
        window.location.href = "/cart";

        return;
      },
      dataType: "json",
    });
  } else {
    // if (prodQty == 0) {
    //   return removeLineItem_NoProd(dataItems, prodhId, lineNo, prodUId);
    // }
   
    

    if (flatValues != "" && lineflatValues != "" && qty == 0) {
      let remflatValArray = lineflatValues.split(",");
      let flatValueArray = flatValues.split(",");

      for (f in remflatValArray) {
        if (!flatValueArray.includes(remflatValArray[f])) {
          if (removeflatValues == "") {
            removeflatValues = remflatValArray[f];
          } else {
            removeflatValues = removeflatValues + "," + remflatValArray[f];
          }
        }
      }
    }
    if (flatValues == "" && removeflatValues == "") {
      removeflatValues = lineflatValues;
    }
   // if(flatValues == lineflatValues)  removeflatValues = lineflatValues;
 
    if (remprodQty == 0) {
      //return IncDecRemove(dataItems, item_key, qty, removeflatValues);
      return removeLineItem_NoProd(dataItems, prodhId, item_key, prodUId,qty,removeflatValues);
    }

    let qtyRange = item_key.properties["_qtyRange"];

    let minRange = qtyRange.split("-")[0].trim();
    let maxRange = qtyRange.split("-")[1].trim();

    if (prodQty >= minRange && prodQty <= maxRange) {
      IncDecRemove(dataItems, item_key, qty, removeflatValues);
    } else {
      let prodHandle = item_key.handle;
      let varStrSize = item_key.variant_title.split("/")[0].trim();
      let isStreamer = false;
      if (item_key.variant_title.split("/")[1]) isStreamer = true;
      let varOldId = item_key.key;

      let prodUrl = "/products/" + prodHandle;

      jQuery.getJSON(prodUrl, function (product) {
        var strVariants;
        if (isStreamer) {
          strVariants = product.product.variants.filter(function (v) {
            return v.title.includes(varStrSize);
          });
        } else {
          strVariants = product.product.variants;
        }

        let variId = 0;
        let variQtyRange = "";
        var outOfRangeQty = "";
        var outOfRangPrd = 0;

        for (vari in strVariants) {
          if (isStreamer) {
            variQtyRange = strVariants[vari].title.split("/")[1].trim();
            outOfRangeQty = variQtyRange;
          } else {
            variQtyRange = strVariants[vari].title.trim();
            outOfRangeQty = variQtyRange;
          }
          let vari_minRange = Number(variQtyRange.split("-")[0].trim());
          let vari_maxRange = Number(variQtyRange.split("-")[1].trim());
          outOfRangPrd = strVariants[vari].id;
          if (
            Number(prodQty) >= vari_minRange &&
            Number(prodQty) <= vari_maxRange
          ) {
            variId = strVariants[vari].id;
            break;
          }
        }
        if(variId == 0 && outOfRangPrd > 0) 
        {
          variId = outOfRangPrd;
          variQtyRange = outOfRangeQty;

        }

        if (variId == 0 || variId.toString() == varOldId.split(':')[0].toString()){
          IncDecRemove(dataItems, item_key, qty, removeflatValues);
          return;
        }  
        let updatingCartItems = [];
        let updateChargeItems = {};

        let sameItems = dataItems.filter(function (v) {
          return v.properties["_hopsUId"] == prodUId &&  v.product_type != "HiddenCharges";
        });

        for (sitem in sameItems) {
          let variQty = sameItems[sitem].quantity;
          if (sameItems[sitem].key == lineKey) {
            variQty = qty;
          }

                    
            let props = sameItems[sitem].properties;
            props["_qtyRange"] = variQtyRange;

            if(props["_baseAc"]){

              props["_totalAc"] = Number(props["_baseAc"]) * variQty.toFixed(2);
              
              props["Total Additional Charge"] =
                "$" + props["_totalAc"].toFixed(2).toString();
            }
           
            var Item = {
              quantity: variQty,
              id: variId,
              properties: props,
            };

            updatingCartItems.push(Item);
            updateChargeItems[sameItems[sitem].key] = 0;

        }


        for (item in dataItems) {         

          // if (
          //   dataItems[item].product_type == "HiddenCharges" &&
          //   dataItems[item].title.includes("Additional Charges") &&
          //   dataItems[item].properties["_hopsVId"] == prodVId &&
          //   dataItems[item].properties["_hopsUId"] == prodUId
          // ) {
          //   updateChargeItems[dataItems[item].key] = qty;
          // }

          if (
            dataItems[item].product_type == "HiddenCharges" &&
            dataItems[item].title.includes("Setup Charges") &&
            dataItems[item].properties["_hopsUId"] == prodUId
            //dataItems[item].properties["_hopsId"] == prodhId
          ) {
            updateChargeItems[dataItems[item].key] = 0;
          }
        }

        if (item_key.properties["_productSubType"]) {
          let prodSubType = item_key.properties["_productSubType"];
          let prodType = item_key.properties["_prodType"];
          setupChargeCartUpdate(
            prodhId,
            prodUId,
            prodQty,
            updatingCartItems,
            prodSubType,
            prodType
          );
        }

        var addCart = { items: updatingCartItems };

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
            jQuery
              .post("/cart/update.js", { updates: updateChargeItems })
              .done(function () {
                // jQuery
                //   .post("/cart/change.js", { quantity: 0, id: varOldId })
                //   .done(function () {
                    updateCartFlatCharges(
                      dataItems,
                      removeflatValues,
                      qty,
                      item_key.properties["_prodType"],
                      minLimits,
                      moaAmnts,
                      item_key
                    );
                  //});
              });
          })
          .catch((err) => {
            /* uh oh, we have error. */
            console.error(err);
          });
      });
    }
  }
}

function setupChargeCartUpdate(
  hopsProdId,
  hopsProdUId,
  SetupQuantity,
  updateCartArray,
  productSubType,
  prodType
) {
  let pSupType = "00" + productSubType;
  let setupChargeValues = setupCharges[pSupType];
  if (setupChargeValues == undefined) return false;
  let setupLimit = Number(setupChargeValues.split(",")[0]);

  if (SetupQuantity < setupLimit) {
    let setupValueId = setupChargeValues.split(",")[1];
    let prId = SetupChargeVariants[setupValueId];

    let props = {};
    props["ChargeType"] = "Setup Charge";
    props["_SetupCharge"] = setupValueId;
    props["_hopsId"] = hopsProdId;
    props["_hopsUId"] = hopsProdUId;
    props["_prodType"] = prodType;
    props["_legacy_product_as_fee_title"] = "Setup Charges";
    props["_legacy_product_as_fee_description"] = "Setup Charges";
    // props["hopsId"] = hopsProdId;

    var item = {
      quantity: 1,
      id: prId,
      properties: props,
    };
    updateCartArray.push(item);
  }
}

function updateCartFlatCharges(
  dataItems,
  removeflatValues,
  qty,
  prodType,
  minLimits,
  moaAmnts,
  item_key
) {


    let flatId = "";
    if (qty == 0 && removeflatValues != "") {
      let props = {};
      
      let newFlatQty = 0;
      let newFlatDesigns = "";
      // let chargeType = item_key.properties["_chargeType"];
      // if(chargeType == "logo")  chargeType = "Logo Charge";
      // if(chargeType == "die")  chargeType = "Die Charge";
      for (item in dataItems) {
        if (
          dataItems[item].product_type == "HiddenCharges" &&
          dataItems[item].title.includes("Flat Charges") 
          &&  dataItems[item].properties["ChargeType"] == "Die Charge"
        ) {
          flatId = dataItems[item].key;
  
          props = dataItems[item].properties;
          let remFlatArr = removeflatValues.split(",");
          let propFlatArr = dataItems[item].properties["_design"].split(",");
          for (pf in propFlatArr) {
            if (!remFlatArr.includes(propFlatArr[pf])) {
              newFlatQty += 1;
              if (newFlatDesigns == "") {
                newFlatDesigns = propFlatArr[pf];
              } else {
                newFlatDesigns = newFlatDesigns + "," + propFlatArr[pf];
              }
            }
          }
        }
      }
  
      if (flatId !="") {
        props["Design"] = newFlatDesigns;
        props["_design"] = newFlatDesigns;
        props["designQty"] = newFlatQty.toString();
  
        jQuery
          .post("/cart/change.js", {
            quantity: newFlatQty,
            id: flatId,
            properties: props,
          })
          .done(function () {
            // calculatePremiumProcessing();
            CartMOA(minLimits, moaAmnts);
          });
      } else {
        // calculatePremiumProcessing();
        CartMOA(minLimits, moaAmnts);
      }
      } 
    else {
      let logoQty = !(PromotionProductsCart || []).includes((item_key.product_id))
      ? qty 
      : 0;
      if(item_key.properties["_chargeType"] == "logo"){
      // let logo = false;
      for (item in dataItems) {
        if (dataItems[item].product_type != "HiddenCharges") {
          if (
              dataItems[item].properties["_chargeType"] == "logo" &&
              dataItems[item].key != item_key.key &&  !(PromotionProductsCart || []).includes(dataItems[item].product_id)
            
            ){
              
            logoQty += dataItems[item].quantity;
            // logo = true;
          }
        }
        if (
          dataItems[item].product_type == "HiddenCharges" &&
          dataItems[item].properties["ChargeType"]
        ) {
          if(dataItems[item].properties["ChargeType"].toLowerCase().includes("logo")){
            flatId = dataItems[item].key;
            props = dataItems[item].properties;
          }
          
        }
    }
  }
     if(item_key.properties["_chargeType"] == "logo" && flatId == "" && logoQty>0 && !(PromotionProductsCart || []).includes(item_key.product_id)){
      const match = Object.keys(item_key.properties).find((i) => {
        if (!i.includes("_")) return false;
        const code = i.split("_")[1];
        return (
          flatCharges[code]
        );
      });
      const charge = match ? match.split("_")[1]: null;
         const value =
  item_key.properties[`_${charge.toUpperCase()}_enterUploadfile`] ??
  item_key.properties[`_${charge.toUpperCase()}_uploadImage`] ??
  item_key.properties[`_${charge.toUpperCase()}`];

      const designCode = value?.split("~")[0];

      let props = {};
      props["ChargeType"] = flatCharges[charge].displayName;
      props["_" + flatCharges[charge].optionId] = flatCharges[charge].valueId;
      props["Design"] = designCode;
      props["_design"] = designCode;
      props["option"] = flatCharges[charge].optionId;
      props["designQty"] = item_key.quantity.toString();
      props["_legacy_product_as_fee_title"] = "Logo Charges";
      props["_legacy_product_as_fee_description"] = "Logo Charges";
      jQuery
      .post("/cart/add.js", {
        items: [
          {
            quantity: logoQty,
            id: flatCharges[charge].variant,
            properties: props,
          },
        ],
      })  .done(function () {
        // calculatePremiumProcessing();
        CartMOA(minLimits, moaAmnts);
      });
    }else if ( flatId!="") {
        jQuery
          .post("/cart/change.js", {
            quantity: logoQty,
            id: flatId,
            properties: props,
          })
          .done(function () {
            // calculatePremiumProcessing();
            CartMOA(minLimits, moaAmnts);
          });
      } else {
        // calculatePremiumProcessing();
        CartMOA(minLimits, moaAmnts);
      }
    }

}

async function IncDecRemove(dataItems, item_key, qty, removeflatValues) {
   if (item_key.properties["_productSubType"]) {
    let setupLimit = 0;
    let pSupType = "00" + item_key.properties["_productSubType"];
    let setupChargeValues = setupCharges[pSupType];

    if (setupChargeValues != undefined) {
      setupLimit = Number(setupChargeValues.split(",")[0]);
      let updateSetupcharge = {};
      let quantity = 0;
      dataItems.forEach((i) => {
        if (
          i.product_type != "HiddenCharges" &&
          i.key != item_key.key &&
          i.properties["_hopsUId"] == item_key.properties["_hopsUId"]
        ) {
          quantity += i.quantity;
        }
      });
      quantity += qty;
      for (item in dataItems) {
        if (
          dataItems[item].product_type == "HiddenCharges" &&
          dataItems[item].title.includes("Setup Charges") &&
          dataItems[item].properties["_hopsUId"] ==
            item_key.properties["_hopsUId"]
        ) {
          updateSetupcharge[dataItems[item].key] = 0;
          break;
        }
      }
      await jQuery.post("/cart/update.js", { updates: updateSetupcharge });
      if (quantity < setupLimit) {
        let setupItem = [];
        setupChargeCartUpdate(
          item_key.properties["_hopsId"],
          item_key.properties["_hopsUId"],
          quantity,
          setupItem,
          item_key.properties["_productSubType"],
          item_key.properties["_prodType"]
        );
        var addCart = { items: setupItem };

        let response = await fetch("/cart/add.js", {
          body: JSON.stringify(addCart),
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "xmlhttprequest",
          },
          method: "POST",
        }).then((response) => {
          return response.json();
        });
      }
    }
  } 
  
  if (item_key.properties["_baseAc"]) {
    let lineAdd = item_key.properties["_baseAc"];

    item_key.properties["Total Additional Charge"] =
      "$" + (Math.round(lineAdd * qty * 100) / 100).toFixed(2).toString();
      item_key.properties["_totalAc"] = (
      Math.round(lineAdd * qty * 100) / 100
    )
      .toFixed(2)
      .toString();

    jQuery
      .post("/cart/change.js", {
        quantity: qty,
        id: item_key.key,
        properties: item_key.properties,
      })
      .done(function () {
        // let uId = item_key.properties["_hopsUId"];
        // let vId = item_key.properties["_hopsVId"];
        // let lineAc = "";
        // for (item in dataItems) {
        //   if (dataItems[item].title.includes("Additional Charges")) {
        //     if (
        //       uId == dataItems[item].properties["_hopsUId"] &&
        //       vId == dataItems[item].properties["_hopsVId"]
        //     ) {
        //       lineAc = dataItems[item].key;
        //       break;
        //     }
        //   }
        // }

        // if (lineAc != "") {
        //   jQuery
        //     .post("/cart/change.js", { quantity: qty, id: lineAc })
        //     .done(function () {
        //       updateCartFlatCharges(
        //         dataItems,
        //         removeflatValues,
        //         qty,
        //         item_key.properties["_prodType"],
        //         minLimits,
        //         moaAmnts,
        //         item_key
        //       );
        //     });
        // } else {
              updateCartFlatCharges(
                dataItems,
                removeflatValues,
                qty,
                item_key.properties["_prodType"],
                minLimits,
                moaAmnts,
                item_key
              );
        // }
      });
  } else {
    jQuery
      .post("/cart/change.js", { quantity: qty, id: item_key.key })
      .done(function () {
        updateCartFlatCharges(
          dataItems,
          removeflatValues,
          qty,
          item_key.properties["_prodType"],
          minLimits,
          moaAmnts,
          item_key
        );
        //  window.location.href = "/cart";
      });
  }
}

function LineItemIncDec(linekey,lineNo, qty) {
  document.getElementById("loaderbg").style.display = "block";
  var cartContents = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      variantUpdateAgainstQty(linekey,data.items, lineNo, qty);
    });
}

function minusLineItem(linekey,lineNo) {
  let qty = Number($("#lineQty" + lineNo).val());
  if (qty > 1) {
    LineItemIncDec(linekey,lineNo, qty - 1);
  }
}

function plusLineItem(linekey,lineNo) {
  let qty = Number($("#lineQty" + lineNo).val()) + 1;
  LineItemIncDec(linekey,lineNo, qty);
}

// function removeLineItem(linekey,lineNo) {
//   LineItemIncDec(linekey,lineNo, 0);
// }
function removeLineItem(linekey,lineNo) {

  //alert('test');

  document.getElementById("myFormcartremove").style.display = "block";

 

  document.querySelector('.close_pop_cart').onclick = function(e) {

    document.getElementById("myFormcartremove").style.display = "none";

  }

 

 

  document.querySelector('.pop_ok').onclick = function(e) {
    document.getElementById("myFormcartremove").style.display = "none";
    LineItemIncDec(linekey,lineNo, 0);

  }

}

function inputLineItem(linekey,lineNo, _this, event) {
  event.preventDefault();
  event.stopPropagation();
  let totalQty = 0;
  fetch("/cart.js")
  .then((response) => response.json())
  .then((data) => {
    data.items.forEach((item) => {
      if (
        item.properties &&
        item.properties["_hopsUId"] === _this.dataset.hopsuid &&
        item.product_type &&
        item.product_type !== "HiddenCharges" &&
        item.key != linekey
      ) {
        totalQty += item.quantity;
      }
    });
  totalQty += Number(_this.value);
  if(totalQty < Number(_this.min))
  {
    alert("Minimum Quantity for this product is " + _this.min)
    _this.value = _this.min
   
  }
  LineItemIncDec(linekey,lineNo, Number(_this.value));
});
}

// keyup validation for text length
function validate_inputtext_ontype(index, element) { 
  if ($(element).data("type") == "input-text") {   
    $(element)
      .find("input").keypress((event) => {
       // alert('keypress');
        let optionId = $(element).data("optionId");
        optionVal = $(element).find("input").val();
        let lengthAllowed = $(element).find("input").data("optionDisplay");    
        if (!lengthAllowed) return;
        if (
          !isNaN(Number(lengthAllowed)) &&
          Number(lengthAllowed) != undefined &&
          Number(lengthAllowed) != ""
        ) {
          lengthAllowed = Number(lengthAllowed);
        } else {
          lengthAllowed = 12;
        }
        console.log(lengthAllowed,'lengthAllowed');
        label = $(element).find("label").html();
        
        if (!optionVal) {
          $(".error." + optionId)
            .html("Please choose the option " + label)
            .show();
          errorAvailable = true;
        } else {
          $(".error." + optionId).hide();
        }
        //alert('www');
       
        if (optionVal.toString().length == lengthAllowed ) {
          event.stopPropagation();
          event.preventDefault();
         // alert('set');
          $(".error." + optionId)
            .html(
              "A maximum of " +
                lengthAllowed +
                " characters are allowed in the option " +
                label
            )
            .show();
          errorAvailable = true;
          
        } else {
          $(".error." + optionId).hide();
        }
      });
  }
}

$(document).ready(() => {
  $("#yourZoom_centerUploader").hide(); 
  $("#yourZoom_uploader").hide(); 
  if (window.location.href.includes('/products') &&  _isCanvasEnabled) {
    loadCanvasImages();
  }
  $("#CommonOptions li").each((index, element) => {
    console.log('trst1');
    validate_inputtext_ontype(index, element);
  });
  $("#sortableoptions li").each((index, element) => {
    console.log('trst2');
    if (!$(element).hasClass("eitheror-group")) {
      validate_inputtext_ontype(index, element);
    }
  });
  $("#sortableoptions li.eitheror-group > div.content_comes_here").each(
    (index, element) => {
      console.log('trst3');
      validate_inputtext_ontype(index, element);
    }
  );
 
  });

function removeLineItem_NoProd(dataItems, prodhId, item_key, prodUId,qty,removeflatValues) {
  let remLineItems = {};

  remLineItems[item_key.key] = 0;

  for (item in dataItems) {
   
    if (
      dataItems[item].key != item_key.key &&
      dataItems[item].properties["_hopsUId"] == prodUId
      //dataItems[item].properties["_hopsId"] == prodhId
    ) {
      remLineItems[dataItems[item].key] = 0;
    }

    // if (
    //   dataItems[item].key != item_key.key &&
    //   dataItems[item].properties["_design"] &&
    //   dataItems[item].product_type == "HiddenCharges"
    // ) {
    //   if (
    //     dataItems[item].properties["_design"] ==
    //     item_key.properties["_design"]
    //   ) {
    //     remLineItems[dataItems[item].key] = 0;
    //   }
    // }
  }

  if (Object.keys(remLineItems).length > 0) {
    jQuery.post("/cart/update.js", { updates: remLineItems }).done(function () {
      // calculatePremiumProcessing();
      updateCartFlatCharges(
        dataItems,
        removeflatValues,
        qty,
        item_key.properties["_prodType"],
        minLimits,
        moaAmnts,
        item_key
      );
      //CartMOA(minLimits, moaAmnts);
    });
  }
}

/*****add subscribe pop up start */

$(".sub_sec").click(function () {
  $(".announce_section").show();
});

$(".close_pop").click(function () {
  $(".announce_section").hide();
});

/*****add subscribe pop up end */

/**----------------------------------------*
 *********CART-PAGE-JS*******START**********
 *-----------------------------------------*/

function ValidateDate() {
  var eventDate = new Date($("#eventDate").val().replace(/-/g, "/"));
  var deliveryDate = new Date($("#deliveryDate").val().replace(/-/g, "/"));
  if ( deliveryDate != "" ) {
    conform_Date();
  } 
  else 
   {
    outer_click_notHide_Modal_alert_prior_warning();
  } 
}
function ValidateDate_Event_deli() {
  var eventDate = new Date($("#eventDate").val().replace(/-/g, "/"));
  var deliveryDate = new Date($("#deliveryDate").val().replace(/-/g, "/"));
  console.log( eventDate);
   console.log( deliveryDate);
  const diffTime = Math.abs(eventDate - deliveryDate);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
console.log(diffTime + " milliseconds");
console.log(diffDays + " days");
  if ( diffDays <= 1 && eventDate > deliveryDate ){
     outer_click_notHide_Modal_alert_prior_warning();
  }
   else if (diffDays  >= 2 && eventDate > deliveryDate)
   {
    conform_Date_Event_deli();
  } 
 
 else if ( eventDate <= deliveryDate)
   {
    outer_click_notHide_Modal_alert_prior_warning();
  } 
  
}

function conform_Date() {
  // calculatePremiumProcessing();

  var eventdatetxt = $("#eventDate").val().replace(/-/g, "/");
  var deliverydatetxt = $("#deliveryDate").val().replace(/-/g, "/");
  var addtionaltext =
    "Your Event Date is " +
    " NOT SELECTED" +
    " so we will deliver it by " +
    deliverydatetxt;
  $("#modal_body").html(addtionaltext);
  $("#Modal_ship").modal("show");
}

function conform_Date_Event_deli() {
  // calculatePremiumProcessing();

  var eventdatetxt = $("#eventDate").val().replace(/-/g, "/");
  var deliverydatetxt = $("#deliveryDate").val().replace(/-/g, "/");
  var addtionaltext =
      "Your Event Date is " +
    eventdatetxt +    
    " so we will deliver it by " +
    deliverydatetxt;
  $("#modal_body").html(addtionaltext);
  $("#Modal_ship").modal("show");
}
//print dates start
$("#eventDate").on("input", function () {
  // Print entered value in a div box
  $("#eventDatetext").text($(this).val());
});
$("#deliveryDate").on("input", function () {
  // Print entered value in a div box
  $("#deliveryDatetext").text($(this).val());
});
//print dates end
$(".edit_date").click(function () {
  $("#Modal_ship").modal("hide");
  // $("#eventDate").focus();
   $("#deliveryDate").focus();
  $("#deliveryDate").val("");
  localStorage.setItem("deliveryDate","");
});
$("#conform_date").click(function () {
  $("#Modal_ship").modal("show");
  $("#conform_s_e").attr(
    "style",
    "display:block; color:green; font-weight:600;text-align:center;"
  );
  $("#display_s_e").attr("style", "display:none; ");
  $("#conform_date").attr("style", "display:none; ");
  $("#title_before").attr("style", "display:none; ");
  $("#title_after").attr("style", "display:block; ");
  $("#edit_date_display").attr("style", "display:none; ");
  $("#Modal_ship").modal("hide");
});

function setLocalStorageCart() {
  $("#eventDate").val(localStorage.getItem("eventDate"));
  $("#deliveryDate").val(localStorage.getItem("deliveryDate"));
  $("#address-type").val(localStorage.getItem("address-type"));
  $("#ordered-before").val(localStorage.getItem("ordered-before"));
  $("#previously-delivered").val(localStorage.getItem("previously-delivered"));
  $("#name").val(localStorage.getItem("name"));
  $("#phone").val(localStorage.getItem("phone"));
  $("#how-did-you-hear-about-us").val(
    localStorage.getItem("how-did-you-hear-about-us")
  );
  // $("#special-instructions").val(localStorage.getItem("special-instructions"));
}

function setStorage(_this) {
  
  localStorage.setItem(_this.id, _this.value);
}

function clearLocalStorage() {
  localStorage.removeItem("eventDate");
  localStorage.removeItem("deliveryDate");
  localStorage.removeItem("address-type");
  localStorage.removeItem("ordered-before");
  localStorage.removeItem("previously-delivered");
  localStorage.removeItem("name");
  localStorage.removeItem("phone");
  localStorage.removeItem("how-did-you-hear-about-us");
  localStorage.removeItem("calendaralertText");
}

function storeDeliveryDateSelectionMeta(hasOnlyStock) {
  localStorage.setItem(
    "deliveryDateNextDayAtSelection",
    String(getStockCutoffNextDay(hasOnlyStock))
  );
  localStorage.setItem("deliveryDateSelectedAtMs", String(Date.now()));
}

function getSelectedDeliveryDateValue() {
  var inputVal = $("#deliveryDate").val();
  if (inputVal) {
    return String(inputVal).replace(/-/g, "/");
  }
  return localStorage.getItem("deliveryDate");
}

function click_submit_calender(_this) {
  localStorage.setItem(_this.id, _this.value.replace(/-/g, "/"));
  localStorage.setItem("delAddTime", new Date().toLocaleDateString());
  if (_this.id == "deliveryDate") {
    storeDeliveryDateSelectionMeta(hasOnlyStock);
    if (isDeliveryDateValidForCutoff(_this.value, hasOnlyStock)) {
      $("#deliveryDate").removeClass("input-error");
      $("#divmessage").html("").css("display", "none");
    }
  }
  if (_this.id == "eventDate") $("#deliveryDate").focus();
  if ($("#eventDate").val().replace(/-/g, "/") == "" && $("#deliveryDate").val().replace(/-/g, "/") != "") {
    // alertPop_up_empty_fields();
    // alter_pop_close();

    // alertPop_up_empty_fields_delivery();
    // alter_pop_close_delivery();
    // alter_add_date_delivery();

    ValidateDate();
  }
  else{
    ValidateDate_Event_deli();
  }
  // if ($("#eventDate").val() == "" && $("#deliveryDate").val() == "") {
  //   alertPop_up_empty_fields();
  //   alter_pop_close();
  // } else if ($("#deliveryDate").val() == "") {
  //   alertPop_up_empty_fields_delivery();
  //   alter_pop_close_delivery();
  //   alter_add_date_delivery();
  // } else {
  //   ValidateDate();
  // }
}

function alertPop_up_empty_fields() {
  //$("#Modal_alert").modal('show');
  outer_click_notHide_Modal_alert();
}

function alter_pop_close() {
  $("#close_pop").click(function () {
    $("#Modal_alert").modal("hide");
    $("#eventDate").focus();
  });
}

function alertPop_up_empty_fields_delivery() {
  $("#Modal_alert").modal("show");
}

function alter_pop_close_delivery() {
  $("#close_pop").click(function () {
    $("#Modal_alert").modal("hide");
    $("#deliveryDate").focus();
  });
}

function alter_add_date_delivery() {
  $("#add_date_delivery").click(function () {
    $("#Modal_alert").modal("hide");
    $("#deliveryDate").focus();
  });
}
//outerBodyClickNotHide for Modal_alert
function outer_click_notHide_Modal_alert() {
  $("#Modal_alert").modal({
    backdrop: "static",
    keyboard: true,
    show: true,
  });
}
//outerBodyClickNotHide for Modal_alert_prior_warning
function outer_click_notHide_Modal_alert_prior_warning() {
  //alert('test');
  $("#Modal_alert_prior_warning").modal({
    backdrop: "static",
    keyboard: true,
    show: true,
  });
}

function outer_click_notHide_Modal_alert_delivery_cutoff() {
  clearSelectedDeliveryDate();
  if (typeof initializeDeliveryDate === "function") {
    initializeDeliveryDate(typeof hasOnlyStock !== "undefined" ? hasOnlyStock : false);
  }
  $("#Modal_alert_delivery_cutoff").modal({
    backdrop: "static",
    keyboard: true,
    show: true,
  });
}

function showInvalidDeliveryCutoffModal() {
  var loaderEl = document.getElementById("loaderbg");
  if (loaderEl) {
    loaderEl.style.display = "none";
  }
  outer_click_notHide_Modal_alert_delivery_cutoff();
}

function clearSelectedDeliveryDate() {
  $("#deliveryDate").val("");
  var deliveryDateInput = document.getElementById("deliveryDate");
  if (deliveryDateInput && deliveryDateInput._flatpickr) {
    deliveryDateInput._flatpickr.clear();
  }
  localStorage.removeItem("deliveryDate");
  localStorage.removeItem("delAddTime");
  localStorage.removeItem("deliveryDateNextDayAtSelection");
  localStorage.removeItem("deliveryDateSelectedAtMs");
  localStorage.removeItem("calendaralertText");
}

function alter_please_select_delivery_cutoff() {
  clearSelectedDeliveryDate();
  if (typeof initializeDeliveryDate === "function") {
    initializeDeliveryDate(typeof hasOnlyStock !== "undefined" ? hasOnlyStock : false);
  }
  $("#Modal_alert_delivery_cutoff").modal("hide");
  setTimeout(function () {
    var deliveryDateInput = document.getElementById("deliveryDate");
    if (deliveryDateInput && deliveryDateInput._flatpickr) {
      deliveryDateInput._flatpickr.open();
    } else {
      $("#deliveryDate").focus();
    }
  }, 100);
}

function alter_add_date() {
  $("#Modal_alert").modal("hide");
  $("#eventDate").focus();
}

function alterprior_destination() {
  // $("#close_pop_prior").click(function () {
  //   $("#Modal_alert_prior_warning").modal("show");
    //     alert('Delivery date must be at least two business days prior to event date.');
   $(".close_edit_Dates").click(function () {
     $("#Modal_ship").modal("hide");
    $("#deliveryDate").focus();
    $("#deliveryDate").val("");
    localStorage.setItem("deliveryDate", "");
   
  });
}

function alter_please_select_delivery() {
  $("#prior_date").click(function () {
    $("#Modal_alert_prior_warning").modal("hide");
    $("#deliveryDate").focus();
    $("#deliveryDate").val("");
    localStorage.setItem("deliveryDate", "");
    // localStorage.setItem("deliveryDate");
   
  });
}

let holidayInsideNextDay = new Date();
holidayInsideNextDay = toCSTdate(holidayInsideNextDay);
  let hasOnlyStock = false;
if (window.location.href.includes("/cart")) {
fetch('/cart.json')
  .then(res => res.json())
  .then(data => {
    let cartItems = data.items;
    let itemsWithProdType = cartItems.filter(item => 
      item.properties && "_prodType" in item.properties
    );

    hasOnlyStock = itemsWithProdType.length > 0 &&
      itemsWithProdType.every(item => item.properties._prodType === stockProductType);

    // Initialize both date pickers AFTER hasOnlyStock is known
    initializeDeliveryDate(hasOnlyStock);
    initializeEventDate(hasOnlyStock);
  })
   .catch(error => {
    console.error("Failed to fetch cart:", error);

    // Default value if fetch fails
    hasOnlyStock = false;

    initializeDeliveryDate(hasOnlyStock);
    initializeEventDate(hasOnlyStock);
  });
}
function initializeDeliveryDate(hasOnlyStock) {
  var deliveryDateInput = document.getElementById("deliveryDate");
  if (deliveryDateInput && deliveryDateInput._flatpickr) {
    deliveryDateInput._flatpickr.destroy();
  }

  $("#deliveryDate").flatpickr({
    enableTime: false,
    dateFormat: "m-d-Y",
    disable: [
      function (date) {
        return isDeliveryDateDisabled(date, hasOnlyStock);
      },
    ],
    onChange: function (_selectedDates, dateStr) {
      if (!dateStr) return;

      localStorage.setItem("deliveryDate", dateStr.replace(/-/g, "/"));
      localStorage.setItem("delAddTime", new Date().toLocaleDateString());
      storeDeliveryDateSelectionMeta(hasOnlyStock);
      $("#deliveryDate").removeClass("input-error");
      $("#divmessage").html("").css("display", "none");
    },
    locale: {
      firstDayOfWeek: 1, // set start day of week to Monday
    },
  });
}
var nr_holidayDays = 4;

let holidayInsideNextDayE = new Date();
holidayInsideNextDayE = toCSTdate(holidayInsideNextDayE);
function initializeEventDate(hasOnlyStock) {
$("#eventDate").flatpickr({
  enableTime: false, //allowInput: true,
  minDate: "today",
  dateFormat: "m-d-Y",
  disable: [
    function (date) {
      // date = toCSTdate(date);
      // let today = new Date();
      // let tomo = new Date();
      // today = toCSTdate(today);
      // tomo = toCSTdate(tomo);

      // var nextDay = Number(shipCalendar["NextDay"]) + 2;
      // tomo.setDate(tomo.getDate() + nextDay);
      // tomo.setHours(0, 0, 0);
      // today.setHours(0, 0, 0);

      // if (today.getDay() == 5) {
      //   tomo.setDate(tomo.getDate() + 2);
      // } else if (today.getDay() == 6) {
      //   tomo.setDate(tomo.getDate() + 1);
      // }

      // if (tomo.getDay() == 6) {
      //   tomo.setDate(tomo.getDate() + 2);
      // } else if (tomo.getDay() == 0) {
      //   tomo.setDate(tomo.getDate() + 1);
      // }

      // let holiday = new Date();

      // var holidays = JSON.parse(shipCalendar["NotShipDate"]);
      // holidays.forEach((day) => {
      //   let holDay = new Date(day);

      //   if (holDay.toString() == date.toString()) {
      //     holiday = date;
      //     // alert(holDay.getDate())
      //     // alert(today.getDate())
      //     // alert(holDay.getDay())

      //     if (
      //       holDay.getDate() >= today.getDate() &&
      //       holDay.getDate() <= tomo.getDate() &&
      //       holDay.getDay() != 6 &&
      //       holDay.getDay() != 0
      //     ) {
      //       tomo.setDate(tomo.getDate() + 1);
      //       holidayInsideNextDayE = tomo;
      //     }
      //   }
      // });
      //tomo.setDate(tomo.getDate() + 2);

      //alert(holidayInsideNextDayE)
      //holidayInsideNextDayE.setDate(holidayInsideNextDayE.getDate() + 2);

      //date = toCSTdate(date);
      let today = new Date();
      let tomo = new Date();
      // let dayDate = today.getDate();

      today = toCSTdate(today);
      //  let dayDateCST = today.getDate();
      //  alert(dayDateCST)
      //  let cstDiff = dayDate - dayDateCST;

      tomo.setDate(tomo.getDate() + 1);
      tomo = toCSTdate(tomo);

     
      tomo.setHours(0, 0, 0);
      today.setHours(0, 0, 0);  
     
      
      // if (today.getDay() == 5 ) {
      //   tomo.setDate(tomo.getDate() + 2);
      // } else if (today.getDay() == 6) {
      //   tomo.setDate(tomo.getDate() + 1);
      // }

      if (tomo.getDay() == 6) {
        tomo.setDate(tomo.getDate() + 2);
      } else if (tomo.getDay() == 0) {
        tomo.setDate(tomo.getDate() + 1);
      }

      let nextDay = getStockCutoffNextDay(hasOnlyStock);
        
      tomo.setDate(tomo.getDate() + nextDay); 

      if (tomo.getDay() == 6) {
        tomo.setDate(tomo.getDate() + 2);
      } else if (tomo.getDay() == 0) {
        tomo.setDate(tomo.getDate() + 2);
      }
      tomo.setDate(tomo.getDate() + 2);
      return date < tomo || date < holidayInsideNextDayE; // disable weekends
    },
  ],
  locale: {
    firstDayOfWeek: 1, // set start day of week to Monday
  },
});
}
let cartDetailsCopied = false;
$(document).ready(() => {
  //document.getElementById("loaderbg").style.display = "none";
  if (window.location.href.includes("/cart")) {
    setLocalStorageCart();
  }
if(!window.location.href.includes('&cart_id')){
 document.getElementById("loaderbg").style.display = "none";

}
});

/**----------------------------------------*
 *********CART-PAGE-JS*******END************
 *-----------------------------------------*/

/**
 * ----------------------------------------
 * ************REORDER-LOGIC***************
 * ----------------------------------------
 */

function checkOrderLineItemAvailable() {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("edit")) {
    return urlParams.get("cart_id");
  } else if (urlParams.has('cart_id')) {
    var currentURL = new URL(window.location.href); 
    currentURL.searchParams.delete("variant");
    currentURL.searchParams.delete("cart_id");
    var newURL = currentURL.toString();
    history.pushState(null, "", newURL);
    $('#varQty').val(0);  
  }
    return false;
}

function checkOrderLineItemAvailable1() {
   let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("edit")) {
   var currentURL = new URL(window.location.href);
   currentURL.searchParams.delete("edit");
   var newURL = currentURL.toString();
   history.pushState(null, "", newURL);
   return urlParams.get("cart_id"); 
  }else {
   return false;
 }
}

function setDefault_sort() {
  var list, i, b;
  list = document.getElementById("sortableoptions");
  b = list.getElementsByTagName("LI");
  for (i = 0; i < b.length; i++) {
    b[i].setAttribute("data-sort", 1000);
  }
}

function sortElement_editOrder() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("sortableoptions");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list-items:
    for (i = 0; i < b.length - 1; i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      /* check if the next item should
      switch place with the current item: */

      if (
        Number(b[i].getAttribute("data-sort")) >
        Number(b[i + 1].getAttribute("data-sort"))
      ) {
        /* if next item is alphabetically
        lower than current item, mark as a switch
        and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
  reorder_sort_indexes();
}

function fetchCartDetails(cartLineItemAvailable) {
    return new Promise((resolve, reject) => {
  $.get("/cart.js")
    .done((_cartData) => {
      let cartData = JSON.parse(_cartData);
      // console.log(cartData);
      setDefault_sort();
      prefillLineItems(cartData, cartLineItemAvailable);
        // sortElement_editOrder();
        resolve();
    })
    .fail((error) => {
      prefillLineItems({ items: [] }, cartLineItemAvailable);

      console.error(error);
      });
    });
}

function getSelectizeLabel(_dom, propertyValue) {
  
  propertyValue2= propertyValue.replace(/([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/g, "\\$1");
  return _dom
    .siblings(".selectize-control ")
    .first()
    .find(
      ".selectize-dropdown .selectize-dropdown-content div[data-value=" +
        propertyValue2 +
        "] .name"
    )
    .text();
}

function findRelatedItems(cartData, hopsId) {
  let relLines = {};
  $(cartData.items).each((index, lineItem) => {
    if (lineItem.properties["_hopsUId"]) {
      if (
        hopsId == lineItem.properties["_hopsUId"] &&
        lineItem.product_type != "HiddenCharges" &&
        lineItem.product_type != ""
      ) {
        if (lineItem.properties["Variation"] === undefined) {
          relLines[lineItem.key] = false;
        } else {
          relLines[lineItem.key] = true;
        }
      }
    }
  });
  return relLines;
}

function fillAsVariant(lineItem) {
  let _vc = document.getElementById("varAddBtn").getAttribute("data-vCount");
   if(_isCanvasEnabled) {
    $('.image-container').show();
  }
  if (_vc < _variantLimit) {
    document
      .getElementById("varAddBtn")
      .setAttribute("data-vCount", Number(_vc) + 1);
  }
  let vCount = Number(_vc) + 1;
  $("#variation").append([{ vc: vCount }].map(ItemLabel).join(""));

  BindingAutoComplete_Variations();

  if (lineItem.quantity) {
    $("#varQty" + vCount).val(lineItem.quantity);
  }
  const productProperties = lineItem["properties"]
    ? lineItem["properties"]
    : {};
  if (productProperties["_canvasProperties"] && _isCanvasEnabled) {
    let canvasImage=productProperties["_canvasImage"];
    let extractedValue = (canvasImage.startsWith("https:") && !productProperties["orderType"]) ? canvasImage.split('/').pop() : null;
       fileNamesArr[productProperties["Variation"]]=extractedValue;
    CreateSliderElement('V'+vCount,productProperties["_canvasImage"],false);
    _canvasProp = JSON.parse(productProperties["_canvasProperties"].replace(/&quot;/g, '"'));
  }
    console.log("variantProperties", productProperties);
  $(Object.keys(productProperties)).each((index, property) => {
    if (property.toString()[0] == "_" && property.toString().length > 1) {
      property = property.toString();
      // const propertyName = property.toString().split("_")[1];
         const propertyName = property.toString().slice(1);
      let propertyValue = parsePropertyValue(
        productProperties[property],
        "code"
      );
      const _dom = $(
        "#variation #variation_" + vCount + " [name='" + propertyName + "']"
      );
      if (_dom[0] !== undefined && _dom.attr("type") != "file") {
        if (_dom.hasClass("autocomplete")) {
          if (
            _dom[0].selectize != undefined &&
            propertyValue.indexOf(" ") < 0
          ) {
            let choosenItemName = getSelectizeLabel(_dom, propertyValue);
            const ac_key = _dom.data("key");
            const chosenObject = getChosenValue(
              ac[ac_key],
              propertyValue,
              ac_key
            );
            displayChosenValue(
              chosenObject,
              propertyValue,
              ac_key,
              choosenItemName
            );
            checkDependentValues(chosenObject);
            if(_isCanvasEnabled){
             let previous = _dom[0].onchange
            _dom[0].onchange = null;
            _dom[0].selectize.setValue(propertyValue);
            _dom[0].onchange = previous
            }else{
            _dom[0].selectize.setValue(propertyValue);
            }
            
          }
        } else {
           if((_dom[0].tagName == "SELECT") && ($(_dom.find(`option[value="${propertyValue}"]`)).length == 0)){
                  _dom.eq(0).val('');
                }else{
                 _dom.eq(0).val(propertyValue);
             
                }
        }
      }
       if (productProperties["_canvasProperties"]  && _isCanvasEnabled) {
        prefillcanvasProperties(_dom, _canvasProp)
      }
    }
    if( _isCanvasEnabled){
     var value=document.querySelectorAll('#variant_list .fontapply');
    // console.log(value,'value')
    value.forEach(function(element, index) {
      if(!(element.hasAttribute('data-font-family')) && !(element.hasAttribute('data-font-size'))){
    var fontFamily=document.getElementById('02All').getAttribute('data-font-family');
    var fontSize=document.getElementById('02All').getAttribute('data-font-size');
      $(element).attr('data-font-family', fontFamily);
      $(element).attr('data-font-size', fontSize);
      }
    });
    }
  });
}

function prefillLineItems(cartData, cartLineItemAvailable) {
    let sorting = true;
  let _hopsId = getHopsId_ExistingItemOnEdit(cartData, cartLineItemAvailable);
  const relatedItems = findRelatedItems(cartData, _hopsId);
  const cartItems = cartData["items"] ? cartData["items"] : [];
  if (cartItems.length > 0) {
    $(cartItems).each((index, lineItem) => {
    
      // if (lineItem["key"] == cartLineItemAvailable) {
      if (
        lineItem.properties["_hopsId"] == lineItem.properties["_hopsVId"] &&
        lineItem.properties["_hopsUId"] == _hopsId
      ) {

        if (lineItem.quantity) {
          $("#varQty").val(lineItem.quantity);
        }
        
        const productProperties = lineItem["properties"]
          ? lineItem["properties"]
          : {};
        console.log("productProperties", productProperties);

        let _selectedStocks = [];
        if (productProperties["_selectedStocks"]) {
          _selectedStocks = productProperties["_selectedStocks"].split("~");
        }
        if (productProperties["_canvasProperties"] && _isCanvasEnabled) {
            let canvasImage=productProperties["_canvasImage"];
            let extractedValue = (canvasImage.startsWith("https:") && !productProperties["orderType"]) ? canvasImage.split('/').pop() : null;
            fileNamesArr[productProperties["_hopsId"]]=extractedValue
          CreateSliderElement(lineItem.properties["_hopsId"],productProperties["_canvasImage"]);
          _canvasProp = JSON.parse(productProperties["_canvasProperties"].replace(/&quot;/g, '"'));
          prefilltopbottom(_canvasProp, productProperties)
          prefillaplyall(_canvasProp, productProperties)
        }
        if (sorting && _isCanvasEnabled && productProperties["_canvasProperties"]) {
          sortelement(_canvasProp);
        }
        console.log("productProperties", productProperties);
        $(Object.keys(productProperties)).each((index, element) => {
          if (element.toString()[0] == "_") {
            element = element.toString();
            // const propertyName =
            //   element.toString().split("~")[1] ||
            //   element.toString().split("_")[2]
            //     ? element.toString().split("_")[1] +
            //       "_" +
            //       element.toString().split("_")[2]
            //     : element.toString().split("_")[1];
            let propertyName = element.substring(1);
            // if (element.toString().split("~")[1]) {
            //   propertyName = element.toString().split("~")[1];
            // }

            let propertyValue = parsePropertyValue(
              productProperties[element],
              "code"
            );

            const _dom = $("[name='" + propertyName + "']");

            let _li = $("[data-option-id='" + propertyName + "']");

            if (_li.attr("class") == "content_comes_here") _li = _li.parent();
            if (
              propertyName.includes("_uploadImage") ||
              propertyName.includes("_uploadCenter") 
            )
              _li = _li.closest("li");

            // if (productProperties[element].toString().indexOf("~") > 0) {
            //   let sortOrder = productProperties[element]
            //     .toString()
            //     .split("~")[1];
            //   if (sortOrder) {
            //     _li.attr("data-sort", Number(sortOrder));
            //   }
            // }

          

            if (_dom[0] !== undefined && _dom.attr("type") != "file") {
              if (_dom.hasClass("autocomplete")) {
                 $(".pop-chosen-value[data-option-id='" + _dom.data("key") + "']").removeClass("show").find("input").val('');
                if (
                  _dom[0].selectize != undefined &&
                  propertyValue.indexOf(" ") < 0
                ) {
                  let choosenItemName = getSelectizeLabel(_dom, propertyValue);
                  const ac_key = _dom.data("key");
                  const chosenObject = getChosenValue(
                    ac[ac_key],
                    propertyValue,
                    ac_key
                  );
                  displayChosenValue(
                    chosenObject,
                    propertyValue,
                    ac_key,
                    choosenItemName
                  );
                  checkDependentValues(chosenObject);
                  if(_isCanvasEnabled){
                   let previous = _dom[0].onchange
                  _dom[0].onchange = null;
                  _dom[0].selectize.setValue(propertyValue);
                  _dom[0].onchange = previous
                  }else{
                  _dom[0].selectize.setValue(propertyValue);
                  }
                }
                if (productProperties["_canvasProperties"] && _isCanvasEnabled) {
                  prefillcanvasProperties(_dom, _canvasProp)
                }
              }
              else if(_dom.hasClass("WithoutAutoComplete")){
                      let obj = ac[propertyName].find((i)=> i.id == propertyValue)
                      console.log(obj);
                      selectedImage(
                        obj.image,
                        propertyName,
                        obj.label,
                        undefined,
                        undefined,
                        obj.additionalCharge,
                        obj.additionalCharge
                      );
                      $(`#${propertyName}_id`).val(propertyValue);
                } 
              else {
                console.log("propertyName", propertyName);
                console.log(" propertyValue", propertyValue);
               

                if (propertyName.includes("_uploadImage")) {
                  var imgUrl = productProperties["_CustomDesign"];
          var reffcode = productProperties['_'+propertyName].split('~')[6];
                  var filename = productProperties['_'+propertyName].split('~')[0];
                  var extension = imgUrl.split(/[#?]/)[0].split('.').pop().trim();
                  extension = 0+extension;
                  let preview =_previwIcon[extension]
                  $(" #yourZoom_uploader .uploader-preview img:first").attr("src", imgUrl);
                  $('#uploadclick_seq').val('Change Your Design');
                  $(" #yourZoom_uploader .uploader-preview #preview").css('display','none');
                  $(" #yourZoom_uploader .uploader-preview img:first").show();
                  if (preview) {
                  $(" #yourZoom_uploader .uploader-preview #preview").attr("src",preview );
                  $(" #yourZoom_uploader .uploader-preview img:first").css('display','none');
                  $("#yourZoom_uploader .uploader-preview #preview").css('display','block');
                  }else{
                  $(" #yourZoom_uploader .uploader-preview #preview").attr("src",imgUrl );
                  }
                  // $("#yourZoom_uploader .uploader-preview img").attr("src", imgUrl);
                  $("#yourZoom_uploader .uploader-preview img").attr("alt", filename);
                  $("#yourZoom_uploader .filename").text(filename);
          $("#yourZoom_uploader .filename").attr("data-refcode",reffcode);
                  $("#yourZoom_uploader input").val(filename);
                  $("#yourZoom_uploader").attr("data-uploader-ref", filename);
                  $("#yourZoom_uploader").show();
                }

                if (propertyName.includes("_uploadCenter")) {
                  var imgUrl = productProperties["_CustomDesignCenter"];
          var reffcode2 = productProperties['_'+propertyName].split('~')[6];
                  var filename = productProperties['_'+propertyName].split('~')[0];
                  var extension = imgUrl.split(/[#?]/)[0].split('.').pop().trim();
                  extension = 0+extension;
                  let preview =_previwIcon[extension]
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").attr("src", imgUrl);
                  $('.dependent-values.show #uploadclick').val('Change Your Design');
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").css('display','none');
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").show();
                  if (preview) {
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").attr("src",preview );
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").css('display','none');
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").css('display','block');
                  }else{
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").attr("src",imgUrl );
                  }
                  // $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("src", imgUrl);
                  $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("alt", filename);
                  $(".dependent-values.show #yourZoom_centerUploader .filename").text(filename);
                  $(".dependent-values.show #yourZoom_centerUploader .filename").attr("data-refcode",reffcode2);
                  $(".dependent-values.show #yourZoom_centerUploader input").val(filename);
                  $(".dependent-values.show #yourZoom_centerUploader").attr("data-uploader-ref", filename);
                  $(".dependent-values.show #yourZoom_centerUploader").show();
                }
                 if((_dom[0].tagName == "SELECT") && ($(_dom.find(`option[value="${propertyValue}"]`)).length == 0)){
                  _dom.eq(0).val('');
                }else{
                  _dom.eq(0).val(propertyValue);
                    if(_dom.eq(0).attr("id") ==="streamer-size"){
                    _dom.eq(0).trigger("change")
                  }
                }
                if (productProperties["_canvasProperties"] && _isCanvasEnabled) {
                  prefillcanvasProperties(_dom, _canvasProp);
                }
                let propertyNameTemp = propertyName.split("~")[1]
                  ? propertyName.split("~")[1]
                  : propertyName;
                $(_selectedStocks).each((index, item) => {
                  if (propertyNameTemp == item.split(",")[0]) {
                    selectedImage(
                      item.split(",")[1],
                      item.split(",")[0],
                      item.split(",")[2],
                      undefined,
                      undefined,
                      item.split(",")[3],
                      item.split(",")[4]
                    );
                  }
                });
              }
            }

            if (propertyName.includes("_enterUploadfile")) {
             
              $("#enterUploadfile").val(propertyValue);
               //$("#enterUploadfile").addClass('is-filled');
              // $("#enterUploadfile").trigger('input');
              $("#yourZoom_uploader input").val(propertyValue);
               // $("#enterUploadfile").trigger('change');
            }

            if (propertyName.includes("_enterCenterUploadfile")) {
             
              $(".dependent-values.show #enterCenterUploadfile").val(propertyValue);
              // $(".dependent-values.show #enterCenterUploadfile").addClass('is-filled');
              $(".dependent-values.show #yourZoom_centerUploader input").val(propertyValue);
            }

          }
        });
      }
        if (relatedItems[lineItem.key] == true) {
        fillAsVariant(lineItem);
        return;
      }
    });
  }
}

function parsePropertyValue(propertyValue, _get) {
  $return = propertyValue;
  if (propertyValue) {
    if (propertyValue.toString().indexOf("~") > 0) {
      let propertyValueSet = propertyValue.toString().split("~");
      if (propertyValueSet.length < 1) return propertyValue;
      switch (_get) {
        case "optionId":
        case "code":
          $return = propertyValueSet[0];
          break;
        case "label":
        case "name":
          $return = propertyValueSet[1];
          break;
        default:
          $return = propertyValueSet[0];
      }
    }
  }
  return $return;
}

$(document).ready(async () => {
   if (window.location.href.includes('/products') && window.location.href.includes('&cart_id=') && _isCanvasEnabled) {
    // await loadCanvasImages();
      document.getElementById("loaderbg").style.display = "block";
  }
if(issBo == true){
  
  $("#CommonOptions :input").attr("disabled", true);
  $("#sortableoptions :input").attr("disabled", true);
  $("#FooterOptions :input").attr("disabled", true);
  
}
 
  let cartLineItemAvailable = checkOrderLineItemAvailable();

  if (!cartLineItemAvailable == false) {
    fetchCartDetails(cartLineItemAvailable)
      .then(async () => {
        if (_isCanvasEnabled) {
          $("#disclaimerCheck").prop("checked", true);
          $("#container2").hide();
          $("#container1").show();
          $('#canvasName').text('');
          $('#canvasName').removeAttr('variation');
           $(".customizer_btn.product-gallery__thumbnail").trigger("click");
          await prefillcanvas();
          await applyToVariations(true)  

        }
        if(window.innerWidth<=767){
        $(".customizer_btn.product-gallery__thumbnail").trigger("click");}
          document.getElementById("loaderbg").style.display = "none";

      }).catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  }
});

function calculatePremiumProcessing(iscartredirect = true) {
  if (!window.location.href.includes("/cart")) {
    sessionStorage.setItem("isKlaviyo", "true");
    console.timeEnd('time')
    return (window.location.href = "/cart");
  }
  let deliDate = new Date($("#deliveryDate").val().replace(/-/g, "/"));

  if (deliDate == "Invalid Date") {
    sessionStorage.setItem("isKlaviyo", "true");
    console.timeEnd('time')
    return (window.location.href = "/cart");
  }

  let eventDate = new Date($("#eventDate").val());
  const today = new Date();
  
  var d1 = toCSTdate(today);
  var d2 = deliDate; //toCSTdate(deliDate);
  let wrkingDayas =
    workingDaysBetweenDates(d1, d2) ;

  var cartContents = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      let ProdTypes = premiumProcessingCharges["productType"].split(",");
      let PPCartItemsAmount = 0;
      let ppCartId = 0;
      let ppFee = premiumProcessingCharges["FeeData"];
      let ppFeeLimit = premiumProcessingCharges["MPF"];
      let priorType = premiumProcessingCharges["priorProdType"];
      let prodTypesSA = [];

      let ppCart = data.items.filter(function (item) {
        return item.title.includes("Premium Processing");
      });

      let logoCart = data.items.filter(function (item) {
        return item.title.includes("Flat Charges") && item.properties["ChargeType"]=="Logo Charge";
      });

      let dieCart = data.items.filter(function (item) {
        return item.title.includes("Flat Charges") && item.properties["ChargeType"]=="Die Charge";
      });
      
      let logoBasePrice = 0 ;
      if(logoCart.length >0) logoBasePrice = logoCart[0].price;
      let dieBasePrice = 0;
      if(dieCart.length >0) dieBasePrice = dieCart[0].price;

      if (ppCart.length > 0) {
        ppCartId = ppCart[0].id;
      }

      

      $(ProdTypes).each((index, typ) => {
        let _priorDesigns=[];
      let _designs =[]
        let typProds = data.items.filter(function (item) {
          return item.properties["_prodType"] == typ;
        });
        if (typProds.length > 0) {
          prodTypesSA.push(typ);
          PPCartItemsAmount += GetPPAmount(typProds, wrkingDayas, ppFee, typ);
        }

        let logoProds = data.items.filter(function (item) {
          return item.properties["_prodType"] == typ && item.properties["_chargeType"]=="logo";
        });
        $(logoProds).each((index, prod) => {
          PPCartItemsAmount += GetPPAmount_FlatCharge((prod.quantity * logoBasePrice), wrkingDayas, ppFee, typ);
        });

        let dieProds = data.items.filter(function (item) {
          return item.properties["_prodType"] == typ && item.properties["_chargeType"]=="die";
        });

        $(dieProds).each((index, prod) => {
        
          if(prod.properties["_design"].includes(','))
          {

            $(prod.properties["_design"].split(',')).each((index, dsgn) => {
              if(typ == priorType){
                if(!_priorDesigns.includes(dsgn)) _priorDesigns.push(dsgn);
              }else{
                if(!_designs.includes(dsgn)) _designs.push(dsgn);
              }
             
            })

          }else{
            if(typ == priorType){
              if(!_priorDesigns.includes(prod.properties["_design"])) _priorDesigns.push(prod.properties["_design"]);
            }else{
              if(!_designs.includes(prod.properties["_design"])) _designs.push(prod.properties["_design"]);
            }
          }

        });  
     
        if(_priorDesigns.length> 0) 
        {
          PPCartItemsAmount += GetPPAmount_FlatCharge((_priorDesigns.length * dieBasePrice), wrkingDayas, ppFee, typ);
        }
  
        if(_priorDesigns.length == 0 && _designs.length > 0)
        {
          PPCartItemsAmount += GetPPAmount_FlatCharge((_designs.length * dieBasePrice), wrkingDayas, ppFee, typ);
        }
  
        if(_priorDesigns.length > 0 && _designs.length > 0)
        {
          let _udesigns = [];
          $(_designs).each((index, dsn) => {
            if(!_priorDesigns.includes(dsn)) _udesigns.push(dsn);
          });
          if(_udesigns.length >0) PPCartItemsAmount += GetPPAmount_FlatCharge((_udesigns.length * dieBasePrice), wrkingDayas, ppFee, typ);
        }
 
      });
      
      let qty = 1;
      let itemId = 0;
      
      if (PPCartItemsAmount > 0) {
        if (ppFeeLimit > PPCartItemsAmount) {
          PPCartItemsAmount = ppFeeLimit;
          itemId = premiumProcessingCharges["variant_MPF"];
        } else {
          // qty =  PPCartItemsAmount.toFixed(2) * 100;
          // itemId = premiumProcessingCharges["variant_base"];          

           qty = Math.round(PPCartItemsAmount * 100);
          // alert(qty)

           if(qty > 999999)
           {

                qty = 1;
              var settings = {
                url:
                  "https://hops-connect.dev.hodgesbadge.com/ShopifyShipping/AddVariantInPPFee?minPF=" +
                  PPCartItemsAmount.toFixed(2),
                method: "GET",
                timeout: 0,
              };

              $.ajax(settings).done(function (response) {
                console.log(response);
                setTimeout(function () {
                  itemId = response;
                  let props = {};
                   props["_deliveryDate"] = localStorage.getItem("deliveryDate");// deliDate;
                // props["_eventDate"] = eventDate;

                  if (itemId > 0) {
                    let alertText = "";

                    if (tempNextDay != "" && tempFeeCent > 0) {
                      if (tempNextDay.toLowerCase().includes("next"))
                        alertText = CalendarAlerts["NextDayFee"];
                    }
                    if (tempNextDay != "" && tempFeeCent == 0) {
                      if (tempNextDay.toLowerCase().includes("next"))
                        alertText = CalendarAlerts["NextDayNoFee"];
                    }
                    if (tempNextDay != "" && tempFeeCent > 0) {
                      if (tempNextDay.toLowerCase().includes("second"))
                        alertText = CalendarAlerts["SecondDayFee"];
                    }
                    if (tempNextDay != "" && tempFeeCent == 0) {
                      if (tempNextDay.toLowerCase().includes("second"))
                        alertText = CalendarAlerts["SecondDayNoFee"];
                    }
                    if (alertText != "") {
                      props["_alertText"] = alertText;
                    }
                    localStorage.setItem("calendaralertText", alertText);
                  }
                  
                  if (ppCartId > 0) {
                    rem_add_PP(qty, itemId, props, ppCartId);
                  } else {
                    adCart_PP(qty, itemId, props);
                  }
                }, 20000);
              });
              return;

           }

           itemId = premiumProcessingCharges["variant_base"];
        }
        let props = {};
         props["_deliveryDate"] = localStorage.getItem("deliveryDate");//deliDate;
       // props["_eventDate"] = eventDate;

        if (itemId > 0) {
          let alertText = "";

          if (tempNextDay != "" && tempFeeCent > 0) {
            if (tempNextDay.toLowerCase().includes("next"))
              alertText = CalendarAlerts["NextDayFee"];
          }
          if (tempNextDay != "" && tempFeeCent == 0) {
            if (tempNextDay.toLowerCase().includes("next"))
              alertText = CalendarAlerts["NextDayNoFee"];
          }
          if (tempNextDay != "" && tempFeeCent > 0) {
            if (tempNextDay.toLowerCase().includes("second"))
              alertText = CalendarAlerts["SecondDayFee"];
          }
          if (tempNextDay != "" && tempFeeCent == 0) {
            if (tempNextDay.toLowerCase().includes("second"))
              alertText = CalendarAlerts["SecondDayNoFee"];
          }
          if (alertText != "") {
            props["_alertText"] = alertText;
          }
          localStorage.setItem("calendaralertText", alertText);
        }

        if (ppCartId > 0) {
          rem_add_PP(qty, itemId, props, ppCartId,iscartredirect);
        } else {
          adCart_PP(qty, itemId, props,iscartredirect);
        }
      } else {
       
        if (ppCartId > 0) { 
          shipAlerts_cart_No(prodTypesSA);      
          removeCart_PP(ppCartId,data.items[0],deliDate,iscartredirect);
        } else {
          console.log("data-cart", data);  
          shipAlerts_cart(data.items[0],prodTypesSA,iscartredirect);        
        }
      }
    });
}

let tempNextDay = "";
let tempFeeCent = 0;

function GetPPAmount(typProds, wrkingDayas, ppFee, typ) {
  let prodTypTotal = 0;
  $(typProds).each((index, prod) => {
    prodTypTotal += prod.final_line_price;
  });
  if (prodTypTotal > 0) {
    for (item in ppFee) {
      if (ppFee[item].ProductTypeId == typ && ppFee[item].FeePercentage > 0) {
        if (
          wrkingDayas >= ppFee[item].DeliveryWorkDays &&
          wrkingDayas <= ppFee[item].DeliveryWorkDaysThru
        ) {
          tempNextDay = ppFee[item].ShipMethodDescription;
          if (ppFee[item].FeePercentage > 0) {
            let ppFeeCent = ppFee[item].FeePercentage / 100;
            tempFeeCent = ppFeeCent;
            let typtotal = prodTypTotal / 100;
            return typtotal * ppFeeCent;
          }
        }
      }
    }
  }
  return 0;
}

function GetPPAmount_FlatCharge(prodTypTotal, wrkingDayas, ppFee, typ) {

  if (prodTypTotal > 0) {
    for (item in ppFee) {
      if (ppFee[item].ProductTypeId == typ && ppFee[item].FeePercentage > 0) {
        if (
          wrkingDayas >= ppFee[item].DeliveryWorkDays &&
          wrkingDayas <= ppFee[item].DeliveryWorkDaysThru
        ) {
          tempNextDay = ppFee[item].ShipMethodDescription;
          if (ppFee[item].FeePercentage > 0) {
            let ppFeeCent = ppFee[item].FeePercentage / 100;
            tempFeeCent = ppFeeCent;
            let typtotal = prodTypTotal / 100;
            return typtotal * ppFeeCent;
          }
        }
      }
    }
  }
  return 0;
}

function removeCart_PP(ppId,item,deliDate,iscartredirect) {
  jQuery.post("/cart/change.js", { quantity: 0, id: ppId }).done(function () {
    fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      let props = data.items[0].properties;
    props["_deliveryDate"] = localStorage.getItem("deliveryDate");//deliDate;
    jQuery.post("/cart/change.js", { quantity: data.items[0].quantity, id: data.items[0].key, properties:props }).done(function () {
      sessionStorage.setItem("isKlaviyo", "true");
      console.timeEnd('time')
      if(iscartredirect) {window.location.href = "/cart";}
    });
    });
    
  });
}

function rem_add_PP(qty, itemId, props, ppId,iscartredirect) {
  jQuery.post("/cart/change.js", { quantity: 0, id: ppId }).done(function () {
    adCart_PP(qty, itemId, props,iscartredirect);
  });
}

function adCart_PP(qty, itemId, props,iscartredirect) {
   props["_legacy_product_as_fee_title"] = "Premium Processing Charges";
   props["_legacy_product_as_fee_description"] = "Premium Processing Charges";
  jQuery
    .post("/cart/add.js", {
      items: [
        {
          quantity: qty,
          id: itemId,
          properties: props,
        },
      ],
    })
    .done(function () {
      sessionStorage.setItem("isKlaviyo", "true");
      console.timeEnd('time')
      if(iscartredirect) {window.location.href = "/cart";}
    });
}

let workingDaysBetweenDates = (d0, d1) => {


  let today = d0;
      let availDeliveryStartDate = new Date();
      availDeliveryStartDate = toCSTdate(availDeliveryStartDate);
      let nextDay = getStockCutoffNextDay(hasOnlyStock);
      availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() );
      availDeliveryStartDate.setHours(0, 0, 0);
      today.setHours(0, 0, 0);

      if (today.getDay() == 5) {
        availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 2);
      } else if (today.getDay() == 6) {
        availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 1);
      } 

      availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + nextDay);

      if (availDeliveryStartDate.getDay() == 6) {
        availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 2);
      } else if (availDeliveryStartDate.getDay() == 0) {
        availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 1);
      }     
     
      var holidays = JSON.parse(shipCalendar["NotShipDate"]);
      holidays.forEach((day) => {
        let holDay = new Date(day);

        if (holDay.toString() == availDeliveryStartDate.toString()) {
          availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 1);
        }
      });
       
      if (availDeliveryStartDate.getDay() == 6) {
        availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 2);
      } else if (availDeliveryStartDate.getDay() == 0) {
        availDeliveryStartDate.setDate(availDeliveryStartDate.getDate() + 1);
      } 
      var millisecondsPerDay = 86400 * 1000;
      availDeliveryStartDate.setHours(0, 0, 0); // Start just after midnight
      d1.setHours(0, 0, 0); // End just before midnight
      var diff = d1 - availDeliveryStartDate; // Milliseconds between datetime objects
      var days = Math.ceil(diff / millisecondsPerDay);
      var noWeekenddaystoAdd = 0;
      
  
      for(var loopDate = availDeliveryStartDate; loopDate < d1; loopDate.setDate(loopDate.getDate() + 1))
      {
      
        if (loopDate.getDay() == 6 || loopDate.getDay() == 0 ) {
          noWeekenddaystoAdd +=1 ;
        }

      }
      
      return (days-noWeekenddaystoAdd);
  
};

let workingDaysBetweenDates_bk = (d0, d1) => {
  /* Two working days and an sunday (not working day) */
  // var holidays = ["2016-05-03", "2016-05-05", "2016-05-07"];
  var holidays = JSON.parse(shipCalendar["NotShipDate"]);
  var startDate = d0;
  var endDate = d1;
  // var startDate = parseDate(d0);
  // var endDate = parseDate(d1);

  // Validate input
  if (endDate <= startDate) {
    return 0;
  }

  // Calculate days between dates
  var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
  startDate.setHours(0, 0, 0, 1); // Start just after midnight
  endDate.setHours(23, 59, 59, 999); // End just before midnight
  var diff = endDate - startDate; // Milliseconds between datetime objects
  var days = Math.ceil(diff / millisecondsPerDay);
alert(days)
  // Subtract two weekend days for every week in between
  var weeks = Math.floor(days / 7);
  days -= weeks * 2;
  alert(weeks)
  alert(days)
  // Handle special cases
  var startDay = startDate.getDay();
  var endDay = endDate.getDay();

  // Remove weekend not previously removed.
  if (startDay - endDay > 1) {
    days -= 2;
  }
  // Remove start day if span starts on Sunday but ends before Saturday
  if (startDay == 0 && endDay != 6) {
    days--;
  }
  // Remove end day if span ends on Saturday but starts after Sunday
  if (endDay == 6 && startDay != 0) {
    days--;
  }
  /* Here is the code */
  holidays.forEach((day) => {
    let holDay = new Date(day);

    if (holDay >= d0 && holDay <= d1) {
      /* If it is not saturday (6) or sunday (0), substract it */
      if (holDay.getDay() % 6 != 0) {
        days--;
      }
    }
  });
alert(days - 1)
  return days - 1;
};

function continue_confirm() {
  document.getElementById("loaderbg").style.display = "block";
  // shipAlerts_cart();

  calculatePremiumProcessing();
}

function myAccountReOrder(lineItems) {
  let CartItems = [];

  $(lineItems).each((index, item) => {
    let props = {};
    $(item.properties).each((index, prop) => {
      props[prop[0]] = prop[1];
    });

    var Item = {
      quantity: item.quantity,
      id: item.variant_id,
      properties: props,
    };
    CartItems.push(Item);
  });

  var addCart = { items: CartItems };
  document.getElementById("loaderbg").style.display = "block";
  clearLocalStorage();
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
      /* yay! our products were added - do something here to indicate to the user */
      window.location.href = "/cart";
    })
    .catch((err) => {
      /* uh oh, we have error. */
      console.error(err);
    });
}

let myAcc_CartItems = [];
let myAcc_CartItemsRemove = {};

function gethUId(_hopsId) {
  let hpIdCount = 1;
  if (localStorage.getItem(_hopsId)) {
    hpIdCount += Number(localStorage.getItem(_hopsId));
  }
  localStorage.setItem(_hopsId, hpIdCount);
  return hpIdCount;
}


function addtoCart_myCart() {
  var addCart = { items: myAcc_CartItems };
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
      /* yay! our products were added - do something here to indicate to the user */
      CartMOA(myAcc_minLimits, myAcc_moaAmnts);
    })
    .catch((err) => {
      /* uh oh, we have error. */
      console.error(err);
    });
}

function clearCart() {
  $.ajax({
    type: "POST",
    url: "/cart/clear.js",
    success: function () {
      $.ajax({
        type: "GET",
        url: '/cart.js',
        dataType: 'json',
        success: function(resp) { 
            var nullHash = {};
            for ([key, value] of Object.entries(resp.attributes)) {    
                nullHash[key] = null;
            }
            $.ajax({
                type: "POST",
                url: '/cart/update.js',
                data: {attributes:nullHash},
                dataType: 'json'
            });
        }
    });
      sessionStorage.setItem("isKlaviyo", "true");
      window.location.href = "/cart";
    },
    dataType: "json",
  });
  
}

function AddPPVariant(amount) {
  var settings = {
    url:
      "https://hops-connect.dev.hodgesbadge.com/ShopifyShipping/AddVariantInPPFee?minPF=" +
      amount,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    return response;
  });
}
function toCSTdate(inDate)
{
  return new Date(inDate.toLocaleString('en-US', {
     timeZone: "america/chicago",
  }));

}

function mapStockCutoffTimezoneCode(timezoneCode) {
  var code = String(timezoneCode || "").trim().toUpperCase();
  if (code === "IST") return "Asia/Kolkata";
  if (code === "CST") return "america/chicago";
  if (code === "EST") return "America/New_York";
  return null;
}

function getStockCutoffTimezone() {
  var isSandboxShop =
    typeof shopPermanentDomain === "string" &&
    shopPermanentDomain.indexOf("sandbox") !== -1;

  if (isSandboxShop) {
    var urlTimezone = new URLSearchParams(window.location.search).get("cutoffTz");
    var mappedUrlTimezone = mapStockCutoffTimezoneCode(urlTimezone);
    if (mappedUrlTimezone) return mappedUrlTimezone;
  }

  var mappedTimezone = mapStockCutoffTimezoneCode(
    shipCalendar && shipCalendar["StockCutoffTimezone"]
  );
  if (mappedTimezone) return mappedTimezone;

  return "america/chicago";
}

function parseStockCutoffTime(timeValue) {
  var raw = String(timeValue || "").trim();
  var match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    return { hour: NaN, minute: 0 };
  }

  return {
    hour: parseInt(match[1], 10),
    minute: parseInt(match[2], 10)
  };
}

function toStockCutoffDate(inDate) {
  return new Date(
    inDate.toLocaleString("en-US", {
      timeZone: getStockCutoffTimezone(),
    })
  );
}

function getCheckoutCstDate(inDate) {
  return new Date(
    inDate.toLocaleString("en-US", {
      timeZone: "america/chicago",
    })
  );
}

function formatCheckoutCstDateTime(inDate) {
  return inDate.toLocaleString("en-US", {
    timeZone: "america/chicago",
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function logCheckoutCutoffDebug(deliveryDate, hasOnlyStock) {
  var nowCst = getCheckoutCstDate(new Date());
  var cutoff = parseStockCutoffTime(shipCalendar && shipCalendar["StockCutoffTime"]);
  var stockCutoffTime =
    shipCalendar && shipCalendar["StockCutoffTime"]
      ? String(shipCalendar["StockCutoffTime"])
      : "Not set";
  var isPastStockCutoff =
    hasOnlyStock &&
    !isNaN(cutoff.hour) &&
    (nowCst.getHours() > cutoff.hour ||
      (nowCst.getHours() === cutoff.hour && nowCst.getMinutes() >= cutoff.minute));
  var shouldBlock = shouldBlockDeliveryDateForCutoff(deliveryDate, hasOnlyStock);

  console.group("Checkout delivery cutoff check");
  console.log("Current CST time:", formatCheckoutCstDateTime(new Date()));
  console.log("Stock cutoff time (metafield):", stockCutoffTime);
  console.log("Has only stock products:", hasOnlyStock);
  console.log("Is past stock cutoff:", isPastStockCutoff);
  console.log("StockProductsNextDay:", shipCalendar && shipCalendar["StockProductsNextDay"]);
  console.log("NextDay:", shipCalendar && shipCalendar["NextDay"]);
  console.log(
    "Applied nextDay offset:",
    getStockCutoffNextDay(hasOnlyStock, { useCstNow: true, calendar: shipCalendar })
  );
  console.log("Selected delivery date:", deliveryDate);
  console.log("Block checkout:", shouldBlock);
  console.groupEnd();

  return shouldBlock;
}

function normalizeShipCalendar(calendarData) {
  if (!calendarData || typeof calendarData !== "object") {
    return calendarData;
  }

  if (calendarData.value && typeof calendarData.value === "object") {
    return calendarData.value;
  }

  return calendarData;
}

function extractShipCalendarFromHtml(html) {
  if (!html) return null;

  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");
  var dataEl = doc.getElementById("ship-calendar-data");

  if (!dataEl) return null;

  var raw = (dataEl.textContent || dataEl.innerText || "").trim();
  if (!raw) return null;

  try {
    return normalizeShipCalendar(JSON.parse(raw));
  } catch (error) {
    console.error("Failed to parse ship calendar JSON:", error, raw);
    return null;
  }
}

function refreshShipCalendarSettings() {
  var cartUrl =
    window.routes && window.routes.cartUrl ? window.routes.cartUrl : "/cart";
  var fetchOptions = {
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  };
  var previousCutoff =
    shipCalendar && shipCalendar["StockCutoffTime"]
      ? String(shipCalendar["StockCutoffTime"])
      : null;

  return fetch(cartUrl + "?sections=main&_=" + Date.now(), fetchOptions)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var freshCalendar = extractShipCalendarFromHtml(data && data.main);

      if (freshCalendar) {
        shipCalendar = freshCalendar;
        console.log("Fresh ship calendar metafield loaded on checkout (section API):", shipCalendar);
        console.log(
          "Cutoff time changed:",
          previousCutoff,
          "->",
          shipCalendar["StockCutoffTime"]
        );
        return shipCalendar;
      }

      console.warn(
        "Ship calendar refresh: section API did not return #ship-calendar-data, trying full cart page."
      );

      return fetch(cartUrl + "?_=" + Date.now(), fetchOptions)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          var freshFromPage = extractShipCalendarFromHtml(html);

          if (freshFromPage) {
            shipCalendar = freshFromPage;
            console.log("Fresh ship calendar metafield loaded on checkout (full page):", shipCalendar);
            console.log(
              "Cutoff time changed:",
              previousCutoff,
              "->",
              shipCalendar["StockCutoffTime"]
            );
          } else {
            console.warn(
              "Ship calendar refresh failed, using cached values:",
              shipCalendar
            );
          }

          return shipCalendar;
        });
    })
    .catch(function (error) {
      console.error("Failed to refresh ship calendar settings:", error);
      return shipCalendar;
    });
}

function getStockCutoffNextDay(hasOnlyStock, options) {
  options = options || {};
  var calendar = options.calendar || shipCalendar;
  var now = options.useCstNow
    ? getCheckoutCstDate(new Date())
    : toStockCutoffDate(new Date());
  var cutoff = parseStockCutoffTime(calendar && calendar["StockCutoffTime"]);
  var isPastStockCutoff =
    hasOnlyStock &&
    !isNaN(cutoff.hour) &&
    (now.getHours() > cutoff.hour ||
      (now.getHours() === cutoff.hour && now.getMinutes() >= cutoff.minute));

  if (isPastStockCutoff) {
    return Number(calendar["NextDay"]);
  }

  return hasOnlyStock
    ? Number(calendar["StockProductsNextDay"])
    : Number(calendar["NextDay"]);
}

function parseDeliveryDateInput(value) {
  if (!value) return null;

  var normalized = String(value).replace(/-/g, "/").trim();
  var parts = normalized.split("/");

  if (parts.length === 3) {
    var month = parseInt(parts[0], 10);
    var day = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      var explicitDate = new Date(year, month - 1, day);
      explicitDate.setHours(0, 0, 0, 0);
      return explicitDate;
    }
  }

  var parsed = new Date(normalized);

  if (isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function resolveHasOnlyStockFromCart(cartData) {
  var itemsWithProdType = cartData.items.filter(function (item) {
    return item.properties && "_prodType" in item.properties;
  });

  return (
    itemsWithProdType.length > 0 &&
    itemsWithProdType.every(function (item) {
      return item.properties._prodType === stockProductType;
    })
  );
}

function computeEarliestDeliveryDate(hasOnlyStock) {
  var today = toStockCutoffDate(new Date());
  var tomo = new Date(today);

  tomo.setDate(tomo.getDate() + 1);
  tomo.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (tomo.getDay() == 6) {
    tomo.setDate(tomo.getDate() + 2);
  } else if (tomo.getDay() == 0) {
    tomo.setDate(tomo.getDate() + 1);
  }

  var nextDay = getStockCutoffNextDay(hasOnlyStock);
  tomo.setDate(tomo.getDate() + nextDay);

  if (tomo.getDay() == 6) {
    tomo.setDate(tomo.getDate() + 2);
  } else if (tomo.getDay() == 0) {
    tomo.setDate(tomo.getDate() + 2);
  }

  var candidate = new Date(tomo);

  for (var i = 0; i < 366; i++) {
    if (candidate.getDay() === 0 || candidate.getDay() === 6) {
      candidate.setDate(candidate.getDate() + 1);
      continue;
    }

    var isHoliday = false;

    if (shipCalendar && shipCalendar["NotShipDate"]) {
      var holidays = JSON.parse(shipCalendar["NotShipDate"]);
      holidays.forEach(function (day) {
        var holDay = new Date(day);
        holDay.setHours(0, 0, 0, 0);
        var check = new Date(candidate);
        check.setHours(0, 0, 0, 0);

        if (holDay.getTime() === check.getTime()) {
          isHoliday = true;
        }
      });
    }

    if (isHoliday) {
      candidate.setDate(candidate.getDate() + 1);
      continue;
    }

    return candidate;
  }

  return candidate;
}

function isDeliveryDateDisabled(date, hasOnlyStock, options) {
  options = options || {};
  var calendar = options.calendar || shipCalendar;
  var today = options.useCstNow
    ? getCheckoutCstDate(new Date())
    : toStockCutoffDate(new Date());
  var tomo = new Date(today);

  tomo.setDate(tomo.getDate() + 1);
  tomo.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (tomo.getDay() == 6) {
    tomo.setDate(tomo.getDate() + 2);
  } else if (tomo.getDay() == 0) {
    tomo.setDate(tomo.getDate() + 1);
  }

  var nextDay = getStockCutoffNextDay(hasOnlyStock, options);
  tomo.setDate(tomo.getDate() + nextDay);

  if (tomo.getDay() == 6) {
    tomo.setDate(tomo.getDate() + 2);
  } else if (tomo.getDay() == 0) {
    tomo.setDate(tomo.getDate() + 2);
  }

  var holidayInsideNextDayLocal = new Date(tomo);
  var holiday = new Date();
  holiday = toCSTdate(holiday);

  if (calendar && calendar["NotShipDate"]) {
    var holidays = JSON.parse(calendar["NotShipDate"]);
    holidays.forEach(function (day) {
      var holDay = new Date(day);

      if (holDay.toString() == date.toString()) {
        holiday = date;

        if (
          holDay.getDate() >= today.getDate() &&
          holDay.getDate() <= tomo.getDate() &&
          holDay.getDay() != 6 &&
          holDay.getDay() != 0
        ) {
          tomo.setDate(tomo.getDate() + 1);
          holidayInsideNextDayLocal = new Date(tomo);
          holidayInsideNextDay = new Date(tomo);
        }
      }
    });
  }

  var checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return (
    checkDate.getDay() === 0 ||
    checkDate.getDay() === 6 ||
    checkDate < tomo ||
    checkDate < holidayInsideNextDayLocal ||
    checkDate.toString() == holiday.toString()
  );
}

function isDeliveryDateValidForCutoff(deliveryDateValue, hasOnlyStock) {
  var parsedDate = parseDeliveryDateInput(deliveryDateValue);
  if (!parsedDate) return false;

  var earliest = computeEarliestDeliveryDate(hasOnlyStock);
  earliest.setHours(0, 0, 0, 0);

  return parsedDate.getTime() >= earliest.getTime();
}

function shouldBlockDeliveryDateForCutoff(deliveryDateValue, hasOnlyStock) {
  var parsedDate = parseDeliveryDateInput(deliveryDateValue);
  if (!parsedDate) return true;

  // Re-evaluate on every checkout click with fresh metafield + current CST time.
  return isDeliveryDateDisabled(parsedDate, hasOnlyStock, {
    useCstNow: true,
    calendar: shipCalendar,
  });
}

function shipAlerts_cart_No(prodTypesSA) {

  // localStorage.removeItem("calendaralertText");
   let deliDate = new Date($("#deliveryDate").val().replace(/-/g, "/")); 
   const today = new Date();
   var d1 = toCSTdate(today);
   var d2 = deliDate ; //toCSTdate(deliDate);
   
   
   let wrkingDayas =
     workingDaysBetweenDates(d1, d2) ;
       
       
   let ppFee = premiumProcessingCharges["FeeData"];
   let alertText = "";
   let priorProdType = premiumProcessingCharges["priorProdType"];
   if(prodTypesSA.length == 1) {
     priorProdType = prodTypesSA[0];
   }else{
     if(!prodTypesSA.includes(priorProdType.toString())) priorProdType = premiumProcessingCharges["priorProdType2"];
   }
 
   for (item in ppFee) {
     if (
       wrkingDayas >= ppFee[item].DeliveryWorkDays &&
       wrkingDayas <= ppFee[item].DeliveryWorkDaysThru && priorProdType == ppFee[item].ProductTypeId
     ) {
       tempNextDay = ppFee[item].ShipMethodDescription;
       tempFeeCent = ppFee[item].FeePercentage;
       if (tempNextDay != "" && tempFeeCent == 0) {
         if (tempNextDay.toLowerCase().includes("next"))
           alertText = CalendarAlerts["NextDayNoFee"];
       }
       if (tempNextDay != "" && tempFeeCent == 0) {
         if (tempNextDay.toLowerCase().includes("second"))
           alertText = CalendarAlerts["SecondDayNoFee"];
       }
     }
   }
 
  // if (alertText != "") {
     localStorage.setItem("calendaralertText", alertText);
  // }
  
 }
 

function shipAlerts_cart(cartItem,prodTypesSA,iscartredirect) {

 // localStorage.removeItem("calendaralertText");
  let deliDate = new Date($("#deliveryDate").val().replace(/-/g, "/")); 
  const today = new Date();
  var d1 = toCSTdate(today);
  var d2 = deliDate ; //toCSTdate(deliDate);
  
  
  let wrkingDayas =
    workingDaysBetweenDates(d1, d2) ;
      
      
  let ppFee = premiumProcessingCharges["FeeData"];
  let alertText = "";
  let priorProdType = premiumProcessingCharges["priorProdType"];
  if(prodTypesSA.length == 1) {
    priorProdType = prodTypesSA[0];
  }else{
    if(!prodTypesSA.includes(priorProdType.toString())) priorProdType = premiumProcessingCharges["priorProdType2"];
  }

  for (item in ppFee) {
    if (
      wrkingDayas >= ppFee[item].DeliveryWorkDays &&
      wrkingDayas <= ppFee[item].DeliveryWorkDaysThru && priorProdType == ppFee[item].ProductTypeId
    ) {
      tempNextDay = ppFee[item].ShipMethodDescription;
      tempFeeCent = ppFee[item].FeePercentage;
      if (tempNextDay != "" && tempFeeCent == 0) {
        if (tempNextDay.toLowerCase().includes("next"))
          alertText = CalendarAlerts["NextDayNoFee"];
      }
      if (tempNextDay != "" && tempFeeCent == 0) {
        if (tempNextDay.toLowerCase().includes("second"))
          alertText = CalendarAlerts["SecondDayNoFee"];
      }
    }
  }

 // if (alertText != "") {
    localStorage.setItem("calendaralertText", alertText);
 // }
  let props = cartItem.properties;
  props["_deliveryDate"] = localStorage.getItem("deliveryDate");//deliDate;
  jQuery.post("/cart/change.js", { quantity: cartItem.quantity, id: cartItem.key, properties:props }).done(function () {
    sessionStorage.setItem("isKlaviyo", "true");
    if(iscartredirect) {window.location.href = "/cart";}
  });
}

$("#enterUploadfile").on("change paste keyup", function() {
  var element = $(this);
 let inputElement=$('.either_grp').find('.pop-chosen-value').find('input').val();
 let isVisible = $('#yourZoom_uploader').is(':visible');
if((inputElement &&  inputElement!='') || (isVisible)){
  popUpdesign('Please remove the Custom Design or Stock Design if you want to add File Name')
   $(this).val(''); 
   $(this).blur();
   return;
 }
  console.log("element", element);
  if($(this).val().trim() === ""){
  $(this).val('');
  $('.showtoggle').css('display','none');

 }
 if ($(this).val().length == 7) {
   $(this).val($(this).val().slice(0, 6));
    $('#error-message').show();
  } else {
    $('#error-message').hide();
  }
  if (element.closest("li").find(".or_clause_text")[0] != undefined) {
    if (element.closest("li").find(".pop-chosen-value.show")[0] != undefined) {
      let ele = element.closest("li").find(".pop-chosen-value.show")[0];
      let eleInput = $(ele).find("input")[0];
      $(ele).removeClass("show");
      $(eleInput).val("");
    }
  }
 
  // if (
  //   $($("#yourZoom_uploader").find(".uploader-preview")[0]).is(":visible")
  // ) {
  //   $("#yourZoom_uploader input").val("");
  //   $("#yourZoom_uploader").find(".uploader-preview").hide();
  // }
  $("#yourZoom_uploader input").val("");
  $("#yourZoom_uploader").hide();
  $("#yourZoom_uploader input").val($(this).val());
  canvasColorization(this);
 
});


$(".dependent-values").on("change paste keyup",'#enterCenterUploadfile', function() {
  let inputElement=$('.dependent-values.show').find('.pop-chosen-value').find('input').val();
  let isVisible = $('.dependent-values.show').find('#yourZoom_centerUploader').is(':visible');
  if((inputElement &&  inputElement!='') || (isVisible)){
  popUpdesign('Please remove the Custom Design or Stock Design if you want to add File Name')
   $(this).val('');
  $(this).blur();
   return;
 }
  if($(this).val().trim() === ""){
  $(this).val('');
 }
  var element = $(this);
  console.log("element", element);
  if ($(this).val().length == 7) {
     $(this).val($(this).val().slice(0, 6));
     $('.dependent-values.show').find('#error-messageCenter').show();
  } else {
     $('.dependent-values.show').find('#error-messageCenter').hide();
  }
  if (element.closest("li").find(".or_clause_text")[0] != undefined) {
    if (element.closest("li").find("#dependent-values-container .pop-chosen-value.show")[0] != undefined) {
      let ele = element.closest("li").find("#dependent-values-container .pop-chosen-value.show")[0];
      let eleInput = $(ele).find("input")[0];
      $(ele).removeClass("show");
      $(eleInput).val("");
    }
  }
 
  $(".dependent-values.show #yourZoom_centerUploader input").val("");
  $(".dependent-values.show #yourZoom_centerUploader").hide();
  // if (
  //   $($(".dependent-values.show #yourZoom_centerUploader").find(".uploader-preview")[0]).is(
  //     ":visible"
  //   )
  // ) {
  //   $(".dependent-values.show #yourZoom_centerUploader input").val("");
  //   $(".dependent-values.show #yourZoom_centerUploader").find(".uploader-preview").hide();
  // }

  $(".dependent-values.show #yourZoom_centerUploader input").val($(this).val());
 
});


     

//   $('#testqq').on("click", function(e) {
   
//    //clean divmessage
//     $('#divmessage').html("");
//     //or use $("#div_main form input") to check all inputs
//     $(".alert_box").each(function() {
//       $(this).css('background-color', '');;
//       if ($(this).val().replace(/\s+/g, " ").trim() == '') {
//         $(this).css('background-color', '#ffffad');
//         success = false;
//         $('#divmessage').html("please fill the required fileds " )
//         window.location.reload();
        
//       }
//     });
//     e.preventDefault();
//   });

function dis_image_enlarge(imgsrc,imgname) {
  var ttet = imgname;
  var result = ttet.includes("'") ? "Yes" : "No";
  console.log(result,'result');
  $('#img_enlargeImage').attr("src", imgsrc);
  
  console.log(imgsrc,'imgsrc ');
 //$('#img_enlargeImage_p').attr("value", imgname);
 $("#img_enlargeImage_p").html( imgname);
 console.log(imgname,'imgname');
}
var inputQuantity = [];
$(function() {     
  $(".q_number").on("keyup", function (e) {
    var $field = $(this),
        val=this.value,
        $thisIndex=parseInt($field.data("idx"),10); 
    if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid") ) {
        this.value = inputQuantity[$thisIndex];
        return;
    } 
    if (val.length > Number($field.attr("maxlength"))) {
      val=val.slice(0, 5);
      $field.val(val);
    }
    inputQuantity[$thisIndex]=val;
  });      
});
function validatedelivery()
{
  const deliveryDate = localStorage.getItem("deliveryDate"); // $("#deliveryDate").val().replace(/-/g, "/"); //localStorage.getItem("deliveryDate") ;// $("#deliveryDate").val();
  let delAddTime = localStorage.getItem("delAddTime");
  if (
    deliveryDate == "" ||
    deliveryDate == undefined ||
    deliveryDate == "Invalid Date" ||
    deliveryDate == null
  ) {
 
    // datesAvailable = false;
    // $("#deliveryDate")
    //   .removeClass("input-error")
    //   .addClass("input-error")
    //   .focus();
  } else {
    if (new Date().toLocaleDateString() != delAddTime) {
      document.getElementById("loaderbg").style.display = "block";     
      document.getElementById('calendaralerts').style.display = 'none';
      

fetch("/cart.js")
.then((response) => response.json())
.then((data) => {

  let ppCartId = 0;     

  let ppCart = data.items.filter(function (item) {
    return item.title.includes("Premium Processing");
  }); 

  if (ppCart.length > 0) {
    ppCartId = ppCart[0].id;
  }
  if(ppCartId > 0) {
   jQuery.post("/cart/change.js", { quantity: 0, id: ppCartId }).done(function () {
    // window.location.href = "/cart";
    $(".card__section").load(location.href + " .card__section");
    
   });
  }
  setTimeout(()=>{
    document.getElementById("loaderbg").style.display = "none";
    $("#deliveryDate").val('');
      datesAvailable = false;
      $("#deliveryDate")
      .removeClass("input-error")
      .addClass("input-error")
      .focus();
  },3000)
  

});

      return false;
     }
    
  }

}


function preCheckoutAction(_this){
  let notifyMessage = '';
  if ($('.btn_cart_PC').length > 0) {
    let rawMessage = $(_this).attr('data-alertmessage');
    if (rawMessage) {
      notifyMessage += $('<div>').html(rawMessage).text().trim();
    }
  }
  if ($('.notification-printonback').length > 0) {
    let unavailableMsg = $(_this).attr('data-unavailoptionidsmsg');
    if (unavailableMsg) {
      if (notifyMessage !== '') {
        notifyMessage += '\n\n';
      }
      notifyMessage += $('<div>').html(unavailableMsg).text().trim();
    }
  }
  if (notifyMessage !== '') {
    alert(notifyMessage);
    return false;
  }

  $("#eventDate").removeClass("input-error");
  $("#deliveryDate").removeClass("input-error");
  $("#address-type").removeClass("input-error");
  $("#ordered-before").removeClass("input-error");
  $("#previously-delivered").removeClass("input-error");
  $("#name").removeClass("input-error");
  $("#phone").removeClass("input-error");

  const deliveryDate = getSelectedDeliveryDateValue();

  if (
    deliveryDate == "" ||
    deliveryDate == undefined ||
    deliveryDate == "Invalid Date" ||
    deliveryDate == null
  ) {
    $("#deliveryDate")
      .removeClass("input-error")
      .addClass("input-error")
      .focus();
    outer_click_notHide_Modal_alert();
    return false;
  }

  var loaderEl = document.getElementById("loaderbg");
  if (loaderEl) {
    loaderEl.style.display = "block";
  }

  setTimeout(function () {
    Promise.all([
      fetch("/cart.js").then(function (response) {
        return response.json();
      }),
      refreshShipCalendarSettings(),
    ])
      .then(function (results) {
        var data = results[0];
        var currentHasOnlyStock = resolveHasOnlyStockFromCart(data);
        hasOnlyStock = currentHasOnlyStock;

        if (logCheckoutCutoffDebug(deliveryDate, currentHasOnlyStock)) {
          $("#deliveryDate")
            .removeClass("input-error")
            .addClass("input-error")
            .focus();
          showInvalidDeliveryCutoffModal();
          return;
        }

        proceedPreCheckoutAction(_this, deliveryDate);
      })
      .catch(function () {
        if (logCheckoutCutoffDebug(deliveryDate, hasOnlyStock)) {
          $("#deliveryDate")
            .removeClass("input-error")
            .addClass("input-error")
            .focus();
          showInvalidDeliveryCutoffModal();
          return;
        }

        proceedPreCheckoutAction(_this, deliveryDate);
      });
  }, 3000);

  return false;
}

function proceedPreCheckoutAction(_this, deliveryDate) {
  const btnText = $(_this).text();
  let datesAvailable = true;
  const eventDate = $("#eventDate").val();
  let delAddTime = localStorage.getItem("delAddTime");
  const shippingOrDelivery = $("#address-type").val();
  const orderedBefore = $("#ordered-before").val();
  const previouslyDelivered = $("#previously-delivered").val();
  const cName = $("#name").val();
  const cPhone = $("#phone").val();

  if (new Date().toLocaleDateString() != delAddTime) {
    $("#deliveryDate").val("");
    datesAvailable = false;
    $("#deliveryDate")
      .removeClass("input-error")
      .addClass("input-error")
      .focus();

    return false;
  }
  if (
    shippingOrDelivery == "Select" ||
    shippingOrDelivery == "" ||
    shippingOrDelivery == undefined ||
    shippingOrDelivery == null
  ) {
 
    datesAvailable = false;
    //       $("#address-type")
    //         .removeClass("input-error")
    //         .addClass("input-error")
    //         .focus();
    $("#address-type").each(function () {
      $(this).css("background-color", "");
      if ($(this).val().replace(/\s+/g, " ").trim() == "") {
        $(this).css("background-color", "#ffffad");
        //         $(this).css('border', '1px solid red');
        success = false;
        $("#divmessage").html("please fill the required fileds ");
      }
    });

  }
  if (
    orderedBefore == "Select" ||
    orderedBefore == "" ||
    orderedBefore == undefined ||
    orderedBefore == null
  ) {
  
    datesAvailable = false;
    $("#ordered-before").each(function () {
      $(this).css("background-color", "");
      if ($(this).val().replace(/\s+/g, " ").trim() == "") {
        $(this).css("background-color", "#ffffad");
        success = false;
        $("#divmessage").html("please fill the required fileds ");
      }
    });
   
  }

  if (
    previouslyDelivered == "Select" ||
    previouslyDelivered == "" ||
    previouslyDelivered == undefined ||
    previouslyDelivered == null
  ) {
   
    datesAvailable = false;
    $("#previously-delivered").each(function () {
      $(this).css("background-color", "");
      if ($(this).val().replace(/\s+/g, " ").trim() == "") {
        $(this).css("background-color", "#ffffad");
        success = false;
        $("#divmessage").html("please fill the required fileds ");
      }
    });

  } 

  if (  
    cName == "" ||
    cName == undefined ||
    cName == null
  ) {
   
    datesAvailable = false;
    $("#name").each(function () {
      $(this).css("background-color", "");
      if ($(this).val().replace(/\s+/g, " ").trim() == "") {
        $(this).css("background-color", "#ffffad");
        success = false;
        $("#divmessage").html("please fill the required fileds ");
      }
    });

  } 

  if (  
    cPhone == "" ||
    cPhone == undefined ||
    cPhone == null
  ) {
   
    datesAvailable = false;
    $("#phone").each(function () {
      $(this).css("background-color", "");
       if ($(this).val().replace(/\s+/g, " ").trim() == "") {
       
        $(this).css("background-color", "#ffffad");
        success = false;
        console.log(' $("#divmessage")', $("#divmessage")[0])
        $("#divmessage").html("please fill the required fileds ");
      }
    });

  } 

  if (datesAvailable === true) {
     $("#divmessage").css("display", "none");
    // $(_this).text("ðŸ—˜");
       $(_this).text("âŸ²");
       $(_this).css('font-size','32px')
       document.getElementById("loaderbg").style.display = "block";
    if (cartDetailsCopied === false) {
      cartDetailsCopied = true;
    }
    
    var cartContents = fetch("/cart.js")
      .then((response) => response.json())
      .then((data) => {
        let props = {};
        console.log('cartAttri',data)

        if (data.items[0].properties) {
          props = data.items[0].properties;
          
          props["_deliveryDate"] = deliveryDate;          

        } else {
          props["_deliveryDate"] = deliveryDate;
        
        }
         
        jQuery
          .post("/cart/change.js", {
            id: data.items[0].key,
            quantity:data.items[0].quantity,
            properties: props,
          })
          .done(function () {
            //$(".cart-recap__checkout")[0].click();
            let prop = {};
            let _sa = $("#some-id_ship").serializeArray();
            $(_sa).each((index, element) => {
              prop[element["name"]] = element["value"];
            });
            _sa = $(".cart__additional-details").serializeArray();

            $(_sa).each((index, element) => {
              prop[element["name"]] = element["value"];
            });
            let _aa = $(".cart-recap").serializeArray();
            $(_aa).each((index, element) => {
            prop[element["name"]] = element["value"];
            });
            $.post("cart/update.js", { attributes: prop })
            .then(async () => {
  
              try {
          
                let setupIds = [];
                let removeKeys = new Set();
                let hasChanges = false;
                let changed = false;
                let isextraSetup = false;
          
                //  collect setupIds
                data.items.forEach(item => {
                  if (item.product_type == "HiddenCharges" && item.properties?.ChargeType == "Setup Charge") {
                    setupIds.push(item.properties._hopsUId);
                  }
                });
          
                //  FIRST LOOP
                for (const item of data.items) {
          
                  if (item.product_type === "HiddenCharges" && item.properties?.ChargeType === "Setup Charge") {
                    let hopsUId = item.properties?._hopsUId;
          
                    let relatedProduct = data.items.find(i =>
                      i.product_type !== "HiddenCharges" &&
                      i.properties?._hopsUId === hopsUId
                    );
          
                    if (!relatedProduct) {
                      hasChanges = true;
                      isextraSetup = true;
                    }
                  }
          
                  if (item.product_type === "HiddenCharges" || item.properties?.Variation) continue;
          
                  let proSubType = cart_validateSetupCharge(item);
                  let hopsUId = item.properties?._hopsUId;
                  if (!hopsUId) continue;
          
                  let currentSubtype = item.properties?._productSubType;
                  let setupExists = setupIds.includes(hopsUId);
          
                  if (proSubType && currentSubtype !== proSubType) hasChanges = true;
                  if (!proSubType && currentSubtype !== undefined) hasChanges = true;
                  if (proSubType && !setupExists) hasChanges = true;
                  if (!proSubType && setupExists) hasChanges = true;
                }
          
                if (!hasChanges) {
                  $(".cart-recap__checkout")[0]?.click();
                  return;
                }
          
                //  SECOND LOOP
                for (const item of data.items) {
          
                  //  orphan remove
                  if (item.product_type === "HiddenCharges" && item.properties?.ChargeType === "Setup Charge" && isextraSetup) {
          
                    let hopsUId = item.properties?._hopsUId;
          
                    let relatedProduct = data.items.find(i =>
                      i.product_type !== "HiddenCharges" &&
                      i.properties?._hopsUId === hopsUId
                    );
          
                    if (!relatedProduct && !removeKeys.has(item.key)) {
          
                      removeKeys.add(item.key);
          
                      await fetch('/cart/change.js', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: item.key, quantity: 0 })
                      });
          
                      changed = true;
          
                      await new Promise(r => setTimeout(r, 100));
                    }
                  }
          
                  if (item.product_type === "HiddenCharges") continue;
          
                  let proSubType = cart_validateSetupCharge(item);
                  let hopsUId = item.properties?._hopsUId;
                  if (!hopsUId) continue;
          
                  let currentSubtype = item.properties?._productSubType;
          
                  //  UPDATE
                  if (proSubType && currentSubtype !== proSubType) {
          
                    let newProps = { ...item.properties, _productSubType: proSubType };
          
                    await fetch('/cart/change.js', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: item.key,
                        quantity: item.quantity,
                        properties: newProps
                      })
                    });
          
                    changed = true;
                    await new Promise(r => setTimeout(r, 100));
                  }
          
                  //  REMOVE subtype
                  if (!proSubType && currentSubtype !== undefined) {
          
                    let newProps = { ...item.properties };
                    delete newProps._productSubType;
          
                    await fetch('/cart/change.js', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: item.key,
                        quantity: item.quantity,
                        properties: newProps
                      })
                    });
          
                    changed = true;
                    await new Promise(r => setTimeout(r, 100));
                  }
                  if (item.product_type === "HiddenCharges" || item.properties?.Variation) continue;
                  let totalQty = data.items
                    .filter(ci => ci.properties?._hopsUId === hopsUId && ci.product_type !== "HiddenCharges")
                    .reduce((sum, ci) => sum + ci.quantity, 0);
          
                  //  ADD
                  if (proSubType && !setupIds.includes(hopsUId)) {
          
                    let itemToAdd = buildSetupChargeItem(item, totalQty, proSubType);
          
                    if (itemToAdd) {
                      await fetch("/cart/add.js", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ items: [itemToAdd] })
                      });
          
                     // setupIds.push(hopsUId);
                      changed = true;
          
                      await new Promise(r => setTimeout(r, 100));
                    }
                  }
          
                  //  REMOVE
                  if (!proSubType && setupIds.includes(hopsUId)) {
          
                    for (const ci of data.items) {
                      if (
                        ci.properties?._hopsUId === hopsUId &&
                        ci.product_type === "HiddenCharges" &&
                        ci.properties?.ChargeType === "Setup Charge"
                      ) {
          
                        if (!removeKeys.has(ci.key)) {
          
                          removeKeys.add(ci.key);
          
                          await fetch('/cart/change.js', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: ci.key, quantity: 0 })
                          });
          
                          changed = true;
          
                          await new Promise(r => setTimeout(r, 100));
                        }
                      }
                    }
                  }
                }
          
                if (!changed) {
                  $(".cart-recap__checkout")[0]?.click();
                  return;
                }
          
                // MOA + PP
                await new Promise(r => setTimeout(r, 100));
          
                let updatedCart = await fetch("/cart.js").then(r => r.json());
          
                try {
                  await Cart_CartMOA(minLimits, moaAmnts, updatedCart);
                } catch(e) {
                  console.error("MOA failed", e);
                }          
                try {
                  updatedCart = await fetch("/cart.js").then(r => r.json());
                  await calculatePremiumProcessing(false);
                } catch(e) {
                  console.error("PP failed", e);
                }
          
                await new Promise(r => setTimeout(r, 100));
          
                await showAutoPopup(updatedCart);
          
                // $(".cart-recap__checkout")[0]?.click();
          
              } catch (err) {
                console.error("Checkout error:", err);
                $(".cart-recap__checkout")[0]?.click();
              }
          
            })
          
            .then(() => {
              $(".cart-recap__checkout")[0]?.click();
            }) 
          }).fail((data) => {
                $(_this).text(btnText);                
                document.getElementById("loaderbg").style.display = "none";
          });
      });
  } else {
    var loaderEl = document.getElementById("loaderbg");
    if (loaderEl) {
      loaderEl.style.display = "none";
    }
    return false;
  }


}

function eitherOrValidation(_this,type){
  console.log('this',_this.id)
  if(type == 'input'){
   let _id = _this.id.replace('ExtraField','');
   console.log('select',$('#'+_id).val())
   $('#'+_id).val('');
   
  }else{
    let _id = _this.id + 'ExtraField';
    console.log('input',$('#'+_id).val())
    $('#'+_id).val('');
  }
 
}
function validate_Extrainputtext_ontype(element) { 
        let optionId = $(element).closest("li").data("optionId");
        
        optionVal = $(element).val();
        let lengthAllowed = $(element).data("optionDisplay");    
        if (!lengthAllowed) return;
        if (
          !isNaN(Number(lengthAllowed)) &&
          Number(lengthAllowed) != undefined &&
          Number(lengthAllowed) != ""
        ) {
          lengthAllowed = Number(lengthAllowed);
        } else {
          lengthAllowed = 12;
        }
        console.log(lengthAllowed,'lengthAllowed');
        label = $(element).closest("li").find("label").html();
        
        if (!optionVal) {
          $(".error." + optionId)
            .html("Please choose the option " + label)
            .show();
          errorAvailable = true;
        } else {
          $(".error." + optionId).hide();
        }
        //alert('www');
       
        if (optionVal.toString().length == lengthAllowed ) {
          event.stopPropagation();
          event.preventDefault();
         // alert('set');
          $(".error." + optionId)
            .html(
              "A maximum of " +
                lengthAllowed +
                " characters are allowed in the option " +
                label
            )
            .show();
          errorAvailable = true;
          
        } else {
          $(".error." + optionId).hide();
        }
 }

// UPLOADER  
//uploadclick


$(".dependent-values").on("click","#uploadclick",function () {
  if(!_isCanvasEnabled){
    $(".UploadDesignNotes").css('display','none');
  }
 let inputElement= $('.dependent-values.show').find('.pop-chosen-value').find('input').val();
 let fileName=$('.dependent-values.show').find('#enterCenterUploadfile').val();
  if((inputElement && inputElement !== '') || (fileName && fileName !== '')) {
    popUpdesign('Please remove the Stock Design or File Name if you want to add Custom Design')
    return;
  }
  $("#but_upload_ok").attr("data-clickfrom", "uploadclick");
  populateContainer(); 
  $('#but_upload_ok').removeClass('loading');
  document.getElementById("formupload").style.display = "block";
});

$("#uploadclick_seq").click(function () {
  if (!_isCanvasEnabled) {
    $(".UploadDesignNotes").css('display','none');
  }
const inputElement=$('.either_grp').find('.pop-chosen-value').find('input').val();
let fileName=$("#enterUploadfile").val();
if ((inputElement && inputElement !== '') || (fileName && fileName !== '')) {
  popUpdesign('Please remove the Stock Design or File Name if you want to add Custom Design')
  return;
}

  $("#but_upload_ok").attr("data-clickfrom", "uploadclick_seq");
  populateContainer(); 
  $('#but_upload_ok').removeClass('loading');
  document.getElementById("formupload").style.display = "block";
});

function Form_upload_close() {
 document.getElementById("formupload").style.display = "none";  
 $("#file1").val('').change();
 $('#but_upload_ok').html('Ok');
 $("#but_upload_ok").prop("disabled",false);
 document.getElementById('err').style.display='none';
 document.getElementById('fileerr').style.display='none';
   error_close();
 $('#but_upload_ok').removeClass('loading');
}
function error_close(){
  document.getElementById('error').style.display='none';
  document.getElementById('errorcls').style.display='none';

}
function hideElementsCenter(){

  var element = $("#enterCenterUploadfile");

  $(".dependent-values.show #enterCenterUploadfile").val("");
  if (element.closest("li").find(".or_clause_text")[0] != undefined) {
    
    if (
      element
        .closest("li")
        .find("#dependent-values-container .pop-chosen-value.show")[0] !=
      undefined
    ) {
      
      let ele = element
        .closest("li")
        .find("#dependent-values-container .pop-chosen-value.show")[0];
      let eleInput = $(ele).find("input")[0];
      $(ele).removeClass("show");
      $(eleInput).val("");
    }
  }

}

function hideElements(){

  var element = $("#enterUploadfile");
  
  $("#enterUploadfile").val("");
  if (element.closest("li").find(".or_clause_text")[0] != undefined) {
    if (element.closest("li").find(".pop-chosen-value.show")[0] != undefined) {
      let ele = element.closest("li").find(".pop-chosen-value.show")[0];
      let eleInput = $(ele).find("input")[0];
      $(ele).removeClass("show");
      $(eleInput).val("");
    }
  }

}

function hasSpecialChars(filename) {
  const specialCharPattern = /[!@#$%^&+*~`(),?'':{}|<>]/;
  if (specialCharPattern.test(filename)) {
    document.getElementById('fileerr').style.display = 'block';
    return true; // Indicate that special characters were found
  }
  return false; // Indicate that no special characters were found
}

function blobUpload() {
const preLoader = document.getElementById('preloader');
var file = $('#file1')[0].files[0]
if(file == undefined)
{
  var selUrl = $(".containerupload ").find(".selectedImg").attr("data-value");
  if(!selUrl){
    document.getElementById('err').style.display='block';
   
    // $('.child1').append('<p id="err" style="color: red;font-size: 11px;position: absolute;top: 32%;">* You did not select a file to upload</p>');
    return false;
  }
  const selUrlfileName = selUrl.substring(selUrl.lastIndexOf('/') + 1);
 if (hasSpecialChars(selUrlfileName)) {
  return false; // Stop further execution if special characters are found
  }
 
  var refcode = $(".containerupload ").find(".selectedImg").data("refcode");
  var filename = $(".containerupload ").find(".selectedImg").attr("alt");
  var extension = selUrl.split(/[#?]/)[0].split('.').pop().trim();
  extension = 0+extension;
  if($("#but_upload_ok").attr("data-clickfrom")=="uploadclick"){
    hideElementsCenter()
    // $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("src", selUrl);
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").attr("src", selUrl);
    $('.dependent-values.show #uploadclick').val('Change Your Design');
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").css('display','none');
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").show();
    if (_previwIcon[extension]) {
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").attr("src",_previwIcon[extension] );
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").css('display','none');
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").css('display','block');
    } else {
      $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").attr("src", selUrl);
    }
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("alt", filename);
    $(".dependent-values.show #yourZoom_centerUploader .filename").text(filename.toUpperCase());
    $(".dependent-values.show #yourZoom_centerUploader .filename").attr("data-refcode",refcode);
    $(".dependent-values.show #yourZoom_centerUploader input").val(filename.toUpperCase());
    $(".dependent-values.show #yourZoom_centerUploader input").trigger('change');
    $(".dependent-values.show #yourZoom_centerUploader").attr("data-uploader-ref", filename);
    $(".dependent-values.show #yourZoom_centerUploader").show(); 
   //$("#yourZoom_centerUploader").show(); 
  }else{
    hideElements();    
    // $("#yourZoom_uploader .uploader-preview img").attr("src", selUrl);
    $(" #yourZoom_uploader .uploader-preview img:first").attr("src", selUrl);
    $(" #yourZoom_uploader .uploader-preview #preview").css('display','none');
    $(" #yourZoom_uploader .uploader-preview img:first").show();
    if (_previwIcon[extension]) {
    $("#yourZoom_uploader .uploader-preview #preview").attr("src",_previwIcon[extension] );
    $(" #yourZoom_uploader .uploader-preview img:first").css('display','none');
    $(" #yourZoom_uploader .uploader-preview #preview").css('display','block');
    }else {
      $("#yourZoom_uploader .uploader-preview #preview").attr("src", selUrl);
    }
    $("#yourZoom_uploader .uploader-preview img").attr("alt", filename);
    $("#yourZoom_uploader .filename").text(filename.toUpperCase());
    $("#yourZoom_uploader .filename").attr("data-refcode",refcode);
    $("#yourZoom_uploader input").val(filename.toUpperCase());
    $('#uploadclick_seq').val('Change Your Design');
    $("#yourZoom_uploader").attr("data-uploader-ref", filename);
    $("#yourZoom_uploader input").trigger('change')
    $("#yourZoom_uploader").show(); 
  }
 
  Form_upload_close();
  return;
}
if (hasSpecialChars(file.name)) {
  return false; // Stop further execution if special characters are found
}
let allImages = ['.png','.jpg','.jpeg','.gif','.tiff','.jfif','.svg','.pdf','.ai','.csv','.xls','.xlsx','.eps','.psd','.txt','.doc'];
let filein =file.name.substring(file.name.lastIndexOf('.'))
if (allImages.includes(filein.toLowerCase())== false) {
  document.getElementById('error').style.display='block';
  document.getElementById('errorcls').style.display='block';

  return false
}
$("#but_upload_ok").prop("disabled",true);
$('#but_upload_ok').html('Uploading');
$('#but_upload_ok').addClass('loading');


console.log('file', file)
var form = new FormData();
form.append("formFile", file, file.name);
form.append("customerName", _customerName);
form.append("email", _email);  
form.append("productNumber", hopsProdId);

var settings = {
    "url": "https://hops-connect.dev.hodgesbadge.com/api/CustomDesign/CreateCustomDesign",
    "method": "POST",
    "timeout": 0,  
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
};
 
$.ajax(settings).done(function (response) {
    var newArr = JSON.parse(window.localStorage.getItem('myArr'));
    let obj = JSON.parse(response);
    newArr.push(obj);
    window.localStorage.setItem('myArr', JSON.stringify(newArr));
    var filename = obj.fileName;
    var extension = obj.imageUrl.split(/[#?]/)[0].split('.').pop().trim();
    extension = 0+extension;
    if($("#but_upload_ok").attr("data-clickfrom")=="uploadclick"){
      hideElementsCenter()
      // $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("src", obj.imageUrl);
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").attr("src", obj.imageUrl);
    $('.dependent-values.show #uploadclick').val('Change Your Design');
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").css('display','none');
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").show();
    if (_previwIcon[extension]) {
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").attr("src",_previwIcon[extension] );
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img:first").css('display','none');
    $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").css('display','block');
    } else {
      $(".dependent-values.show #yourZoom_centerUploader .uploader-preview #preview").attr("src", obj.imageUrl);
    }
      $(".dependent-values.show #yourZoom_centerUploader .uploader-preview img").attr("alt", filename);
      $(".dependent-values.show #yourZoom_centerUploader .filename").attr("data-refcode",obj.id);
      $(".dependent-values.show #yourZoom_centerUploader .filename").text(filename.toUpperCase());
      $(".dependent-values.show #yourZoom_centerUploader input").val(filename.toUpperCase());
      $(".dependent-values.show #yourZoom_centerUploader input").trigger('change');
      $(".dependent-values.show #yourZoom_centerUploader").attr("data-uploader-ref", filename);
      $(".dependent-values.show #yourZoom_centerUploader").show();
     //$("#yourZoom_centerUploader").show(); 
    }else{
    hideElements();    
    // $("#yourZoom_uploader .uploader-preview img").attr("src", response);
    $(" #yourZoom_uploader .uploader-preview img:first").attr("src", obj.imageUrl);
    $("#yourZoom_uploader .uploader-preview #preview").css('display','none');
    $(" #yourZoom_uploader .uploader-preview img:first").show();
    if (_previwIcon[extension]) {
    $(" #yourZoom_uploader .uploader-preview #preview").attr("src",_previwIcon[extension] );
    $(" #yourZoom_uploader .uploader-preview img:first").css('display','none');
    $(" #yourZoom_uploader .uploader-preview #preview").css('display','block');
    }else {
      $("#yourZoom_uploader .uploader-preview #preview").attr("src", obj.imageUrl);
    }
    $("#yourZoom_uploader .uploader-preview img").attr("alt", filename);
    $("#yourZoom_uploader .filename").attr("data-refcode",obj.id);
    $("#yourZoom_uploader .filename").text(filename.toUpperCase());
    $("#yourZoom_uploader input").val(filename.toUpperCase());
    $('#uploadclick_seq').val('Change Your Design');
    $("#yourZoom_uploader input").trigger('change')
    $("#yourZoom_uploader").attr("data-uploader-ref", filename);
    $("#yourZoom_uploader").show(); 
    }
    Form_upload_close();
});
}    

$("#file1").on("change", function (e) {
  document.getElementById('err').style.display='none';
  document.getElementById('fileerr').style.display='none';
 var previews = $("#previews");
   var prevSel = $(".containerupload ").find(".selectedImg");  
   if (prevSel.length > 0) $(prevSel).removeClass("selectedImg");
  previews.empty();
  Array.prototype.slice.call(e.target.files)
    .forEach(function (file, idx) {
      let extension =file.name.substring(file.name.lastIndexOf('.')+1);
      extension = 0+extension;
      let _src ;
      var reader = new FileReader();
      reader.onload = function (event) {
        if(_previwIcon[extension]){
          _src = _previwIcon[extension]; 
        }else{
          _src = event.target.result;
        }
        $("<span />", {
          // "html": "<br />" + file.name
        }).add("<br />")
          .add(
            $("<img  />", {
              "src":_src,
              "class": idx,
              "style": "max-height: 200px"
            })).add($("<p></p>",{
              "id":'fileName',
              "style":"font-size:12px"
            }).text(file.name)).appendTo(previews);
      };
      reader.readAsDataURL(file);
    });
});

$("#upfile1").click(function () {   
  $("#file1").trigger('click');
});

function populateContainer() {
var newArr = JSON.parse(window.localStorage.getItem('myArr'));
var arr = [];

if(newArr == null) window.localStorage.setItem('myArr', JSON.stringify(arr));
var settings = {
    url:
    "https://hops-connect.dev.hodgesbadge.com/api/CustomDesign/GetCustomeDesignDestailsByEmail?email="+ _email,
    method: "GET",
    timeout: 0,
};

$.ajax(settings).done(function (response) {
    
    response.forEach(function(item){
    console.log('blobImages',item);
    var filename = item.fileName;
    var extension = item.imageUrl.split(/[#?]/)[0].split('.').pop().trim();
    extension = 0+extension;
    // $('.containerupload').append('<img class="getImg" onclick="selectedImg(this)"  alt="' + filename + '" src="' +item.imageUrl + '" />'); 
    if(_previwIcon[extension])
    {
    $('.containerupload').append('<figure><img class="getImg" onclick="selectedImg(this)"  alt="' + filename + '" src="' +_previwIcon[extension] + '" data-value="'+item.imageUrl+'" data-refcode="'+item.id+'" /><figcaption id="fileName">'+filename+'<figcaption></figure>');

    }
      else{
    $('.containerupload').append('<figure><img class="getImg" onclick="selectedImg(this)"  alt="' + filename + '" src="' +item.imageUrl + '" data-value="'+item.imageUrl+'" data-refcode="'+item.id+'" /><figcaption id="fileName">'+filename+'<figcaption></figure>');
    }
    })

});

$('.containerupload').html('');
if(newArr){
for (var i = 0, len = newArr.length; i < len; i++) {
  var filename = newArr[i].fileName;
  var extension = newArr[i].imageUrl.split(/[#?]/)[0].split('.').pop().trim();
  extension = 0+extension;
    // $('.containerupload').append('<img class="getImg" onclick="selectedImg(this)"  alt ="'+filename+'" src="' +newArr[i] + '" />'); 
  if(_previwIcon[extension])
    {
       $('.containerupload').append('<figure><img class="getImg" onclick="selectedImg(this)"  alt ="' +filename + '" src="' +_previwIcon[extension]+ '" data-value="'+newArr[i].imageUrl+'" data-refcode="'+newArr[i].id+'" /><figcaption id="fileName">'+filename+'<figcaption></figure>');
    }else{
      $('.containerupload').append('<figure><img class="getImg" onclick="selectedImg(this)"  alt ="' +filename + '" src="' +newArr[i].imageUrl + '" data-value="'+newArr[i].imageUrl+'" data-refcode="'+newArr[i].id+'" /><figcaption id="fileName">'+filename+'<figcaption></figure>'); 
      }
}  
  }
} 


function selectedImg(_this) {
  $("#file1").val('').change();
 var prevSel = $(_this).parent().find(".selectedImg");

   if (prevSel.length > 0) $(prevSel).removeClass("selectedImg");
  _this.classList.add("selectedImg");
   var previews = $("#previews");
   previews.empty();
  $("<span />", {
          // "html": "<br />" + file.name
        }).add("<br />")
          .add(
            $("<img />", {
              "src": _this.src,
              "style": "max-height: 200px"
            })).add($("<p></p>",{
              "id":'fileName',
              "style":"font-size:12px"
            }).text(_this.alt)).appendTo(previews);
}
// design alert popup
function removeclick() {
  $('#design_alert img').attr('src',_designSrc);
  $('#design_alert').css('display','block');
}
function removecancel(){
  $('#design_alert').css('display','none');
  $('#design_alerts').css('display','none');
  $('.showtoggle').css('display','none');

  return false 
}
function checkdesign(){
  $('#design_alerts').css('display','none');
}
function removevalue(){
  if(_designAlert){
    const optionId = $(_designAlert).parent().data("optionId");
    let control = $("#" + optionId + "_dn");
    if (control[0] == undefined) control = $("#" + optionId + "_id");
    if (control[0] != undefined) {
      control = control[0].selectize;
      if (control) control.clear();
    }
  
    $("#" + optionId + "_btn").val("Select a Stock Design");
    $(_designAlert).siblings('img').attr('src', '');
    $(_designAlert).siblings().val("").trigger("change");
    
  
    $(_designAlert).parent().removeClass("show");
  }
   $(".stock-popup").attr("src", "");
   $("#newcustomImg").attr("src", "");
   $(".filename_newcustom").text("");
  $("#uploadclick_seq").val("Upload Your Design");
  $("#yourZoom_uploader input").val("");
  $("#yourZoom_uploader").hide();
  $('#design_alert').css('display','none');
  _designAlert=''; 
  $('.custom_ui').css('display', 'block');
  $('.new_custom').css('display', 'none');
  $("#yourZoom_uploader input").trigger('change')
  $('.showtoggle').css('display','none');
}


function cartalert() {
  $('#design_cart_alert').css('display','block');
}
function cartalertremove(){
  $('#design_cart_alert').css('display','none');
  alertq = true;
}
async function cartalert_yes(){
  $('#design_cart_alert').css('display','none');
  validateprintOnBackLines(true);
  $(".fa-spin").show();
  if(_isCanvasEnabled){
    document.getElementById("cart-page").style.display = "block";
  }
  else{
    document.getElementById("loaderbg").style.display = "block";
  }
  console.time("time")
  let cartLineItemAvailable = checkOrderLineItemAvailable1();
  if (_isCanvasEnabled) {
    await download()
  }
  if (cartLineItemAvailable == false) {
    cartCheck_addtoCart(
      prodId,
      prodType,
      minLimits,
      moaAmnts,
      flatCharges,
      hopsProdId
    );
  } else {
    removeExistingItemOnEdit(cartLineItemAvailable);
  }
}
function validate_design(){
  let custom,designfile,stock;
  $("#sortableoptions li.eitheror-group > div.content_comes_here").each(
    (index, element) => {
      
      switch ($(element).data("type")) {
        case "input-file":
          $(element).children();
         custom = $(element).find("#yourZoom_uploader input").val();
         designfile = $(element).find("#enterUploadfile ").val();
          break;
        case "popup":
         stock =  $(element).find(".pop-chosen-value input").val();
          break;
       } 
})
if($("#sortableoptions li.eitheror-group > div.content_comes_here").length){
if (!custom && !designfile && !stock) {
    cartalert();
    return false
}
}
  return true

}
//custom ride number
$(".Set_Num").on("change", function () {
  let end = $(".End").find(":selected").text();
  let start = $(".Start").find(":selected").text().split('-')[0];
  let set = $(this).val().split('_')[1];
  if (Number(start) && Number(end) && Number(set)) {
    let range = Number(start.split('-')[0]) - Number(end);
    let qty = (Math.abs(range) + 1) * set
    $('#varQty').val(Math.abs(qty))
  }else{
    $(`#varQty`).val(0);
  }
})
$(".End").on("change", function () {
  let end = $(this).find(":selected").text();
  let start = $(".Start").find(":selected").text().split('-')[0];
  let set = $('.Set_Num').val().split('_')[1];
    if (Number(start) > Number(end)) {
      $('.error-message').remove();
      $('.End').after('<span class="error-message" style="color: red; font-size: 12px; margin-left: 5px;">Please select a valid starting and ending number</span>');
      $(`#varQty`).val(0);
      start=$(`.End option`).prop('selected',function(){
        return this.defaultSelected;
      });
    } else if (Number(start) && Number(end) && Number(set)) {
      $('.error-message').remove();
      let range = Number(start.split('-')[0]) - Number(end);
      let qty = (Math.abs(range) + 1) * set
      $('#varQty').val(Math.abs(qty))
    }else{
        $(`#varQty`).val(0);
        $('.error-message').remove();
    }
})
$(".Start").on("change", function () {
  let end = $(".End").find(":selected").text();
  let start = $(this).find(":selected").text().split('-')[0];
  let set = $('.Set_Num').val().split('_')[1];
    $(`#varQty`).val(0);
    if (Number(start) > Number(end)) {
      $('.error-message').remove();
      $('.Start').after('<span class="error-message" style="color: red; font-size: 12px; margin-left: 5px;">Please select a valid starting and ending number</span>');
      start=$(`.Start option`).prop('selected',function(){
        $(`#varQty`).val(0);
        return this.defaultSelected;
      });
    }else if (Number(start) && Number(end) && Number(set)) {
      $('.error-message').remove();
      let range = Number(start.split('-')[0]) - Number(end);
      let qty = (Math.abs(range) + 1) * set
      $('#varQty').val(Math.abs(qty))
    }else{
        $(`#varQty`).val(0);
        $('.error-message').remove();
    }
})

//variation
function stockCustomRiderVariant(element) {
  let variantId = element.id;
  let varId = element.id.split('_v')[1];
  let start = $(`.Start_${varId}`).find(':selected').text().split("-")[0];
  let end = $(`.End_${varId}`).find(':selected').text();
  let set = $(`.Set_Num_${varId}`).val().split('_')[1];
  if (Number(start) && Number(end)) {
    if (Number(start) > Number(end)) {
      $('.error-message').remove();
        $(`#${variantId}`).after('<span class="error-message" style="color: red; font-size: 12px; margin-left: 5px;">Please select a valid starting and ending number</span>');
        start=$(`#${variantId} option`).prop('selected',function(){
          $(`#varQty${varId}`).val(0);
          return this.defaultSelected;
        });
  }else{
    $('.error-message').remove();
  }
}
  if (Number(start) && Number(end) && Number(set)) {
  let range = Number(start.split('-')[0]) - Number(end);
  let qty = (Math.abs(range) + 1) * set;
  $(`#varQty${varId}`).val(Math.abs(qty));
}else{
  $(`#varQty${varId}`).val(0);
}
}

//custom ride number
$(".Set_Num").on("change", function () {
  let end = $(".End").find(":selected").text();
  let start = $(".Start").find(":selected").text().split('-')[0];
  let set = $(this).val().split('_')[1];
  if (Number(start) && Number(end) && Number(set)) {
    let range = Number(start.split('-')[0]) - Number(end);
    let qty = (Math.abs(range) + 1) * set
    $('#varQty').val(Math.abs(qty))
  }else{
    $(`#varQty`).val(0);
  }
})
$(".End").on("change", function () {
  let end = $(this).find(":selected").text();
  let start = $(".Start").find(":selected").text().split('-')[0];
  let set = $('.Set_Num').val().split('_')[1];
  if (Number(start) && Number(end) && Number(set)) {
    if (Number(start) > Number(end)) {
      $('.error-message').remove();
      $('.End').after('<span class="error-message" style="color: red; font-size: 12px; margin-left: 5px;">Please select a valid starting and ending number</span>');
      $(`#varQty`).val(0);
      start=$(`.End option`).prop('selected',function(){
        return this.defaultSelected;
      });
    } else {
      $('.error-message').remove();
      let range = Number(start.split('-')[0]) - Number(end);
      let qty = (Math.abs(range) + 1) * set
      $('#varQty').val(Math.abs(qty));
    }
  }
})
$(".Start").on("change", function () {
  let end = $(".End").find(":selected").text();
  let start = $(this).find(":selected").text().split('-')[0];
  let set = $('.Set_Num').val().split('_')[1];
  if (Number(start) && Number(end) && Number(set)) {
    $(`#varQty`).val(0);
    if (Number(start) > Number(end)) {
      $('.error-message').remove();
      $('.Start').after('<span class="error-message" style="color: red; font-size: 12px; margin-left: 5px;">Please select a valid starting and ending number</span>');
      start=$(`.Start option`).prop('selected',function(){
        $(`#varQty`).val(0);
        return this.defaultSelected;
      });
    }else {
      $('.error-message').hide();
      let range = Number(start.split('-')[0]) - Number(end);
      let qty = (Math.abs(range) + 1) * set;
      $('#varQty').val(Math.abs(qty));
    }
  }
})

//variation
function stockCustomRiderVariant(element) {
  let variantId = element.id;
  let varId = element.id.split('_v')[1];
  let start = $(`.Start_${varId}`).find(':selected').text().split("-")[0];
  let end = $(`.End_${varId}`).find(':selected').text();
  let set = $(`.Set_Num_${varId}`).val().split('_')[1];
  if (Number(start) && Number(end)) {
    if (Number(start) > Number(end)) {
      $('.error-message').remove();
        $(`#${variantId}`).after('<span class="error-message" style="color: red; font-size: 12px; margin-left: 5px;">Please select a valid starting and ending number</span>');
        start=$(`#${variantId} option`).prop('selected',function(){
          $(`#varQty${varId}`).val(0);
          return this.defaultSelected;
        });
  }else{
    $('.error-message').remove();
  }
}
  if (Number(start) && Number(end) && Number(set)) {
  let range = Number(start.split('-')[0]) - Number(end);
  let qty = (Math.abs(range) + 1) * set;
  $(`#varQty${varId}`).val(Math.abs(qty));
}else{
  $(`#varQty${varId}`).val(0);
}
}

//print on back logic.
function validateprintOnBack(_this){
  var value = $(_this).val();
  if(value.toLowerCase() == 'no' || value == ""){
    printonBackLines.forEach((item)=>{
      if(seqOptions.includes(item)){
        $(`#${item}`).val(null);
        $(`#${item}`).removeClass('highlight_inout')
      }
    })
  }else{
    printonBackLines.forEach((item)=>{
      $(`#${item}`).addClass('highlight_inout')
    })
  }
}

function validateprintOnBackLines(isadd = false){
  const hasvalue = printonBackLines.some((ele)=>{
    if(seqOptions.includes(ele)){
      if($(`#${ele}`).val() != '' && $(`#${ele}`).val() != null && $(`#${ele}`).val() != undefined){
        return true;
      }
    }
  })
    printonBack.forEach((ele)=>{
      if(commonOptions.includes(ele)){
        if($(`#${ele}_dn`).length > 0){
         const _object = $(`#${ele}_dn`)[0].selectize;
         if(hasvalue && isadd){
          $(_object.$input).attr('data-printOnBack',true);
        }
        _object.setValue(hasvalue ? 'YES' : 'NO', false);
        }else{
          if(hasvalue && isadd){
            $(`${ele}`).attr('data-printOnBack',true);
          }
          $(`#${ele}`).val(hasvalue ? 'YES' : 'NO');
        }
      }
    })
}

function removePrintonBackLines(arr,prop,prev,isincludes){
  if(isincludes && typeof prop == 'string' && printonBackLines.includes(prop.slice(1))){
    delete arr[prev];
    return false;
  }
  return true
}

document.addEventListener("DOMContentLoaded", function() {
    
    // Function to add the product title
    function addProductTtitle() {
        // Get the current path of the webpage
        var currentPath = window.location.pathname;
        // Select all elements with class 'a.corner-category-card'
        var cornerCategoryCards = document.querySelectorAll('a.corner-category-card');
        // Check if there are at least 8 elements with class 'corner-category-card'
        if (cornerCategoryCards.length >= 7) {
            // Get the eighth element with class 'corner-category-card'
            var eighthElement = cornerCategoryCards[6];
            // Create a new div element for the separator
            var separatorDiv = document.createElement('div');
            separatorDiv.style.width = '100%';
           // Set the id for later reference
            separatorDiv.style.textAlign = 'center';
            separatorDiv.style.marginTop = '10px';
            separatorDiv.style.marginBottom = '10px';
            // Create a span element for the separator text
            var separatorText = document.createElement('span');
            separatorText.textContent = 'PRODUCT FAQ';
            separatorText.style.padding = '0px 10px';
            separatorText.style.color = '#1e2d7d';
            separatorText.style.fontWeight = '700';
            separatorText.style.fontSize = '18px';
            separatorText.style.textDecoration = 'underline';
            separatorText.style.padding = '0 10px';
            // Append the separator text to the separator div
            separatorDiv.appendChild(separatorText);
            // Insert the separator div after the eighth element
            eighthElement.parentNode.insertBefore(separatorDiv, eighthElement.nextSibling);
            // Create a new div element for the product FAQ content
            var newDiv = document.createElement('div');
            newDiv.style.width = '62%';
            newDiv.id = 'contentFAQ'; 
            newDiv.style.fontWeight = '600';
            newDiv.style.margin = 'auto';
            newDiv.style.marginTop = '1%';
            newDiv.innerHTML = `
            <p style="text-align: center;font-size: 17px;">Welcome to the Hodges Badge Help Center.<p><br>
            <p style="text-align: center;font-size: 16px;">What would you like help with today?   You can quickly find most answers here or  <a href="https://hodgesbadge.com/pages/contact-us" target="_self"><span style="color: rgb(0, 92, 171); text-decoration: underline;font-weight: bold;">contact us</span></a> for <br> service.</p>
            `;
            // Append the new div to a parent element in the document
            var parentElement = document.querySelector('.corner-page-banner.co-w-full.co-py-16.co-flex.co-flex-col.co-items-center.co-justify-center.co-bg-center');
            parentElement.insertAdjacentElement('afterend', newDiv);
            observer1.observe(document.body, { childList: true, subtree: true });
          
        } else {
            if(currentPath.includes('category')){
            observer.observe(document.body, { childList: true, subtree: true });
            }
            console.error("Less than 8 elements found with class 'corner-category-card'");
        }
    }

    // Mutation observer to detect the presence of the corner-page-banner element
    var observer = new MutationObserver(function(mutationsList, observer) {
        // Check if the corner-page-banner element is present
        var specificElement = document.querySelector('.corner-page-banner');
        if (specificElement) {
            // If present, disconnect the observer and add the product title
            observer.disconnect();
            addProductTtitle();
        }
    });

    // Mutation observer to detect the addition of the corner-article-card-info element
  var observer1 = new MutationObserver(function(mutationsList, observer) {
    try {
        // Loop through mutations in the mutations list
        mutationsList.forEach(function(mutation) {
            // Loop through added nodes in the mutation
            mutation.addedNodes.forEach(function(node) {
                // Check if the added node is an element node
                if (node && node.nodeType === Node.ELEMENT_NODE && node.firstChild && node.firstChild.firstChild && node.firstChild.firstChild.classList) {
                    // Check if the added node has the specified class
                    if (node.firstChild.firstChild.classList.contains('corner-article-list')) {
                        // If present, disconnect the observer and call the removeParagraph function
                        observer1.disconnect();
                        removeParagraph();
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error in observer1 callback:", error);
    }
});


    // Mutation observer to detect the addition of the corner-search-bar element on the 'a/help' page
  var observer2 = new MutationObserver(function(mutationsList, observer) {
    try {
        // Loop through mutations in the mutations list
        mutationsList.forEach(function(mutation) {
            // Get the current path of the webpage
            var currentPath = window.location.pathname;
            // Check if the current path is 'a/help'
            if (currentPath === '/a/help') {
                // Loop through added nodes in the mutation
                mutation.addedNodes.forEach(function(node) {
                    // Check if the added node is an element node
                    if (node && node.nodeType === Node.ELEMENT_NODE && node.firstChild && node.firstChild.firstChild && node.firstChild.firstChild.classList) {
                        // Check if the added node has the specified class
                        if (node.firstChild.firstChild.classList.contains('corner-search-bar')) {
                            // If present, disconnect the observer and perform further actions
                            observer2.disconnect();
                            // Get the content FAQ element
                            var contentElement = document.querySelector('#contentFAQ');
                            // If content FAQ element does not exist, add the product FAQ content
                            if (!contentElement) {
                               addProductTtitle()
                                observer1.observe(document.body, { childList: true, subtree: true });
                              
                            }
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error in observer2 callback:", error);
    }
});


    // Observe mutations in the body element for the presence of corner-page-banner
    observer.observe(document.body, { childList: true, subtree: true });
    // Observe mutations in the body element for the addition of corner-article-card-info
    // Observe mutations in the body element for the addition of corner-search-bar on the 'a/help' page

    // Function to remove the product FAQ content
    function removeParagraph() {
        var parentElement = document.querySelector('#contentFAQ');
        if (parentElement) {
            parentElement.remove();
        observer2.observe(document.body, { childList: true, subtree: true });
        }
    }
});


//Product Page Description Tab View.
function openTab(tabName,event) {
var i;
var tabs = document.getElementsByClassName("tab-content");
var buttons = document.getElementsByClassName("tab-button");
if (tabs.length <= 1 && buttons.length <= 1) {
  return false;
}
for (i = 0; i < tabs.length; i++) {
  tabs[i].classList.remove("active");
}

for (i = 0; i < buttons.length; i++) {
  buttons[i].classList.remove("active");
}

document.getElementById(tabName).classList.add("active");

event.currentTarget.classList.add("active");
}

function validate_splChar_ontype(element) {
  const restrictedChars = /[~|{}\[\]<>()[\]]/g;

  const field = $(element);
  const value = field.val() || '';
  const cleanedValue = value.replace(restrictedChars, '');

  const isTextarea = element.tagName.toLowerCase() === "textarea";

  // Get optionId (common logic)
  const optionId =
  field.data("optionId")?? field.closest("li").data("optionId") ;

  const error = isTextarea
    ? $('.txtarea_validation_span')
    : $(".error." + optionId);

  // If invalid chars found
  if (value !== cleanedValue) {
    field.val(cleanedValue);

    error.html(specialCharValidation).show();
    return;
  }

  // If valid
  error.hide();
}
function buildSetupChargeItem(item, totalQty, subType) {
  
  let pSupType = "00" + subType;
  let setupChargeValues = setupCharges[pSupType];
  if (!setupChargeValues) return null;

  let [limit, valueId] = setupChargeValues.split(",");

  if (Number(totalQty) >= Number(limit)) return null;

  let variantId = SetupChargeVariants[valueId];

  return {
    quantity: 1,
    id: variantId,
    properties: {
      ChargeType: "Setup Charge",
      _SetupCharge: valueId,
      _hopsId: item.properties._hopsId,
      _hopsUId: item.properties._hopsUId,
      _prodType: item.properties._prodType,
      _legacy_product_as_fee_title: "Setup Charges",
      _legacy_product_as_fee_description: "Setup Charges"
    }
  };
}


function cart_validateSetupCharge(item) {

  let productSubType = cart_productSubType[item.properties?._hopsId] || "";

  if (!subTypeIds.includes(productSubType)) return "";

  if (excludeProductsSC.includes(item.properties?._hopsId)) return "";

  return productSubType;
}

async function Cart_CartMOA(minLimits, moaAmnts, data) {
  let cartTotal = data.original_total_price / 100;

  if (cartTotal <= 0) {
    sessionStorage.setItem("isKlaviyo", "true");
    window.location.href = "/cart";
    return;
  }

  let cartItems = data.items;

  let prodMinLimit = 0;
  let moaItemKey = null;
  let moaItemPrice = 0;
  let ppPrice = 0;

  for (let item of cartItems) {

    if (item.title.includes("Minimum Order")) {
      moaItemKey = item.key;
      moaItemPrice = item.price / 100;
    }

    if (item.title.includes("Premium Processing")) {
      ppPrice = item.line_price / 100;
    }

    if (item.product_type != "HiddenCharges") {
      let prodType = item.properties?._prodType;
      if (prodType && minLimits[prodType]) {
        prodMinLimit = Math.max(prodMinLimit, minLimits[prodType]);
      }
    }
  }

  let minAmnt = prodMinLimit - (cartTotal - moaItemPrice - ppPrice);

  console.log("MOA Calculation:", { minAmnt });

  //  NEED MOA
  if (minAmnt > 0) {

    let moakey = (Math.round(minAmnt * 100) / 100).toFixed(2);
    let moaId = moaAmnts;

    if (moaItemKey) {
      await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: moaItemKey,
          quantity: 0
        })
      });

      await new Promise(res => setTimeout(res, 100));
    }

    await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            quantity: 1,
            id: moaId,
            properties: {
              MOA: moakey,
              _legacy_product_as_fee_title: "Minimum Order Amount",
              _legacy_product_as_fee_description: "Minimum Order Amount"
            }
          }
        ]
      })
    });

    await new Promise(res => setTimeout(res, 100));
  }

  //  REMOVE MOA
  else {
    if (moaItemKey) {
      await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: moaItemKey,
          quantity: 0
        })
      });

      await new Promise(res => setTimeout(res, 100));
    }
  }

 // await cart_calculatePremiumProcessing(data);
}

function showAutoPopup(cart) {
  return new Promise((resolve) => {

    //  Create elements
    const overlay = document.createElement("div");
    overlay.classList.add("auto-popup-overlay");

    const popupBox = document.createElement("div");
    popupBox.classList.add("auto-popup-box");

    const message = document.createElement("p");
    message.classList.add("auto-popup-message");

    //  Get message from metafields
    let popupText = validationMessage;

    message.textContent = popupText;

    // Build structure
    popupBox.appendChild(message);
    overlay.appendChild(popupBox);
    document.body.appendChild(overlay);

    // Auto close
    setTimeout(() => {
      overlay.remove();
      resolve(); // continue checkout
    }, 3000);
  });
}