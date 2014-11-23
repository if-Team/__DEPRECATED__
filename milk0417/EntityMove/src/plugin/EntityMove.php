<?php

namespace plugin;

//동물
use plugin\AnimalEntity\Animal;
use plugin\AnimalEntity\Chicken;
use plugin\AnimalEntity\Cow;
use plugin\AnimalEntity\Pig;
use plugin\AnimalEntity\Sheep;

//몬스터
use plugin\MonsterEntity\Creeper;
use plugin\MonsterEntity\Monster;
use plugin\MonsterEntity\PigZombie;
use plugin\MonsterEntity\Skeleton;
use plugin\MonsterEntity\Spider;
use plugin\MonsterEntity\Zombie;

use pocketmine\Player;
use pocketmine\Server;
use pocketmine\item\Item;
use pocketmine\math\Vector3;
use pocketmine\nbt\tag\Enum;
use pocketmine\nbt\tag\Float;
use pocketmine\entity\Entity;
use pocketmine\level\Position;
use pocketmine\nbt\tag\Double;
use pocketmine\event\Listener;
use pocketmine\command\Command;
use pocketmine\nbt\tag\Compound;
use pocketmine\utils\TextFormat;
use pocketmine\plugin\PluginBase;
use pocketmine\command\CommandSender;
use pocketmine\scheduler\CallbackTask;
use pocketmine\event\player\PlayerInteractEvent;

class EntityMove extends PluginBase implements Listener{

    public static $data;
    public static $path;

    public static $shortName = [
        Cow::NETWORK_ID => "Cow",
        Pig::NETWORK_ID => "Pig",
        Sheep::NETWORK_ID => "Sheep",
        Chicken::NETWORK_ID => "Chicken",

        Zombie::NETWORK_ID => "Zombie",
        Creeper::NETWORK_ID => "Creeper",
        Skeleton::NETWORK_ID => "Skeleton",
        Spider::NETWORK_ID => "Spider",
        PigZombie::NETWORK_ID => "PigZombie",
    ];

    public function onEnable(){
        //if($this->isPhar() === true){
            $this->yamldata();
            /*Entity::registerEntity(Cow::class);
            Entity::registerEntity(Pig::class);
            Entity::registerEntity(Sheep::class);
            Entity::registerEntity(Chicken::class);*/

            Entity::registerEntity(Zombie::class);
            Entity::registerEntity(Creeper::class);
            Entity::registerEntity(Skeleton::class);
            Entity::registerEntity(Spider::class);
            Entity::registerEntity(PigZombie::class);

            EntityMove::core()->getPluginManager()->registerEvents($this, $this);
            EntityMove::core()->getScheduler()->scheduleRepeatingTask(new CallbackTask([$this, "SpawningEntity"]), 5);

            EntityMove::core()->getLogger()->info(TextFormat::GOLD . "[EntityMove]플러그인이 활성화 되었습니다");
        /*}else{
             EntityMove::core()->getLogger()->info(TextFormat::GOLD . "[EntityMove]플러그인을 Phar파일로 변환해주세요");
         }*/
    }

    public static function getEntityDefaultHealth(Entity $entity){
        try{
            $health = [
                Cow::NETWORK_ID => 10,
                Pig::NETWORK_ID => 10,
                Sheep::NETWORK_ID => 8,
                Chicken::NETWORK_ID => 4,

                Zombie::NETWORK_ID => 20,
                Creeper::NETWORK_ID => 20,
                Skeleton::NETWORK_ID => 20,
                Spider::NETWORK_ID => 16,
                PigZombie::NETWORK_ID => 22,
            ];
            return $health[$entity::NETWORK_ID];
        }catch (\Exception $e){
            return 20;
        }
    }

    public static function yaml($file){
        return preg_replace("#^([ ]*)([a-zA-Z_]{1}[^\:]*)\:#m", "$1\"$2\":", file_get_contents($file));
    }

    public static function core(){
        return Server::getInstance();
    }

    /**
     * @return Entity[]
     */
    public static function getEntities(){
        $entities = [];
        foreach(EntityMove::core()->getDefaultLevel()->getEntities() as $id => $ent){
            if($ent instanceof Animal || $ent instanceof Monster) $entities[$id] = $ent;
        }
        return $entities;
    }

    public function yamldata(){
        EntityMove::$path = EntityMove::core()->getDataPath()."plugins/EntityMove/";
        @mkdir(EntityMove::$path);
        if(file_exists(EntityMove::$path. "EntitySetting.yml")){
            EntityMove::$data = yaml_parse($this->yaml(EntityMove::$path . "EntitySetting.yml"));
        }else{
            EntityMove::$data = [
                "MaxEntityCount" => 15,
                "SpawnAnimal" => true,
                "SpawnMonster" => true
            ];
            file_put_contents(EntityMove::$path . "EntitySetting.yml", yaml_emit(EntityMove::$data, YAML_UTF8_ENCODING));
        }
    }

    /**
     * @param int|string $type
     * @param Position $source
     *
     * @return bool|Entity
     */

    public static function createEntity($type, Position $source){
        $nbt = new Compound("", [
            "Pos" => new Enum("Pos", [
                new Double("", $source->x),
                new Double("", $source->y),
                new Double("", $source->z)
            ]),
            "Motion" => new Enum("Motion", [
                new Double("", 0),
                new Double("", 0),
                new Double("", 0)
            ]),
            "Rotation" => new Enum("Rotation", [
                new Float("", 0),
                new Float("", 0)
            ]),
        ]);
        $chunk = $source->getLevel()->getChunk($source->getX() >> 4, $source->getZ() >> 4);
        $entity = Entity::createEntity(is_int($type) ? self::$shortName[$type] : $type, $chunk, $nbt);
        try{
            $entity->setHealth(self::getEntityDefaultHealth($entity));
            return $entity;
        }catch (\Exception $e){
            return null;
        }
    }

    public function SpawningEntity(){
        if(count(EntityMove::getEntities()) >= EntityMove::$data["MaxEntityCount"]) return;
        $player = null;
        foreach(EntityMove::core()->getOnlinePlayers() as $players){
            if(mt_rand(0, 3) == 0 or $player = null) $player = $players;
        }
        if($player === null or $player->getLevel() === null) return;
        $ani = mt_rand(10, 13);
        $mob = mt_rand(32, 36);
        $level = $player->getLevel();
        $position = new Position($player->x + mt_rand(-20, 20), $player->y + mt_rand(-20, 20), $player->z + mt_rand(-20, 20), $level);
        if(
            $level->getBlock($position)->isSolid !== true
            && $level->getBlock(new Vector3($position->x, $position->y - 1, $position->z))->isSolid === true
            && $level->getBlock(new Vector3($position->x, $position->y + 1, $position->z))->isSolid !== true
            && $level->getBlock(new Vector3($position->x, $position->y + 2, $position->z))->isSolid !== true
        ){
            if(mt_rand(1,20) <= 5){
                if(EntityMove::$data["SpawnMonster"] == true) {
                    $entity = EntityMove::createEntity($mob, $position);
                    if($entity instanceof Entity) $entity->spawnToAll();
                }
            }else{
                if(EntityMove::$data["SpawnAnimal"] == true) {
                    $entity =  EntityMove::createEntity($ani, $position);
                    if($entity instanceof Entity) $entity->spawnToAll();
                }
            }
        }
    }

    public function PlayerInteractEvent(PlayerInteractEvent $ev){
        $item = $ev->getItem();
        $pos = $ev->getBlock()->getSide($ev->getFace());
        if($item->getID() === Item::SPAWN_EGG){
            $entity = EntityMove::createEntity($item->getDamage(), $pos);
            if($entity instanceof Entity) $entity->spawnToAll();
            $item->count -= 1;
            $ev->getPlayer()->getInventory()->setItemInHand($item);
            $ev->setCancelled();
            return;
        }
    }

    public function onCommand(CommandSender $i, Command $cmd, $label, array $sub){
        $output = "[EntityMove]";
        switch($cmd->getName()){
            case "제거":
                foreach(EntityMove::getEntities() as $ent) $ent->kill();
                $output .= "소환된 엔티티를 모두 제거했어요";
                break;
            case "체크":
                $output .= "현재 소환된 수:" . count(EntityMove::getEntities()) . "마리";
                break;
            case "스폰":
                if(!$i instanceof Player) return true;
                $output .= "몬스터가 소환되었어요";
                $pos = $i->getPosition();
                if(count($sub) >= 4) $pos = new Position($sub[1], $sub[2], $sub[3], $i->getLevel());
                EntityMove::createEntity($sub[0], $pos);
                break;
        }
        $i->sendMessage($output);
        return true;
    }

}

?>
