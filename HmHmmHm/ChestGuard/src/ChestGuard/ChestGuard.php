<?php

namespace ChestGuard;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\utils\Config;
use pocketmine\event\block\BlockPlaceEvent;
use pocketmine\event\block\BlockBreakEvent;
use pocketmine\block\Block;
use pocketmine\utils\TextFormat;
use pocketmine\event\player\PlayerInteractEvent;

class ChestGuard extends PluginBase implements Listener {
	public $config, $configData;
	public function onEnable() {
		@mkdir ( $this->getDataFolder () );
		$this->config = new Config ( $this->getDataFolder () . "chestList.yml", Config::YAML );
		$this->configData = $this->config->getAll ();
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
	}
	public function onDisable() {
		$this->config->setAll ( $this->configData );
		$this->config->save ();
	}
	public function onPlace(BlockPlaceEvent $event) {
		if ($event->getBlock ()->getId () != Block::CHEST) return;
		$block = $event->getBlock ();
	
		
		if(($event->getBlock()->getLevel()->getBlockIdAt($block->x + 1, $block->y, $block->z) == Block::CHEST ) or
			$event->getBlock()->getLevel()->getBlockIdAt($block->x - 1, $block->y, $block->z) == Block::CHEST or
			$event->getBlock()->getLevel()->getBlockIdAt($block->x, $block->y, $block->z + 1) == Block::CHEST or
			$event->getBlock()->getLevel()->getBlockIdAt($block->x, $block->y, $block->z - 1) == Block::CHEST){
			
			if(isset($this->configData ["{$block->x}:{$block->y}:{$block->z}"]) and
				$this->configData ["{$block->x}:{$block->y}:{$block->z}"] != $event->getPlayer ()->getName ()){
				$event->getPlayer()->sendMessage(TextFormat::RED . "바로 옆에 다른사람의 상자가 있습니다, 설치 불가능 !");
				return;
			}
		}
		$this->configData ["{$block->x}:{$block->y}:{$block->z}"] = $event->getPlayer ()->getName ();
	}
	public function onBreak(BlockBreakEvent $event) {
		if ($event->getBlock ()->getId () != Block::CHEST) return;
		$block = $event->getBlock ();
		if (! isset ( $this->configData ["{$block->x}:{$block->y}:{$block->z}"] )) return;
		if ($this->configData ["{$block->x}:{$block->y}:{$block->z}"] == $event->getPlayer ()->getName ()) {
			unset ( $this->configData ["{$block->x}:{$block->y}:{$block->z}"] );
			$event->getPlayer ()->sendMessage ( TextFormat::DARK_AQUA . "상자 보호가 해제되었습니다 !" );
			$event->setCancelled ();
		} else {
			if ($event->getPlayer ()->isOp ()) return;
			$event->getPlayer ()->sendMessage ( TextFormat::RED . "이 상자는 " . $this->configData ["{$block->x}:{$block->y}:{$block->z}"] . " 님의 소유입니다, 파괴 불가 !" );
			$event->setCancelled ();
		}
	}
	public function onTouch(PlayerInteractEvent $event) {
		if ($event->getBlock ()->getId () != Block::CHEST) return;
		$block = $event->getBlock ();
		if (! isset ( $this->configData ["{$block->x}:{$block->y}:{$block->z}"] )) return;
		if ($this->configData ["{$block->x}:{$block->y}:{$block->z}"] != $event->getPlayer ()->getName ()) {
			if ($event->getPlayer ()->isOp ()) return;
			$event->getPlayer ()->sendMessage ( TextFormat::RED . "이 상자는 " . $this->configData ["{$block->x}:{$block->y}:{$block->z}"] . " 님의 소유입니다, 터치 불가 !" );
			$event->setCancelled ();
		}
	}
}

?>