<?php

namespace burstMode;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\entity\ProjectileLaunchEvent;
use pocketmine\entity\Snowball;
use pocketmine\entity\Arrow;
use pocketmine\Player;
use pocketmine\scheduler\CallbackTask;
use pocketmine\nbt\tag\Compound;
use pocketmine\nbt\tag\Enum;
use pocketmine\nbt\tag\Double;
use pocketmine\nbt\tag\Float;
use pocketmine\entity\Entity;

class burstMode extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
	}
	public function burstMode(ProjectileLaunchEvent $event) {
		$entity = $event->getEntity ();
		$player = $event->getEntity ()->shootingEntity;
		
		if ($player == null)
			return;
		if ($entity instanceof Snowball) {
			$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [ 
					$this,
					"burstSnowball" 
			], [ 
					$player 
			] ), 10 );
			$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [ 
					$this,
					"burstSnowball" 
			], [ 
					$player 
			] ), 20 );
		}
		if ($entity instanceof Arrow) {
			$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [ 
					$this,
					"burstArrow" 
			], [ 
					$player 
			] ), 10 );
			$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [ 
					$this,
					"burstArrow" 
			], [ 
					$player 
			] ), 20 );
		}
	}
	public function burstSnowball(Player $player) {
		$nbt = new Compound ( "", [ 
				"Pos" => new Enum ( "Pos", [ 
						new Double ( "", $player->x ),
						new Double ( "", $player->y + $player->getEyeHeight () ),
						new Double ( "", $player->z ) 
				] ),
				"Motion" => new Enum ( "Motion", [ 
						new Double ( "", - \sin ( $player->yaw / 180 * M_PI ) *\cos ( $player->pitch / 180 * M_PI ) ),
						new Double ( "", - \sin ( $player->pitch / 180 * M_PI ) ),
						new Double ( "",\cos ( $player->yaw / 180 * M_PI ) *\cos ( $player->pitch / 180 * M_PI ) ) 
				] ),
				"Rotation" => new Enum ( "Rotation", [ 
						new Float ( "", $player->yaw ),
						new Float ( "", $player->pitch ) 
				] ) 
		] );
		
		$f = 1.5;
		$snowball = Entity::createEntity ( "Snowball", $player->chunk, $nbt, $player );
		$snowball->setMotion ( $snowball->getMotion ()->multiply ( $f ) );
		$snowball->spawnToAll ();
	}
	public function burstArrow(Player $player) {
		$nbt = new Compound ( "", [ 
				"Pos" => new Enum ( "Pos", [ 
						new Double ( "", $player->x ),
						new Double ( "", $player->y + $player->getEyeHeight () ),
						new Double ( "", $player->z ) 
				] ),
				"Motion" => new Enum ( "Motion", [ 
						new Double ( "", -\sin ( $player->yaw / 180 * M_PI ) * \cos ( $player->pitch / 180 * M_PI ) ),
						new Double ( "", -\sin ( $player->pitch / 180 * M_PI ) ),
						new Double ( "", \cos ( $player->yaw / 180 * M_PI ) * \cos ( $player->pitch / 180 * M_PI ) ) 
				] ),
				"Rotation" => new Enum ( "Rotation", [ 
						new Float ( "", $player->yaw ),
						new Float ( "", $player->pitch ) 
				] ) 
		] );
		
		$f = 1.5;
		$arrow = Entity::createEntity ( "Arrow", $player->chunk, $nbt, $player );
		$arrow->setMotion ( $arrow->getMotion ()->multiply ( $f ) );
		$arrow->spawnToAll ();
	}
}

?>