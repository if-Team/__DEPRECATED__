/*

Circuit script by lem()ntea.
Please do not copy my code.

*/

//Block definations
//Warning: edting this could make error(s).
var SWITCH_ENABLED = 22 //Lapis lazuli block
var SWITCH_DISABLED = 20 //Glass
var WIRE_ENABLED = 41; //Gold block
var WIRE_DISABLED = 42; //Iron block

function useItem(x, y, z, b, i, s){
    if(b == SWITCH_ENABLED){
        net.zhuoweizhang.mcpelauncher.ScriptManager.nativeSetTile(x, y, z, SWITCH_DISABLED, 0);
    } else if(b == SWITCH_DISABLED){
        net.zhuoweizhang.mcpelauncher.ScriptManager.nativeSetTile(x, y, z, SWITCH_ENABLED, 0);
    }
}
