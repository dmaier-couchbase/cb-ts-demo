/**
 * Helper to check if the variable is defined
 */
function _isDefined(obj)
{  
    if (typeof obj == 'undefined' || obj == 'undefined' || obj == null)
    {
        return false;
    }
    
    return true;
}


function _twoDigVal(val) {

	if ((''+val).length == 1) val = '0' + val;
	return val;
}


function _genDateStr(ts) {

	var date = new Date(ts);
	  
	var year = date.getUTCFullYear();
	var month = _twoDigVal(date.getUTCMonth()+1);
	var day = _twoDigVal(date.getUTCDate());
	var hour = _twoDigVal(date.getUTCHours());
	var min = _twoDigVal(date.getUTCMinutes());
	
	var dStr = year + "-" + month + "-" + day + "T" + hour + ":" + min;
	return dStr;
}






//Module exports
module.exports = {
    
    isDefined : function(obj) {
    
        return _isDefined(obj);
    },

    genDateStr : function(ts) {

	return _genDateStr(ts);	     
    }
    
};
