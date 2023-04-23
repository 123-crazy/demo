/**
 * Simple Alert service for sample command Handlers
 *
 * @module js/updateDocCommandService
 */

/**
 * Dummy alert.
 * @param {String} text - text to display
 */
export let alert2 = function( revUid ) {
    // eslint-disable-next-line no-undef
    $.ajax({
        url : "/tcsoaservice/api/updateDocumentProperties",
        data : {
            "revUid": revUid
        },
        async: false,
        type : 'POST',
        dataType : 'json',
        success : function( json ) {
            console.log(json);
            alert("文档属性更新完成！");          
        },
        error : function(json) {
            console.error(json);
            alert(json.data);
        }
    });
};

export default {
    alert: alert2
};
