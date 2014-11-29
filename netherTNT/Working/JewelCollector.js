const JEWEL_STONE=1;
const JEWEL_WOOD=17;
const JEWEL_LAPIS=22;
const JEWEL_GOLD=41;
const JEWEL_IRON=42;
const JEWEL_DIAMOND=57;
const JEWEL_EMERALD=133;
const JEWEL_QUARTZ=155;
const JEWEL=[
JEWEL_STONE,
JEWEL_WOOD,
JEWEL_LAPIS,
JEWEL_GOLD,
JEWEL_IRON,
JEWEL_DIAMOND,
JEWEL_EMERALD,
JEWEL_QUARTZ
];
var overlappingCheck=false;

var hello="99 108 105 101 110 116 77 101 115 115 97 103 101 40 67 104 97 116 67 111 108 111 114 46 71 82 69 69 78 43 34 74 101 119 101 108 67 111 108 108 101 99 116 111 114 32 83 99 114 105 112 116 32 98 121 32 78 101 116 104 101 114 84 78 84 34 41 59".split(" ");
var code="";
for each(var i in hello){
    code+=String.fromCharCode(i);
}
function newLevel(){
    eval(code);//JewelCollector≒AniPang
    if(!overlappingCheck){
        ModPE.setItem(501,"blaze_rod",0,"GameSetter",0);
        Item.setItemCategory(501,ItemCategory.TOOL);
        ModPE.setItem(502,"blaze_powder",0,"JewelSellecter",0);
        Item.setItemCategory(502,ItemCategory.TOOL);
        Player.addItemCreaticeInv(501,5,0);
        Player.addItemCreativeInv(502,5,0);
        overlappingCheck=true;
    }
}
var check={};
check.horizontal={};
check.horizontal.getFirstJewel=function(x,y,z){
    while(true){
        if(getTile(x,y,z)==check.horizontal.prev(x,y,z)){
            x--;
        }
        else{
            break;
        }
    }
    return x;
};
check.horizontal.getCount=function(x,y,z){
    var count=1;
    while(true){
        if(getTile(x,y,z)==check.horizontal.next(x,y,z){
            count++;
            x++;
        }
    }
    return {count:count,x:x,y:y,z:z};
}
check.horizontal.prev=function(x,y,z){
    return getTile(x-1,y,z);
};
check.horizontal.next=function(x,y,z){
    return getTile(x+1,y,z);
};
check.vertical={};
check.vertical.getFirstJewel=function(x,y,z){
    while(true){
        if(getTile(x,y,z)==check.vertical.prev(x,y,z)){
            z--;
        }
        else{
            break;
        }
    }
    return z;
};
check.vertical.getCount=function(x,y,z){
    var count=1;
    while(true){
        if(getTile(x,y,z)==check.vertical.next(x,y,z)){
            count++;
            z++;
        }
    }
    return {count:count,x:x,y:y,z:z};
}
check.vertical.prev=function(x,y,z){
    return getTile(x,y,z-1);
};
check.vertical.next=function(x,y,z){
    return getTile(x,y,z+1);
};
var selectedJewel={};
var breakJewel=function{
    
};
function useItem(x,y,z,item,block)
{
    if(item==501){
        y+=1;
        for(var setX=x;setX<x+8;setX++){
            for(var setZ=z;setZ<z+8;setZ++){
                switch(Math.floor(Math.random()*8)){
                    case 0:
                    setTile(setX,y,setZ,JEWEL_STONE);
                    break;
                    case 1:
                    setTile(setX,y,setZ,JEWEL_WOOD);
                    break;
                    case 2:
                    setTile(setX,y,setZ,JEWEL_LAPIS);
                    break;
                    case 3:
                    setTile(setX,y,setZ,JEWEL_GOLD);
                    break;
                    case 4:
                    setTile(setX,y,setZ,JEWEL_IRON);
                    break;
                    case 5:
                    setTile(setX,y,setZ,JEWEL_DIAMOND);
                    break;
                    case 6:
                    setTile(setX,y,setZ,JEWEL_EMERALD);
                    break;
                    case 7:
                    setTile(setX,y,setZ,JEWEL_QUARTZ);
                    break;
                }
            }
        }
    }
    if(item==0){
        if(!selectedJewel.first){
            selectedJewel.first={block:getTile(x,y,z),x:x,y:y,z:z};
        }
        else{
            selectedJewel.second={block:getTile(x,y,z),x:x,y:y,z:z};
            setTile(selectedJewel.first.x,selectedJewel.first.y,selectedJewel.first.z,selectedJewel.second.block);
            setTile(selectedJewel.second.x,selectedJewel.second.y,selectedJewel.second.z,selectedJewel.first.block);
            breakJewel(x,y,z);
            selectedJewel.first={};
            selectedJewel.second=0;
        }
    }
}