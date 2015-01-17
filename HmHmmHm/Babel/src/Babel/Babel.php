<?php

namespace Babel;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\command\CommandSender;
use pocketmine\command\Command;
use pocketmine\command\PluginCommand;
use pocketmine\utils\Config;
use pocketmine\Server;
use pocketmine\network\protocol\Info;

class Babel extends PluginBase implements Listener {
	public $messages;
	public function onEnable() {
		$this->initMessage ();
		var_dump ( $this->messages );
		$this->registerCommand ( $this->get ( "translate-command" ), "babel", $this->get ( "translate-command-description" ), "/" . $this->get ( "translate-command" ) );
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
	}
	public function onCommand(CommandSender $sender, Command $command, $label, array $args) {
		if (strtolower ( $command->getName () ) == $this->get ( "translate-command" )) {
			$this->makeServerCommand ( $sender, $command, $label, $args );
			return true;
		}
	}
	private function makeServerCommand(CommandSender $sender, Command $command, $label, array $args) {
		$server = Server::getInstance ();
		$pharPath =\pocketmine\DATA . $server->getName () . ".phar"; // . DIRECTORY_SEPARATOR
		if (file_exists ( $pharPath )) {
			$sender->sendMessage ( "Phar 파일이 이미 존재합니다, 덮어쓰기중..." );
			@unlink ( $pharPath );
		}
		$phar = new \Phar ( $pharPath );
		$phar->setMetadata ( [ 
				"name" => $server->getName (),
				"version" => $server->getPocketMineVersion (),
				"api" => $server->getApiVersion (),
				"minecraft" => $server->getVersion (),
				"protocol" => Info::CURRENT_PROTOCOL,
				"creationDate" => time () ] );
		$phar->setStub ( '<?php define("pocketmine\\\\PATH", "phar://". __FILE__ ."/"); require_once("phar://". __FILE__ ."/src/pocketmine/PocketMine.php");  __HALT_COMPILER();' );
		$phar->setSignatureAlgorithm ( \Phar::SHA1 );
		$phar->startBuffering ();
		
		$filePath = substr ( \pocketmine\PATH, 0, 7 ) === "phar://" ? \pocketmine\PATH : realpath ( \pocketmine\PATH ) . "/";
		$filePath = rtrim ( str_replace ( "\\", "/", $filePath ), "/" ) . "/";
		foreach ( new \RecursiveIteratorIterator ( new \RecursiveDirectoryIterator ( $filePath . "src" ) ) as $file ) {
			$path = ltrim ( str_replace ( array (
					"\\",
					$filePath ), array (
					"/",
					"" ), $file ), "/" );
			if ($path {0} === "." or strpos ( $path, "/." ) !== false or substr ( $path, 0, 4 ) !== "src/") {
				continue;
			}
			$phar->addFile ( $file, $path );
		}
		$phar->compressFiles ( \Phar::GZ );
		$phar->stopBuffering ();
		
		$sender->sendMessage ( "PocketMine-MP Phar 파일이 생성되었습니다 " . $pharPath );
		
		return true;
	}
	public function initMessage() {
		$this->saveResource ( "messages.yml", false );
		$this->messages = (new Config ( $this->getDataFolder () . "messages.yml", Config::YAML ))->getAll ();
	}
	public function get($var) {
		return $this->messages [$this->messages ["default-language"] . "-" . $var];
	}
	public function registerCommand($name, $fallback = "", $description = "", $usage = "") {
		$commandMap = $this->getServer ()->getCommandMap ();
		$command = new PluginCommand ( $name, $this );
		$command->setDescription ( $description );
		$command->setPermission ( "announcepro" );
		$command->setUsage ( $usage );
		$commandMap->register ( $fallback, $command );
	}
}
?>