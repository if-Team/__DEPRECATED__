<?php

namespace getIP;

use pocketmine\plugin\PluginBase;
use pocketmine\command\CommandSender;
use pocketmine\event\Listener;
use pocketmine\command\Command;
use pocketmine\utils\TextFormat;
use pocketmine\Player;

class getIP extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[getIP]플러그인이 활성화 되었습니다" );
	}
	public function onCommand(CommandSender $sp, Command $cmd, $label, array $sub) {
		switch ($cmd->getName ()) {
			case 'getip' :
				if (! isset ( $sub [0] )) {
					return false;
				} else if (isset ( $sub [0] )) {
					$name = strtolower ( $sub [0] );
					$player = $this->getServer()->getPlayer ( $name );
					if (! $player == null) {
						$ip = $player->getServer()->getAddress ();
						$sp->sendMessage ( $name . "님의 아이피는[" . $ip . "]입니다." );
					} else
						$sp->sendMessage ( $name . "님께서 접속중이지 않습니다." );
				}
				return true;
			default :
				return false;
		}
	}
}

?>