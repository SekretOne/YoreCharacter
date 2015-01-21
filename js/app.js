/**
 * Created by Nathan on 1/18/2015.
 */

(function(){
    var app = angular.module( "yoreApp", [] );

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

        $scope.totalRanks = function(){
            var total = 0;
            for( var i = 0; i < $scope.skills.length; i++ ){
                total += $scope.skills[i].ranks.value;
            }
            return total;
        };
    });

    app.filter( "stats", function(){
        return function( bindables ){
            var array = [];
            for( var i = 0; i < bindables.length; i++ ){
                var b = bindables[i];
                if(b.is !== 'A' ){ array.push( b ); }
            }
            return array;
        }
    } );

    app.filter( "skills", function(){
        return function( bindables ){
            var array = [];
            for( var i = 0; i < bindables.length; i++ ){
                var b = bindables[i];
                if(b.is === 'skill' ){ array.push( b ); }
            }
            return array;
        }
    } );
})();