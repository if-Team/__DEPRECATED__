<?php
// 보류
namespace ColorTag;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerJoinEvent;
use pocketmine\utils\TextFormat;

class ColorTag extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[ColorTag]플러그인이 활성화 되었습니다" );
	}
	public function nameTag(PlayerJoinEvent $e) {
		$e->getPlayer ()->setRemoveFormat ( false );
		$player = $e->getPlayer ();
		$name = $player->getName ();
		$sname = "[User]" . $name;
		$oname = "[OP]" . $name;
		if ($e->getPlayer()->isOp()) {
			$player->setNameTag (TextFormat::YELLOW.$oname );
		} else {
			$player->setNameTag (TextFormat::GREEN.$sname );
		}
	}
}

?>