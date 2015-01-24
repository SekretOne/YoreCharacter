/**
 * Created by Nathan on 1/18/2015.
 */

(function(){
    var app = angular.module( "yoreApp", [ 'ngRoute'] );

    app.config(  function($routeProvider){
        $routeProvider.when("/",
            {
                templateUrl: "pages/front.html",
                controller: "StatListController"
            }
        );
    });

    app.controller( "MainCtrl", function( $scope ){
        $scope.test = "Hey it works!";
    });


    /**
     * Will probably be turned into the main sheet
     */
    app.controller( "StatListController", function( $scope ){
        $scope.sheet = window.sheet;

        $scope.abilities = [];
        var abilityMods = sheet.getAll( { is : "ability mod" } );
        for( var i = 0; i < abilityMods.length; i++ ){
            $scope.abilities.push( {
                score : abilityMods[i].getChildren( { is : "ability" } )[0],
                mod : abilityMods[i]
            });
        }

        $scope.skills = [];
        $scope.skillRanks =[];
        var skills = sheet.getAll( { is : "skill"} );
        for( i = 0; i < skills.length; i++ ){
            var skill = skills[i];
            $scope.skills.push( {
                total : skill,
                cs : skill.getChildren( { is : "cs" })[0],
                ranks : skill.getChildren( { is : "ranks" })[0]
            });
        }

        $scope.bab = sheet.get( {name : "base attack bonus", is : "offense"} );
        $scope.cmb = sheet.get( {name : "combat maneuver bonus", is : "offense"} );
        $scope.ac = sheet.get( {name : "armor class", is : "defense"} );
        $scope.cmd = sheet.get( {name : "combat maneuver defense", is : "defense"} );
        $scope.fort = sheet.get( {name : "fortitude", is : "save"} );
        $scope.ref = sheet.get( {name : "reflex", is : "save"} );
        $scope.will = sheet.get( {name : "will", is : "save"} );

        $scope.totalRanks = function(){
            var total = 0;
            for( var i = 0; i < $scope.skills.length; i++ ){
                total += $scope.skills[i].ranks.value;
            }
            return total;
        };
    });

    app.filter( "modifier", function(){
        return function( value ){
            return value >= 0 ? "+"+ value : value;
        }
    });
})();