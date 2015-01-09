<?php
// 보류
namespace ColorTag;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerJoinEvent;
use pocketmine\utils\TextFormat;
use pocketmine\event\player\PlayerDeathEvent;
use pocketmine\event\player\PlayerRespawnEvent;

class ColorTag extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[ColorTag]플러그인이 활성화 되었습니다" );
	}
	public function nameTag(PlayerJoinEvent $e) {
		$e->getPlayer ()->setRemoveFormat ( false );
		$name = $e->getPlayer()->getName ();
		if ($e->getPlayer()->isOp()) {
			$e->getPlayer()->setNameTag ("[OP]".$oname );
		} else {
			$e->getPlayer()->setNameTag ("USER".$sname );
		}
	}
	public function deathTag(PlayerDeathEvent $e) {
		$tag = $e->getPlayer()->getNameTag();
		$e->getPlayer()->setRemoveFormat(false);
		$e->getPlayer()->setNameTag("[Death]".$tag);
	}
	public function liveTag(PlayerRespawnEvent $e) {
		$e->getPlayer ()->setRemoveFormat ( false );
		$name = $e->getPlayer()->getName ();
		if ($e->getPlayer()->isOp()) {
			$e->getPlayer()->setNameTag ("[OP]".$oname );
		} else {
			$e->getPlayer()->setNameTag ("USER".$sname );
		}
	}
	
}

?>