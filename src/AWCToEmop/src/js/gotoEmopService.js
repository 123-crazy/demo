/**
 * Simple Alert service for sample command Handlers
 *
 * @module js/gotoEmopService
 */
 import angular from 'angular';

/**
 * Dummy alert.
 * @param {String} text - text to display
 */
export let alert2 = function( uid ,useruid) {
    
    var ctx = angular.element(document.body).injector().get('appCtxService').ctx;
    console.log(ctx);
    console.log(uid);
    console.log(useruid);
    if(!ctx.selected.props.awb0Parent.isNulls){
        alert( "请选择顶行操作！" );
        return;
    }
    window.open("http://10.160.2.192/rfq-management/#/rfq-price?uid="+uid+"&useruid="+useruid, "_blank")  
    // eslint-disable-next-line no-undef
    // $.ajax({
    //     url : "/tcsoaservice/rfq/gotoEmop",
    //     data : {
    //         "uid": uid,
    //         "useruid":useruid
    //     },
    //     async: false,
    //     type : 'POST',
    //     dataType : 'json',
    //     success : function( json ) {
    //         if(json.status == 200){
    //             window.open(json.data, "_blank")   
    //         }else{
    //             alert(json.message);
    //         }     
    //     },
    //     error : function(json) {
    //         console.error(json);
    //         alert("打开RFQ报价失败！");
    //     }
    // });
};

export default {
    alert: alert2
};
