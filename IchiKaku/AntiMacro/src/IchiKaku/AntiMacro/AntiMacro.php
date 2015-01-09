<?php

namespace IchiKaku\AntiMacro;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\block\BlockBreakEvent;

class AntiMacro extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[AntiMacro]플러그인이 활성화 되었습니다" );
	}
	public function check_macro(BlockBreakEvent $e) {
		//TODO : 매크로 감지이이이이이잉
	}
	public function anti_macro() {
		//TODO : 매크로를 막는거어어어어엉
	}
	public function schedule_delay($class, $method, $second, $param) {
		$this->getServer ()->getScheduler ()->scheduleDelayedTask ( new CallbackTask ( [
				$class,
				$method
				], $param ), $second );
	}
}