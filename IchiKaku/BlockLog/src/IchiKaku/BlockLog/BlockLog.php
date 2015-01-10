<?php
namespace Ichikaku\BlockLog;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;

class BlockLog extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[BlockLog]플러그인이 활성화 되었습니다" );
	}	
	public function blockBreakLog(BlockBreakEvent $e) {
		// TODO : Check the breaking time
		if (! $e->getPlayer ()->isOp ()) {
			$name = "[" . $e->getPlayer ()->getName () . "]";
			$block = $e->getBlock ();
			$x = $block->getX ();
			$y = $block->getY ();
			$z = $block->getZ ();
			$pos = "[" . $x . "," . $y . "," . $z . "]";
			$info = "[" . $block->getId () . ":" . $block->getDamage () . "]";
			$this->getServer ()->getLogger ()->info ( "[블럭 파괴 알림] " . $name . " " . $pos . " " . $info );
		}
	}
	public function blockPlaceLog(BlockPlaceEvent $e) {
		// TODO: Check the placing time
		if (! $e->getPlayer ()->isOp ()) {
			$name = "[" . $e->getPlayer ()->getName () . "]";
			$block = $e->getBlock ();
			$x = $block->getX ();
			$y = $block->getY ();
			$z = $block->getZ ();
			$pos = "[" . $x . "," . $y . "," . $z . "]";
			$info = "[" . $block->getId () . ":" . $block->getDamage () . "]";
			$this->getServer ()->getLogger ()->info ( "[블럭 설치 알림] " . $name . " " . $pos . " " . $info );
		}
	}
}