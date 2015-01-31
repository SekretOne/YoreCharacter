/**
 * Created by Nathan on 1/18/2015.
 */

(function(){
    var app = angular.module( "yoreApp", [ 'ngRoute'] );

    app.run(function($rootScope, $templateCache) {
        $rootScope.$on('$viewContentLoaded', function() {
            $templateCache.removeAll();
        });
    });

    loadFromStorage();

    app.config(  ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $routeProvider.when( "/",
            {
                templateUrl: "views/gallery.html",
                controller: "CharacterGalleryCtrl",
                controllerAs: "gallery"
            }
        ).when( "/char/:charId/overview",
            {
                templateUrl: "views/overview.html",
                controller: "OverviewController",
                controllerAs: "overview"
            }
        ).when(  "/char/:charId/front",
            {
                templateUrl: "views/stats.html",
                controller: "StatListController",
                controllerAs: "front"
            }
        ).when(  "/char/:charId/inventory",
            {
                templateUrl: "views/inventory.html",
                controller: "InventoryController",
                controllerAs: "inventory"
            }
        ).otherwise({ redirectTo: '/' });  //not even sure this is necessary

        $locationProvider.html5Mode(true);
        $locationProvider.baseHref = "/YoreChar3/"
    }]);

    /**
     * Clears the template cache on redirect so weird behavior doesn't occur during development.
     */
    /*app.run(function($rootScope, $templateCache) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (typeof(current) !== 'undefined'){
                $templateCache.remove(current.templateUrl);
            }
        });
    });*/

    app.controller( "MainCtrl", ['$route', '$routeParams', '$location',
        function($route, $routeParams, $location){

            this.$route = $route;
            this.$location = $location;
            this.$routeParams = $routeParams;
    }]);

    /**
     * Select characters
     */
    app.controller( "CharacterGalleryCtrl", ['$route', '$routeParams', '$location', function($route, $routeParams, $location) {
        save();
        this.characters = yore.getSheets();
        this.makeCharacter = yore.makeCharacter;
    }]);

    /**
     * Character's biography
     */
    app.controller( "OverviewController", ['$routeParams', function($routeParams){
        save();
        this.charId = $routeParams.charId;
        var sheet = yore.getSheet( this.charId );
        this.xp = sheet.experience;
        this.bio =  sheet.bio;

        this.add = function(){
            this.xp.current += this.addXp;
            this.addXp = '';
        }
    }]);

    /**
     * Inventory
     */
    app.controller( "InventoryController", ['$scope', '$routeParams', function($scope, $routeParams) {
        save();
        this.charId = $routeParams.charId;
        var sheet =  yore.getSheet( this.charId );
        this.items = sheet.items;

        this.edit = {};
        this.edit.item = sheet.makeItem();
        this.addItem = function( ){
            console.log( "pushing new item", this.edit.item );
            this.items.push( this.edit.item );
            this.edit.item = sheet.makeItem();
        };

        this.details = function( comparison ){
            console.log( "on blur", this.edit.item, comparison );
        };

        this.totalWeight = function( items ){
            console.log( "doing weight" );
             for( var total= 0, i = 0; i < items.length; i++ ) {
                 total += items[i].quantity * items[i].weight;
             }
            return total;
        }
    }]);
    /**
     * Will probably be turned into the main sheet
     */
    app.controller( "StatListController", ['$routeParams', function($routeParams) {
        save();
        this.charId = $routeParams.charId;
        var sheet =  yore.getSheet( this.charId );
        console.log( sheet );

        this.abilities = [];
        var abilityMods = sheet.getAll( { is : "ability mod" } );
        for( var i = 0; i < abilityMods.length; i++ ){
            this.abilities.push( {
                score : abilityMods[i].getChildren( { is : "ability" } )[0],
                mod : abilityMods[i]
            });
        }

        this.skills = [];
        var skills = sheet.getAll( { is : "skill"} );
        for( i = 0; i < skills.length; i++ ){
            var skill = skills[i];
            this.skills.push( {
                total : skill,
                cs : skill.getChildren( { is : "cs" })[0],
                ranks : skill.getChildren( { is : "ranks" })[0]
            });
        }

        this.bab = sheet.get( {name : "base attack bonus", is : "offense"} );
        this.cmb = sheet.get( {name : "combat maneuver bonus", is : "offense"} );
        this.ac = sheet.get( {name : "armor class", is : "defense"} );
        this.cmd = sheet.get( {name : "combat maneuver defense", is : "defense"} );
        this.fort = sheet.get( {name : "fortitude", is : "save"} );
        this.ref = sheet.get( {name : "reflex", is : "save"} );
        this.will = sheet.get( {name : "will", is : "save"} );

        this.totalRanks = function(){
            var total = 0;
            for( var i = 0; i < this.skills.length; i++ ){
                total += this.skills[i].ranks.value;
            }
            return total;
        };
    }]);

    app.filter( "modifier", function(){
        return function( value ){
            return value >= 0 ? "+"+ value : value;
        }
    });

    //*********//
    function makeStatCollection( sheet, names, stats ){
        var collection = [];
        var parents = sheet.getAll( stats[0] );
        for( var i = 0; i < parents.length; i++ ){
            var parent = parents[i];
            var element = {};
            element[ names[0] ] = parent;
            for( var j = 1; j < names.length; j++ ){
                element[ name[j] ] = parent.getChildren( stats[j] )[0];
            }
        }
    }

    function loadFromStorage(  ){
        //load from local storage
        var data = localStorage.getItem( "sheets" );
        console.log( data );
        if( data !== null ){
            console.log("should load");
            data = angular.fromJson( data );
            var sheetMap = {};
            for( var sheetId in data ){
                sheetMap[ sheetId ] = new yore.Sheet( data[sheetId] );
            }
            yore.setSheets( sheetMap );
        }
    }

    function save(  ){
        //console.log("saving");
        var json = angular.toJson( yore.getSheets(), true );
        console.log( json );
        localStorage.setItem( "sheets",  json );
    }
})();