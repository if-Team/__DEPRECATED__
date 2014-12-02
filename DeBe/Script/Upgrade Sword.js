function useItem(x, y, z, id, a1, a2, d){
	ITEMs = {
	268: [272,ChatColor.DARK_RED+"나무"],
	272: [267,ChatColor.DARK_GRAY+"돌"],
	267: [283,ChatColor.WHITE+"철"],
	283: [276,ChatColor.GOLD+"금"]
	};
	i = ITEMs[id];
	if(typeof(i) !== "undefined"){
		if(typeof(ITEMs[i[0]]) == "undefined") c = ChatColor.AQUA+"다이아";
		else c = ITEMs[i[0]][1];
		d = ChatColor.DARK_PURPLE;
		clientMessage(d+i[1]+d+"칼이 "+c+d+"칼로 업그레이드 되었습니다.");
		Entity.setCarriedItem(Player.getEntity(),i[0],1,d);
	}
}