<?php

namespace Imprison;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerMoveEvent;
use pocketmine\event\player\PlayerChatEvent;
use pocketmine\command\CommandSender;
use pocketmine\command\Command;
use pocketmine\scheduler\CallbackTask;
use pocketmine\utils\TextFormat;

class Imprison extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[Imprison]플러그인이 활성화 되었습니다" );
		$this->imp = [ ];
	}
	public function moveImp(PlayerMoveEvent $ev) {
		if (isset ( $this->imp [$ev->getPlayer ()->getName ()] ))
			$ev->setCancelled ( true );
	}
	public function chatImp(PlayerChatEvent $ev) {
		if (isset ( $this->imp [$ev->getPlayer ()->getName ()] )) {
			$ev->setCancelled ( true );
			$ev->getPlayer ()->sendMessage ( "[Imprison]구속중입니다. 채팅이 불가합니다." );
		}
	}
	public function onCommand(CommandSender $sp, Command $cmd, $label, array $sub) {
		switch ($cmd->getName ()) {
			case 'imp' :
				if (! isset ( $sub [0] )) {
					return false;
				} else if(!isset($sub[1])) {
					$sp->sendMessage ( "[Imprison] 시간을 입력해 주세요");
				}
				else {
					$name = strtolower ( $sub [0] );
					$player = $this->getServer ()->getPlayer ( $name );
					$time = $sub [1];
					$tick = $time * 20;
					if (! $player == null) {
						if($player->isOnline()) {
						$this->imp [$name] = $player;
						$this->getServer ()->broadcastMessage ( "[Imprison] <" . $name . ">님께서 " . $time . "초 만큼 구속되셨습니다." );
						$this->schedule_delay ( $this, 'unimp', $tick, [ ] );
						$this->getServer ()->broadcastMessage ( "[Imprison] <" . $name . "님의 구속이 종료되었습니다." );
						}
					} else
						$sp->sendMessage ( "[Imprison] <" . $name . ">님을 찾을 수 없습니다. ");
				}
		}
	}
	public function unimp($name) {
		unset ( $this->imp [$name] );
	}
	public function schedule_delay($class, $method, $second, $param) {
		$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [ 
				$class,
				$method 
		], $param ), $second );
	}
}