<?php
namespace IchiKaku\CommandLog;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;

class CommandLog extends PluginBase implements Listener {
	public function onEnable() {
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->getServer ()->getLogger ()->info ( TextFormat::GOLD . "[CommandLog]플러그인이 활성화 되었습니다" );
	}
	public function commandLog(PlayerCommandPreprocessEvent $e) {
		// TODO: Block the command which repeats too fast
		$cmd = $e->getMessage ();
		$name = $e->getPlayer ()->getName ();
		if (strpos ( $cmd, "/" ) === 0) {
			$this->getServer ()->getLogger ()->info ("[커맨드 사용 알림] [" . $name . "] " . $cmd);
		}
	}
}