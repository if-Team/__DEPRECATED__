<?php

namespace Trampoline;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerMoveEvent;
use pocketmine\math\Vector3;
use pocketmine\Player;
use pocketmine\utils\TextFormat;
use pocketmine\event\entity\EntityDamageEvent;

class Trampoline extends PluginBase implements Listener {
	public $fallen = [ ];
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
	}
	public function onMove(PlayerMoveEvent $event) {
		$player = $event->getPlayer ();
		
		if ($player->isOnGround () or $player == null)
			return;
		
		if ($player->getLevel () == null)
			return;
		
		$x = ( int ) round ( $player->x - 0.5 );
		$y = ( int ) round ( $player->y - 1 );
		$z = ( int ) round ( $player->z - 0.5 );
		
		$block = $player->getLevel ()->getBlock ( new Vector3 ( $x, $y, $z ) );
		
		if ($block->getID () == 35 and $block->getDamage () == 5) {
			$this->fallenQueue ( $player );
			$player->addEntityMotion ( 0, 0, 10, 0 );
		}
	}
	public function fallenQueue(Player $player) {
		if ($player == null)
			return;
		if (isset ( $this->fallen [$player->getName ()] )) {
			$this->fallen [$player->getName ()] ++;
		} else {
			$this->fallen [$player->getName ()] = 1;
		}
	}
	public function fallenDamagePrevent(EntityDamageEvent $event) {
		if ($event->getCause () == EntityDamageEvent::CAUSE_FALL) {
			if (! $event->getEntity () instanceof Player)
				return;
			
			if (isset ( $this->fallen [$event->getEntity ()->getName ()] )) {
				$event->setDamage ( 0 );
				$this->fallen [$event->getEntity ()->getName ()] --;
				if ($this->fallen [$event->getEntity ()->getName ()] == 0)
					unset ( $this->fallen [$event->getEntity ()->getName ()] );
				
				$reflection_class = new \ReflectionClass ( "\\pocketmine\\Player" );
				$property = $reflection_class->getProperty ( 'inAirTicks' );
				$property->setAccessible ( true );
				$property->setValue ( $event->getEntity (), 0 );
			}
		}
	}
}

?>