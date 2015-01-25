/**
 * Created by Nathan on 1/18/2015.
 */

(function(){
    var app = angular.module( "yoreApp", [ 'ngRoute'] );

    app.config(  ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $routeProvider.when( "/gallery",
            {
                templateUrl: "views/gallery.html",
                controller: "CharacterGalleryCtrl",
                controllerAs: "gallery"
            }
        )
        .when(  "/char/:charId",
            {
                templateUrl: "views/front.html",
                controller: "StatListController",
                controllerAs: "front"
            }
        ).when(  "/inventory",
            {
                templateUrl :"inventory.html",
                controller: "InventoryController"
            }
        );

        $locationProvider.html5Mode(true);
        $locationProvider.baseHref = "/YoreChar3/"
    }]);

    app.controller( "MainCtrl", ['$route', '$routeParams', '$location',
        function($route, $routeParams, $location){

            this.$route = $route;
            this.$location = $location;
            this.$routeParams = $routeParams;
    }]);

    app.controller( "InventoryController", function(){

    });

    /**
     * Select characters
     */
    app.controller( "CharacterGalleryCtrl", ['$route', '$routeParams', '$location', function($route, $routeParams, $location) {
        this.characters = yore._sheets;
    }]);


    /**
     * Will probably be turned into the main sheet
     */
    app.controller( "StatListController", ['$routeParams', function($routeParams) {
        console.log("anything?");
        console.log( $routeParams.charId );
        var sheet =  yore.getSheet( $routeParams.charId );

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
})();