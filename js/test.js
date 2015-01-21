(function(){
    var sheet = new yore.Sheet();

    var str = sheet.stat( "str").set( { is : "ability" } );
    var dex = sheet.stat( "dex").set( { is : "ability" } );
    var con = sheet.stat( "con").set( { is : "ability" } );
    var int = sheet.stat( "int").set(  { is : "ability" } );
    var wis = sheet.stat( "wis").set(  { is : "ability" } );
    var cha = sheet.stat( "cha").set(  { is : "ability" } );
    var strMod = sheet.stat( "str mod").set(  { is : "ability mod", method : "ability mod" } ).addChild(  str );
    var dexMod = sheet.stat( "dex mod").set(  { is : "ability mod", method : "ability mod" } ).addChild(  dex );
    var conMod = sheet.stat( "con mod").set(  { is : "ability mod", method : "ability mod" } ).addChild(  con );
    var intMod = sheet.stat( "int mod").set(  { is : "ability mod", method : "ability mod" } ).addChild(  int );
    var wisMod = sheet.stat( "wis mod").set(  { is : "ability mod", method : "ability mod" } ).addChild(  wis );
    var chaMod = sheet.stat( "cha mod").set(  { is : "ability mod", method : "ability mod" } ).addChild(  cha );

    str.addend( sheet ).set(  { value : 15 } );
    dex.addend( sheet ).set(  { value : 13 } );
    con.addend( sheet ).set(  { value : 12 } );
    int.addend( sheet ).set(  { value : 10 } );
    wis.addend( sheet ).set(  { value : 9 } );
    cha.addend( sheet ).set(  { value : 8 } );

    var bab = sheet.stat( "base attack bonus").set(  {is : "offense", method : "constant", value : 3 } );

    var cmb = sheet.stat( "combat maneuver bonus").set(  { is : "offense"});
    cmb.addChild(  bab ).addChild(  strMod );

    var ac = sheet.stat( "armor class").set(  {is : "defense"} );
    ac.addend( sheet).set(  { value : 10 } );
    ac.addChild(  dexMod );

    var cmd = sheet.stat( "combat maneuver defense").set(  {is : "defense" } );
    cmd.addend( sheet).set(  { value : 10 } );
    cmd.addChild(  dexMod).addChild(  strMod).addChild(  bab );

    //saves
    var ref = sheet.stat( "reflex").addend(  { name : "base" } );
    ref.addChild(  dexMod );
    var fort = sheet.stat( "fortitude").addend(  {name : "base"} );
    fort.addChild(  conMod );
    var will = sheet.stat( "will").addend(  {name : "base "});
    will.addChild(  wisMod );

    skillBlock(  [
        {
            name : "acrobatics",
            ability : "dex"
        },
        {
            name : "appraise",
            ability : "int"
        },
        {
            name : "bluff",
            ability : "cha"
        },
        {
            name : "climb",
            ability : "str"
        },
        {
            name : "diplomacy",
            ability : "cha"
        },
        {
            name: "disable device",
            ability: "dex"
        },
        {
            name : "craft",
            ability : "int"
        },
        {
            name : "disguise",
            ability : "cha"
        },
        {
            name : "escape artist",
            ability : "dex"
        },
        {
            name : "fly",
            ability : "dex"
        },
        {
            name : "handle animal",
            ability : "cha"
        },
        {
            name : "heal",
            ability : "wis"
        },
        {
            name : "intimidate",
            ability : "cha"
        },
        {
            name : "knowledge (arcana)",
            ability : "cha"
        },
        {
            name : "knowledge (dungeoneering)",
            ability : "int"
        },
        {
            name : "knowledge (engineering)",
            ability : "int"
        },
        {
            name : "knowledge (geography)",
            ability : "int"
        },
        {
            name : "knowledge (history)",
            ability : "int"
        },
        {
            name : "knowledge (local)",
            ability : "int"
        },
        {
            name : "knowledge (nature)",
            ability : "int"
        },
        {
            name : "knowledge (nobility)",
            ability : "int"
        },
        {
            name : "knowledge (planes)",
            ability : "int"
        },
        {
            name : "knowledge (religion)",
            ability : "int"
        },
        {
            name : "linguistics",
            ability : "int"
        },
        {
            name : "perception",
            ability : "wis"
        },
        {
            name : "perform",
            ability : "cha"
        },
        {
            name : "profession",
            ability : "wis",
            chance : 1
        },
        {
            name : "ride",
            ability : "dex"
        },
        {
            name : "sense motive",
            ability : "wis"
        },
        {
            name : "sleight of hand",
            ability : "dex"
        },
        {
            name : "spellcraft",
            ability : "int"
        },
        {
            name : "stealth",
            ability : "dex"
        },
        {
            name : "survival",
            ability : "wis"
        },
        {
            name : "swim",
            ability : "str"
        },
        {
            name : "use magic device",
            ability : "cha"
        }
    ] );

    function skillBlock(  pairs ){
        pairs.forEach( function( pair ){
           sheet.skill( pair.name, pair.ability );
        });
    }

    window.sheet = sheet;
})();