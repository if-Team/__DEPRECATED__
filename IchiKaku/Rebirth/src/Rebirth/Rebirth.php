<?php

namespace Rebirth;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerDeathEvent;
use pocketmine\event\player\PlayerChatEvent;
use pocketmine\utils\TextFormat;
use pocketmine\event\player\PlayerRespawnEvent;
use pocketmine\scheduler\CallbackTask;
use pocketmine\event\player\PlayerJoinEvent;
use pocketmine\event\entity\EntityDamageEvent;

class Rebirth extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[Rebirth]플러그인이 활성화 되었습니다" );
		$this->ghost = [ ];
	}
	public function onJoin(PlayerJoinEvent $ev) {
		$player = $ev->getPlayer ();
		foreach ( $this->ghost as $ghost ) {
			$player->hidePlayer ( $ghost );
		}
	}
	public function ghostDamage(EntityDamageEvent $ev) {
		$player = $ev->getPlayer ();
		$name = $player->getName ();
		if (isset ( $this->ghost [$name] )) {
			$ev->setCancelled ( true );
		}
	}
	public function onGhostChat(PlayerChatEvent $ev) {
		$player = $ev->getPlayer ();
		$name = $player->getName ();
		if (isset ( $this->ghost [$name] )) {
			$ev->setCancelled ( true );
			$player->setRemoveFormat ( false );
			$this->getServer ()->broadcastMessage ( TextFormat::RED . "[유령]" . $name . " : " . $ev->getMessage () );
		}
	}
	public function onPlayerRespawn(PlayerRespawnEvent $ev) {
		$player = $ev->getPlayer ();
		$name = $player->getName ();
		if (! isset ( $this->ghost [$name] )) {
			$this->ghost [$player->getName ()] = $player;
			$this->toGoast ( $player );
			$this->schedule_delay ( $this, "kill", 1200, [ 
					$player 
			] );
		} else {
			unset ( $this->ghost [$name] );
			$this->birth ( $player );
		}
	}
	public function toGoast($p) {
		foreach ( $this->getServer ()->getOnlinePlayers () as $pl ) {
			$pl->hidePlayer ( $p );
		}
	}
	public function birth($p) {
		foreach ( $this->getServer ()->getOnlinePlayers () as $pl ) {
			$pl->showPlayer ( $p );
		}
	}
	public function kill($p) {
		if (isset ( $this->ghost [$p->getName ()] )) {
			$p->kill ();
		}
	}
	public function schedule_delay($class, $method, $second, $param) {
		$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [ 
				$class,
				$method 
		], $param ), $second );
	}
}