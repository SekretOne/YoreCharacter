(function(){
    var sheet = new yore.Sheet();

    var str = sheet.stat( "str").set( sheet, { is : "ability" } );
    var dex = sheet.stat( "dex").set( sheet, { is : "ability" } );
    var con = sheet.stat( "con").set( sheet, { is : "ability" } );
    var int = sheet.stat( "int").set( sheet, { is : "ability" } );
    var wis = sheet.stat( "wis").set( sheet, { is : "ability" } );
    var cha = sheet.stat( "cha").set( sheet, { is : "ability" } );
    var strMod = sheet.stat( "str mod").set( sheet, { is : "ability mod", method : "ability mod" } ).addChild( sheet, str );
    var dexMod = sheet.stat( "dex mod").set( sheet, { is : "ability mod", method : "ability mod" } ).addChild( sheet, dex );
    var conMod = sheet.stat( "con mod").set( sheet, { is : "ability mod", method : "ability mod" } ).addChild( sheet, con );
    var intMod = sheet.stat( "int mod").set( sheet, { is : "ability mod", method : "ability mod" } ).addChild( sheet, int );
    var wisMod = sheet.stat( "wis mod").set( sheet, { is : "ability mod", method : "ability mod" } ).addChild( sheet, wis );
    var chaMod = sheet.stat( "cha mod").set( sheet, { is : "ability mod", method : "ability mod" } ).addChild( sheet, cha );

    str.addend( sheet ).set( sheet, { value : 15 } );
    dex.addend( sheet ).set( sheet, { value : 13 } );
    con.addend( sheet ).set( sheet, { value : 12 } );
    int.addend( sheet ).set( sheet, { value : 10 } );
    wis.addend( sheet ).set( sheet, { value : 9 } );
    cha.addend( sheet ).set( sheet, { value : 8 } );

    var bab = sheet.stat( "base attack bonus").set( sheet, {is : "offense", method : "constant", value : 3 } );

    var cmb = sheet.stat( "combat maneuver bonus").set( sheet, { is : "offense"});
    cmb.addChild( sheet, bab ).addChild( sheet, strMod );

    var ac = sheet.stat( "armor class").set( sheet, {is : "defense"} );
    ac.addend( sheet).set( sheet, { value : 10 } );
    ac.addChild( sheet, dexMod );

    var cmd = sheet.stat( "combat maneuver defense").set( sheet, {is : "defense" } );
    cmd.addend( sheet).set( sheet, { value : 10 } );
    cmd.addChild( sheet, dexMod).addChild( sheet, strMod).addChild( sheet, bab );

    //saves
    var ref = sheet.stat( "reflex").addend( sheet, { name : "base" } );
    ref.addChild( sheet, dexMod );
    var fort = sheet.stat( "fortitude").addend( sheet, {name : "base"} );
    fort.addChild( sheet, conMod );
    var will = sheet.stat( "will").addend( sheet, {name : "base "});
    will.addChild( sheet, wisMod );

    skillBlock( sheet, [
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

    function skillBlock( sheet, pairs ){
        pairs.forEach( function( pair ){
           sheet.skill( pair.name, pair.ability );
        });
    }

    window.sheet = sheet;
})();