/**
 * Simple Alert service for sample command Handlers
 *
 * @module js/supplierCommandService
 */
 import popupSvc from 'js/popupService';
 import $ from 'jquery';

 import _ from 'lodash';

// avoid intense invoke
let throttledShow = null;
export let show = function( params ) {
    if ( !throttledShow ) {
        throttledShow = _.throttle( popupSvc.show, 200 );
    }
    return throttledShow( params );
};

export let demo = function() {
    $.ajax({
        url : "/tcsoaservice/rfqbom/test",
        data : {},
        async: false,
        type : 'GET',
        dataType : 'json',
        success : function( data ) {
            console.log(data);
            alert("123");          
        },
        error : function(data) {
            console.error(data);
            alert(data.responseJSON.message);
        }
    });
};


export default {
    show: show,
    demo: demo
};
