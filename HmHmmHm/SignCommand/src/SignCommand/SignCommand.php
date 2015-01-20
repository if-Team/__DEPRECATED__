<?php

namespace SignCommand;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\block\SignChangeEvent;
use pocketmine\utils\Config;
use pocketmine\event\player\PlayerInteractEvent;
use pocketmine\utils\TextFormat;

class SignCommand extends PluginBase implements Listener {
	public function onEnable() {
		$this->initMessage ();
		
		$this->saveDefaultConfig ();
		$this->reloadConfig ();
		
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
	}
	public function SignPlace(SignChangeEvent $event) {
		if ($event->getLine ( 0 ) != $this->get ( "sign-set-message" ) and $event->getLine ( 0 ) != $this->get ( "sign-message" )) return;
		$block = $event->getBlock ();
		if($event->getLine(1) == null){
			$event->getPlayer()->sendMessage(TextFormat::RED . $this->get("command-zero"));
			return;
		}
		if (isset ( explode ( "/", $event->getLine ( 1 ), 2 )[1] )) {
			$this->getConfig ()->set ( "{$block->x}:{$block->y}:{$block->z}", explode ( "/", $event->getLine ( 1 ), 2 )[1] );
			$event->setLine ( 0, $this->get ( "sign-message" ) );
		} else {
			$this->getConfig ()->set ( "{$block->x}:{$block->y}:{$block->z}", $event->getLine ( 1 ) );
			$event->setLine ( 0, $this->get ( "sign-message" ) );
		}
	}
	public function onTouch(PlayerInteractEvent $event) {
		$block = $event->getBlock ();
		$commandLine = $this->getConfig ()->get ( "{$block->x}:{$block->y}:{$block->z}" );
		if ($commandLine != false) $this->getServer ()->getCommandMap ()->dispatch ( $event->getPlayer (), $commandLine );
	}
	public function initMessage() {
		$this->saveResource ( "messages.yml", false );
		$this->messages = (new Config ( $this->getDataFolder () . "messages.yml", Config::YAML ))->getAll ();
	}
	public function get($var) {
		return $this->messages [$this->messages ["default-language"] . "-" . $var];
	}
}

?>