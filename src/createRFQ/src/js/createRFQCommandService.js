/**
 * Simple Alert service for sample command Handlers
 *
 * @module js/createCraftCommandService
 */

 import commandPanelService from 'js/commandPanel.service';
 import $ from 'jquery';
 import logger from 'js/logger';
 import eventBus from 'js/eventBus';
 import _ from 'lodash';


/**
	 * 打开导入面板
	 * 
	 * @param {string}
	 *            commandId 命令ID
	 * @param {string}
	 *            location 面板位置
	 */
 export let openCreatePanel = function( commandId, location ) {
    //generateNextValues();
    commandPanelService.activateCommandPanel( commandId, location );
 };

export let createRFQ = function( data, userUid, ctx ) {
    console.log(data);
    console.log(userUid);
    console.log(ctx);
    var folder = null;
    if(ctx.selected.type=='Folder' || ctx.selected.type=='Fnd0HomeFolder'|| ctx.selected.type=='Newstuff Folder'){
        folder = ctx.selected.uid;
    } else {
        folder = null;
    }
    if(isEmptyStr(data.id.dbValue)||isEmptyStr(data.revision.dbValue)||isEmptyStr(data.name.dbValue)){
        alert("必填项不能为空");
        return;
    }
    $.ajax({
        url : "/tcsoaservice/rfq/createRfq",
        data : {
            "id":data.id.dbValue,
            "revision":data.revision.dbValue,
            "name":data.name.dbValue,
            "useruid":userUid,
            "folder" : folder
        },
        async: false,
        type : 'POST',
        dataType : 'json',
        success : function( json ) {
            if(json.status == 200){
                // alert(data.id.dbValue+"创建成功");
            }else{
                alert(json.message);
            }        
        },
        error : function(json) {
            console.error(json);
            alert(json.responseJSON.message);
        }
    });
};

function isEmptyStr(s) {
	if (s == null || s === '') {
		return true
	}
	return false
}

export let generateNextValues = function(data1) {
    $.ajax({
        url : "/tcsoaservice/rfq/generateNextValues",
        data : {
            "itemType":"V6_RFQ"
        },
        async: false,
        type : 'POST',
        dataType : 'json',
        success : function( json ) {
            console.log(json);
            console.log(data1);
            data1.id.dbValue = json.data;
        },
        error : function(json) {
            console.error(json);
            alert(json.responseJSON.message);
        }
    });
};

const getFn = function( eventId, throttle = false ) {
    let fn = popupElement => { eventBus.publish( eventId, { popupId: popupElement.id } ); };
    if( throttle ) { fn = _.throttle( fn, 1000 ); }
    return fn;
};

const hooksMap = {
    open: getFn( 'showcase.openPopup' ),
    close: getFn( 'showcase.closePopup' ),
    // `update` was called too intensive, apply throttle to ease automation test.
    update: getFn( 'showcase.updatePopup', true )
};
export let getHookFunction = function( key ) {
    return hooksMap[key];
};

export default {
    openCreatePanel: openCreatePanel,
    generateNextValues:generateNextValues,
    createRFQ:createRFQ,
    isEmptyStr:isEmptyStr,
    getHookFunction:getHookFunction
};

