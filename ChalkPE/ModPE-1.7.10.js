addItemInventory = function(par1int, par2int, par3int);
bl_setMobSkin = function(par1int, par2String);
bl_spawnMob = function(par1double, par2double, par3double, par4int, par5String);
clientMessage = function(par1String);
explode = function(par1double, par2double, par3double, par4double);
getCarriedItem = function();
getLevel = function();
getPitch = function(par1Object);
getPlayerEnt = function();
getPlayerX = function();
getPlayerY = function();
getPlayerZ = function();
getTile = function(par1int, par2int, par3int);
getYaw = function(par1Object);
preventDefault = function();
print = function(par1String);
rideAnimal = function(par1int, par2int);
setNightMode = function(par1boolean);
setPosition = function(par1int, par2double, par3double, par4double);
setPositionRelative = function(par1int, par2double, par3double, par4double);
setRot = function(par1int, par2double, par3double);
setTile = function(par1int, par2int, par3int, par4int, par5int);
setVelX = function(par1int, par2double);
setVelY = function(par1int, par2double);
setVelZ = function(par1int, par2double);
spawnChicken = function(par1double, par2double, par3double, par4String);
spawnCow = function(par1double, par2double, par3double, par4String);
spawnPigZombie = function(par1double, par2double, par3double, par4int, par5String);

var ModPE = {};
ModPE.langEdit = function(par1String, par2String);
ModPE.leaveGame = function();
ModPE.log = function(par1String);
ModPE.overrideTexture = function(par1String, par2String);
ModPE.readData = function(par1String);
ModPE.removeData = function(par1String);
ModPE.resetFov = function();
ModPE.resetImages = function();
ModPE.saveData = function(par1String, par2String);
ModPE.selectLevel = function(par1String, par2String, par3String, par4int);
ModPE.setCamera = function(par1int);
ModPE.setFoodItem = function(par1int, par2String, par3int, par4int, par5String, par6int);
ModPE.setFov = function(par1double);
ModPE.setGameSpeed = function(par1double);
ModPE.setGuiBlocks = function(par1String);
ModPE.setItem = function(par1int, par2String, par3int, par4String, par5int);
ModPE.setItems = function(par1String);
ModPE.setTerrain = function(par1String);
ModPE.showTipMessage = function(par1String);
ModPE.takeScreenshot = function(par1String);

var Level = {};
Level.addParticle = function(par1int, par2double, par3double, par4double, par5double, par6double, par7double, par8int);
Level.destroyBlock = function(par1int, par2int, par3int, par4boolean);
Level.dropItem = function(par1double, par2double, par3double, par4double, par5int, par6int, par7int);
Level.explode = function(par1double, par2double, par3double, par4double);
Level.getAddress = function();
Level.getBiome = function(par1int, par2int);
Level.getBiomeName = function(par1int, par2int);
Level.getBrightness = function(par1int, par2int, par3int);
Level.getChestSlot = function(par1int, par2int, par3int, par4int);
Level.getChestSlotCount = function(par1int, par2int, par3int, par4int);
Level.getChestSlotData = function(par1int, par2int, par3int, par4int);
Level.getData = function(par1int, par2int, par3int);
Level.getFurnaceSlot = function(par1int, par2int, par3int, par4int);
Level.getFurnaceSlotCount = function(par1int, par2int, par3int, par4int);
Level.getFurnaceSlotData = function(par1int, par2int, par3int, par4int);
Level.getGameMode = function();
Level.getGrassColor = function(par1int, par2int);
Level.getSignText = function(par1int, par2int, par3int, par4int);
Level.getTile = function(par1int, par2int, par3int);
Level.getTime = function();
Level.getWorldDir = function();
Level.getWorldName = function();
Level.playSound = function(par1double, par2double, par3double, par4String, par5double, par6double);
Level.playSoundEnt = function(par1int, par2String, par3double, par4double);
Level.setChestSlot = function(par1int, par2int, par3int, par4int, par5int, par6int, par7int);
Level.setFurnaceSlot = function(par1int, par2int, par3int, par4int, par5int, par6int, par7int);
Level.setGameMode = function(par1int);
Level.setGrassColor = function(par1int, par2int, par3int);
Level.setNightMode = function(par1boolean);
Level.setSignText = function(par1int, par2int, par3int, par4int, par5String);
Level.setSpawn = function(par1int, par2int, par3int);
Level.setTile = function(par1int, par2int, par3int, par4int, par5int);
Level.setTime = function(par1int);
Level.spawnChicken = function(par1double, par2double, par3double, par4String);
Level.spawnCow = function(par1double, par2double, par3double, par4String);
Level.spawnMob = function(par1double, par2double, par3double, par4int, par5String);

var Player = {};
Player.addItemCreativeInv = function(par1int, par2int, par3int);
Player.addItemInventory = function(par1int, par2int, par3int);
Player.canFly = function();
Player.clearInventorySlot = function(par1int);
Player.getArmorSlot = function(par1int);
Player.getArmorSlotDamage = function(par1int);
Player.getCarriedItem = function();
Player.getCarriedItemCount = function();
Player.getCarriedItemData = function();
Player.getEntity = function();
Player.getInventorySlot = function(par1int);
Player.getInventorySlotCount = function(par1int);
Player.getInventorySlotData = function(par1int);
Player.getName = function(par1int);
Player.getPointedBlockData = function();
Player.getPointedBlockId = function();
Player.getPointedBlockSide = function();
Player.getPointedBlockX = function();
Player.getPointedBlockY = function();
Player.getPointedBlockZ = function();
Player.getPointedEntity = function();
Player.getSelectedSlotId = function();
Player.getX = function();
Player.getY = function();
Player.getZ = function();
Player.isFlying = function();
Player.isPlayer = function(par1int);
Player.setArmorSlot = function(par1int, par2int, par3int);
Player.setCanFly = function(par1boolean);
Player.setFlying = function(par1boolean);
Player.setHealth = function(par1int);

var Entity = {};
Entity.getAll = function();
Entity.getAnimalAge = function(par1int);
Entity.getEntityTypeId = function(par1int);
Entity.getHealth = function(par1int);
Entity.getMobSkin = function(par1int);
Entity.getNameTag = function(par1int);
Entity.getPitch = function(par1int);
Entity.getRenderType = function(par1int);
Entity.getRider = function(par1int);
Entity.getRiding = function(par1int);
Entity.getUniqueId = function(par1int);
Entity.getVelX = function(par1int);
Entity.getVelY = function(par1int);
Entity.getVelZ = function(par1int);
Entity.getX = function(par1int);
Entity.getY = function(par1int);
Entity.getYaw = function(par1int);
Entity.getZ = function(par1int);
Entity.remove = function(par1int);
Entity.rideAnimal = function(par1int, par2int);
Entity.setAnimalAge = function(par1int, par2int);
Entity.setCarriedItem = function(par1int, par2int, par3int, par4int);
Entity.setFireTicks = function(par1int, par2int);
Entity.setHealth = function(par1int, par2int);
Entity.setMobSkin = function(par1int, par2String);
Entity.setNameTag = function(par1int, par2String);
Entity.setPosition = function(par1int, par2double, par3double, par4double);
Entity.setPositionRelative = function(par1int, par2double, par3double, par4double);
Entity.setRenderType = function(par1int, par2int);
Entity.setRot = function(par1int, par2double, par3double);
Entity.setSneaking = function(par1int, par2boolean);
Entity.setVelX = function(par1int, par2double);
Entity.setVelY = function(par1int, par2double);
Entity.setVelZ = function(par1int, par2double);
Entity.spawnMob = function(par1double, par2double, par3double, par4int, par5String);

var Item = {};
Item.addCraftRecipe = function(par1int, par2int, par3int, par4Scriptable);
Item.addFurnaceRecipe = function(par1int, par2int, par3int);
Item.addShapedRecipe = function(par1int, par2int, par3int, par4Scriptable, par5Scriptable);
Item.getName = function(par1int, par2int, par3boolean);
Item.setCategory = function(par1int, par2int, par3int);
Item.setMaxDamage = function(par1int, par2int);

var Block = {};
Block.defineBlock = function(par1int, par2String, par3Object, par4Object, par5Object, par6Object);
Block.getRenderType = function(par1int);
Block.setColor = function(par1int, par2Scriptable);
Block.setDestroyTime = function(par1int, par2double);
Block.setExplosionResistance = function(par1int, par2double);
Block.setLightLevel = function(par1int, par2int);
Block.setRenderLayer = function(par1int, par2int);
Block.setRenderType = function(par1int, par2int);
Block.setShape = function(par1int, par2double, par3double, par4double, par5double, par6double, par7double);

var Server = {};
Server.getAddress = function();
Server.getAllPlayerNames = function();
Server.getAllPlayers = function();
Server.getPort = function();
Server.joinServer = function(par1String, par2int);
Server.sendChat = function(par1String);

var ChatColor = {};
ChatColor.BEGIN = "\u00a7";
ChatColor.BLACK = ChatColor.BEGIN + "0";
ChatColor.DARK_BLUE = ChatColor.BEGIN + "1";
ChatColor.DARK_GREEN = ChatColor.BEGIN + "2";
ChatColor.DARK_AQUA = ChatColor.BEGIN + "3";
ChatColor.DARK_RED = ChatColor.BEGIN + "4";
ChatColor.DARK_PURPLE = ChatColor.BEGIN + "5";
ChatColor.GOLD = ChatColor.BEGIN + "6";
ChatColor.GRAY = ChatColor.BEGIN + "7";
ChatColor.DARK_GRAY = ChatColor.BEGIN + "8";
ChatColor.BLUE = ChatColor.BEGIN + "9";
ChatColor.GREEN = ChatColor.BEGIN + "a";
ChatColor.AQUA = ChatColor.BEGIN + "b";
ChatColor.RED = ChatColor.BEGIN + "c";
ChatColor.LIGHT_PURPLE = ChatColor.BEGIN + "d";
ChatColor.YELLOW = ChatColor.BEGIN + "e";
ChatColor.WHITE = ChatColor.BEGIN + "f";

var ItemCategory = {};
ItemCategory.INTERNAL = -1;
ItemCategory.MATERIAL = 1;
ItemCategory.TOOL = 2;
ItemCategory.FOOD = 4;
ItemCategory.DECORATION = 8;

var ParticleType = {};
ParticleType.blockcrack = 1;
ParticleType.crit = 2;
ParticleType.smoke = 3;
ParticleType.cloud = 4;
ParticleType.flame = 5;
ParticleType.lava = 6;
ParticleType.redstone = 8;
ParticleType.itemcrack = 9;
ParticleType.snowballpoof = 10;
ParticleType.mobFlame = 13;
ParticleType.heart = 14;