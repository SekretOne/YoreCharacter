(function(){
    yore.makeCharacter = function (){
        var sheet = yore.makeSheet();

        var str = sheet.stat( { name: "str", is: "ability"});
        var dex = sheet.stat( { name: "dex", is: "ability"});
        var con = sheet.stat( { name: "con", is: "ability"});
        var int = sheet.stat( { name: "int", is: "ability"});
        var wis = sheet.stat( { name: "wis", is: "ability"});
        var cha = sheet.stat( { name: "cha", is: "ability"});
        var strMod = sheet.stat( {name : "str mod", is: "ability mod", method: "ability mod"}).addChild(str);
        var dexMod = sheet.stat( {name : "dex mod", is: "ability mod", method: "ability mod"}).addChild(dex);
        var conMod = sheet.stat( {name : "con mod", is: "ability mod", method: "ability mod"}).addChild(con);
        var intMod = sheet.stat( {name : "int mod", is: "ability mod", method: "ability mod"}).addChild(int);
        var wisMod = sheet.stat( {name : "wis mod", is: "ability mod", method: "ability mod"}).addChild(wis);
        var chaMod = sheet.stat( {name : "cha mod", is: "ability mod", method: "ability mod"}).addChild(cha);

        str.addend().set({value: 15});
        dex.addend().set({value: 13});
        con.addend().set({value: 12});
        int.addend().set({value: 10});
        wis.addend().set({value: 9});
        cha.addend().set({value: 8});

        var bab = sheet.stat( { name : "base attack bonus", is: "offense", method: "constant", value: 3 });

        var cmb = sheet.stat( { name : "combat maneuver bonus", is: "offense"});
        cmb.addChild(bab).addChild(strMod);

        var ac = sheet.stat( { name : "armor class", is: "defense"});
        ac.addend().set({value: 10});
        ac.addChild(dexMod);

        var cmd = sheet.stat( { name :"combat maneuver defense", is: "defense"});
        cmd.addend().set({ value: 10 });
        cmd.addChild(dexMod).addChild(strMod).addChild(bab);

        //saves
        var ref = sheet.stat( { name: "reflex", is: "save" });//.addend({name: "base"});
        ref.addChild(dexMod);
        var fort = sheet.stat( { name:"fortitude", is: "save" });//.addend({name: "base"});
        fort.addChild(conMod);
        var will = sheet.stat( { name: "will", is: "save"});//.addend({name: "base" });
        will.addChild(wisMod);

        skillBlock([
            {
                name: "acrobatics",
                ability: "dex"
            },
            {
                name: "appraise",
                ability: "int"
            },
            {
                name: "bluff",
                ability: "cha"
            },
            {
                name: "climb",
                ability: "str"
            },
            {
                name: "diplomacy",
                ability: "cha"
            },
            {
                name: "disable device",
                ability: "dex"
            },
            {
                name: "craft",
                ability: "int"
            },
            {
                name: "disguise",
                ability: "cha"
            },
            {
                name: "escape artist",
                ability: "dex"
            },
            {
                name: "fly",
                ability: "dex"
            },
            {
                name: "handle animal",
                ability: "cha"
            },
            {
                name: "heal",
                ability: "wis"
            },
            {
                name: "intimidate",
                ability: "cha"
            },
            {
                name: "knowledge (arcana)",
                ability: "cha"
            },
            {
                name: "knowledge (dungeoneering)",
                ability: "int"
            },
            {
                name: "knowledge (engineering)",
                ability: "int"
            },
            {
                name: "knowledge (geography)",
                ability: "int"
            },
            {
                name: "knowledge (history)",
                ability: "int"
            },
            {
                name: "knowledge (local)",
                ability: "int"
            },
            {
                name: "knowledge (nature)",
                ability: "int"
            },
            {
                name: "knowledge (nobility)",
                ability: "int"
            },
            {
                name: "knowledge (planes)",
                ability: "int"
            },
            {
                name: "knowledge (religion)",
                ability: "int"
            },
            {
                name: "linguistics",
                ability: "int"
            },
            {
                name: "perception",
                ability: "wis"
            },
            {
                name: "perform",
                ability: "cha"
            },
            {
                name: "profession",
                ability: "wis",
                chance: 1
            },
            {
                name: "ride",
                ability: "dex"
            },
            {
                name: "sense motive",
                ability: "wis"
            },
            {
                name: "sleight of hand",
                ability: "dex"
            },
            {
                name: "spellcraft",
                ability: "int"
            },
            {
                name: "stealth",
                ability: "dex"
            },
            {
                name: "survival",
                ability: "wis"
            },
            {
                name: "swim",
                ability: "str"
            },
            {
                name: "use magic device",
                ability: "cha"
            }
        ]);

        function skillBlock(pairs) {
            pairs.forEach(function (pair) {
                sheet.skill(pair.name, pair.ability);
            });
        }

        return sheet;
    }
})();