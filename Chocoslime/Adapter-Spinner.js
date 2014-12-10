function spinnerSample() {    
    ctx.runOnUiThread(new java.lang.Runnable({run : function(){
        try{
            var items=["대한민국", "일본", "중국", "캐나다", "러시아", "미국", "브라질"]
            var spinner=new android.widget.Spinner( ctx );
            var adapter=new android.widget.ArrayAdapter( ctx,android.R.layout.simple_spinner_item,items );
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spinner.setAdapter( adapter );
            spinner.setOnItemSelectedListener( new android.widget.AdapterView.OnItemSelectedListener( {onItemSelected:function ( parent,view,position ) {
                if(position==0) {
                    //code
                }
            }
        }));
        var dialog = new android.app.AlertDialog.Builder(ctx,2);
        dialog.setView(spinner);
        dialog.setNegativeButton("닫기",null);
        dialog.show();
    }
    catch(error){
        print(error)
        }
    }}));
}
