{
  "map" : function (doc, meta) {
  
  
  //Search key
  var dStr = doc.lt_dts;
  dStr = dStr.split(':');
  dStr = dStr[0] + ":" + dStr[1];
  var d = new Date(dStr);
  var dArr = dateToArray(d);
  
  //Value
  var fValue = parseFloat(doc.l.replace(',',''));
  
  emit(dArr, fValue);
  
  },

  "reduce" : function (keys, values, rereduce) {
   
  var stats = {};
  
  stats.count = 0;
  stats.sum = 0;
  stats.min = 0;
  stats.max = 0;
  stats.avg = 0;
  
  
  for (i = 0; i < values.length; i++) {
   
    var val = values[i];
    
    if (val >= stats.max) stats.max = val;
    if (val <= stats.min || stats.min == 0) stats.min = val; 
    
    stats.sum = stats.sum + val;
    stats.count = stats.count +1;
  }
  
  stats.avg = stats.sum / stats.count;
  
  return stats;
  
  }
}
