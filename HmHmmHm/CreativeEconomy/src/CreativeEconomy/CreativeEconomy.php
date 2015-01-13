<?php

namespace CreativeEconomy;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\utils\Config;
use pocketmine\command\PluginCommand;
use pocketmine\command\CommandSender;
use pocketmine\command\Command;
use pocketmine\event\player\PlayerInteractEvent;
use pocketmine\event\block\SignChangeEvent;

class CreativeEconomy extends PluginBase implements Listener {
	public function onEnable() {
		$this->saveResource ( "config.yml", false );
		$this->saveDefaultConfig ();
		$this->reloadConfig ();
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
	}
	public function onTouch(PlayerInteractEvent $event) {
	}
	public function onSign(SignChangeEvent $event) {
	}
	public function onCommand(CommandSender $sender, Command $command, $label, $args) {
	}
	public function get($var) {
		return $this->messages [$this->messages ["default-language"] . "-" . $var];
	}
	public function initMessage() {
		$this->saveResource ( "messages.yml", false );
		$this->messages = (new Config ( $this->getDataFolder () . "messages.yml", Config::YAML ))->getAll ();
	}
	public function registerCommand($name, $fallback, $permission, $description = "", $usage = "") {
		$commandMap = $this->getServer ()->getCommandMap ();
		$command = new PluginCommand ( $name, $this );
		$command->setDescription ( $description );
		$command->setPermission ( $permission );
		$command->setUsage ( $usage );
		$commandMap->register ( $fallback, $command );
	}
}

?>