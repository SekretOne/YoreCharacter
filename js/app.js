/**
 * Created by Nathan on 1/18/2015.
 */

(function(){
    var app = angular.module( "yoreApp", [ 'ngRoute', 'ui.bootstrap'] );

    /*app.run(function($rootScope, $templateCache) {
        $rootScope.$on('$viewContentLoaded', function() {
            $templateCache.removeAll();
        });
    });*/

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
        this.makeCharacter = function(){
            var character= yore.makeCharacter();
            $location.path( "char/" + character.id + "/overview" );
        };

        this.remove = function( character ){ delete this.characters[ character.id ]; }
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
            this.items.push( this.edit.item );
            this.edit.item = sheet.makeItem();
        };

        this.totalWeight = function( items ){
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

        this.hphd = sheet.get( { is : "hp from hd"} );
        this.hp = sheet.get( { name : "hit points", is : "hp" } );
        this.wounds = sheet.get( { is : "wounds" });
        this.nl = sheet.get( { is : "nl" });

        this.totalRanks = function(){
            var total = 0;
            for( var i = 0; i < this.skills.length; i++ ){
                total += this.skills[i].ranks.value;
            }
            return total;
        };

        this.checkDie = function( die ){  //pops this die if set to nothing.
            if( die.value == 0 || die.value == NaN ){
                die.removeSelf();
            }
            save();
        };

        this.addDie = function( value ){
            this.hphd.addend({ name : "hit die", is : "hit die", value : value });
            this.newDie = '';
            this.currentHp = this.hp.value - this.wounds.value;  //refresh current hit points;
        };

        this.health = function(){
            var ratio = this.wounds.value / this.hp.value;
            if( ratio < 1/3 ){ return "healthy" }
            if( ratio < 2/3 ){ return "wounded" }
            if( ratio < 1 ){ return "critical" }
            return "negative";
        }
    }]);

    //================================================================================================================//

    app.directive( "yoreStat", function(){
        return {
            restrict: 'E',
            scope : { stat : "=", displayName : "=", dc: "=" },
            templateUrl: "directives/yoreStat.html",
            controller : "StatDetailCtrl",
            controllerAs : "statCtrl"
        };
    })
        .controller( "StatDetailCtrl", [ "$scope", "$modal", function( $scope, $modal){
            this.displayName = $scope.displayName === undefined ? $scope.stat.name : $scope.displayName;
            this.collapsed = true;

            this.openDetail = function( addend ){
                var modal = $modal.open({
                   templateUrl : "modals/addend-editor.html",
                    controller : "AddendEditorCtrl",
                    controllerAs : "editor",
                    resolve: {
                        addend: function(){ return addend }
                    }
                });
            }
        }])
        .controller( "AddendEditorCtrl", [ "$modalInstance", "addend", function( $modalInstance, addend){
            this.addend = addend;
        }]);

    //----------------------------------------------------------------------------------------------------------------//
    app.filter( "modifier", function(){
        return function( value ){
            return value >= 0 ? "+"+ value : value;
        }
    });

    app.filter( "typeClear", function(){
        return function( type ){
            return type === "untyped" ? "" : type;
        }
    });

    //=================================================================================================================//
    function loadFromStorage(  ){
        //load from local storage
        //localStorage.removeItem( "sheets");
        var data = localStorage.getItem( "sheets" );
        if( data !== null ){
            data = angular.fromJson( data );
            var sheetMap = {};
            for( var sheetId in data ){
                sheetMap[ sheetId ] = new yore.Sheet( data[sheetId] );
            }
            yore.setSheets( sheetMap );
        }
    }

    function save(  ){
        var sheets = yore.getSheets();
        localStorage.setItem( "sheets", angular.toJson( sheets ) );
    }
})();