/**
 * Created by Nathan on 1/16/2015.
 */

(function(){
    var yore = {};

    var sheets = {};

    function getSheet( id ){
        return sheets[ id ];
    }

    yore.Sheet = function Sheet(){
        this.name = "";
        this.autoNumber = 0;
        this.bindables = [];
        this.bindings = [];
        this.stackableTypes = ["untyped", "dodge", "penalty"];  //what types are allowed to stack
        this.id = function(){
            var lastName = "-1";
            for( var sheetName in sheets ){
                if( sheets.hasOwnProperty( sheetName )){ lastName = sheetName; }
            }
            return parseInt( lastName ) +1;
        }();
        sheets[ this.id ] = this;
    };

    yore.Sheet.prototype = {
        stat : function( name ){
            var stat = new Stat(this);
            stat.name = name;
            return stat;
        },
        addend : function( stat ){
            var addend = this.stat();
            addend.is = 'A';
            addend.method = "constant";
            addend.value = 0;
            this.bind( stat, addend );
            return addend;
        },
        skill : function( name, abilityName ){
            var skill = this.stat();
            skill.is = "skill";
            skill.name = name;
            var abilityMod = this.get( { name : abilityName + " mod", is : "ability mod" } );
            skill.addChild( abilityMod );
            var ranks = skill.addend().set( { name : "ranks", value : 0, is : "ranks" } );
            var classBonus = skill.addend().addChild( ranks ).set( { name : "class skill bonus", method : "class skill", classSkill : false, is : "cs" } );
            return skill;
        },
        get : function( test ){
            for( var i = 0; i < this.bindables.length; i++ ){
                var bindable = this.bindables[i];
                if( matchesByObject( bindable, test ) ){ return bindable; }
            }
            return undefined;
        },
        getAll : function( test ){
            var found = [];
            for( var i = 0; i < this.bindables.length; i++ ){
                var bindable = this.bindables[i];
                if( matchesByObject( bindable, test ) ){ found.push( bindable ); }
            }
            return found;
        },
        getChildren : function( bindable ){
            var id = bindable.id;
            var children = [];
            for( var i = 0; i < this.bindings.length; i++ ){
                var binding = this.bindings[i];
                if( binding[0] === id ){
                    var childId = binding[1];
                    children.push( this.get( { id : childId } ) );
                }
            }
            return children;
        },

        getParents : function( bindable ){
            var id = bindable.id;
            var parents = [];
            for( var i = 0; i < this.bindings.length; i++ ){
                var binding = this.bindings[i];
                if( binding[1] === id ){
                    var parentId = binding[0];
                    parents.push( this.get( { id : parentId} ) );
                }
            }
            return parents;
        },
        add : function ( bindable ){
            this.bindables.push ( bindable );
        },
        remove : function( bindable ){
            var parents = this.getParents( bindable );
            var thisId = bindable.id;

            for( var i = 0 ; i < this.bindings.length; i++ ){  //remove all bindings
                var binding = this.bindings[i];
                if( binding[0] == thisId || binding[1] === thisId ){
                    this.bindings.splice( i, 1 );
                }
            }
            for( var j = 0; j < parents.length; j++ )
            this.bindables.splice( this.bindables.indexOf( bindable ), 1 );
        },
        bind : function ( parent, child ){
            this.bindings.push( [ parent.id, child.id ] );
            parent.update( this );
        }
    };

    function Stat( sheet ){
        this.is = 'S';
        this.id = sheet.autoNumber++;
        this.name = "untitled";
        this.value = 0;
        this.type = "untyped";
        this.method = "sum";
        this.sheet = sheet.id;
        sheet.add( this );
    }

    Stat.prototype.update = function(){
        this.recalculate(); //recalculate
        var parents = this.getParents();
        for( var i = 0; i < parents.length; i++ ){
            parents[i].update();
        }
        return this;
    };

    Stat.prototype.recalculate = function(){
        var method = valueMethodsMap[ this.method ];
        this.value = method.val( this );
    };

    Stat.prototype.set = function( opts ){
        for( var prop in opts ) {
            if (opts.hasOwnProperty(prop)) {
                this[prop] = opts[prop];
            }
            this.update();
        }
        return this;
    };

    Stat.prototype.addTo = function( stat ){
        var sheet = getSheet( this.sheet );
        sheet.bind( stat, this );
        this.update();
        return this;
    };

    Stat.prototype.addChild = function( stat ){
        var sheet = getSheet( this.sheet );
        sheet.bind( this, stat );
        this.update();
        return this;
    };

    Stat.prototype.addend = function( ){
        var sheet = getSheet( this.sheet );
        return sheet.addend( this );
    };

    Stat.prototype.getChildren = function( test ){
        var sheet = getSheet( this.sheet );
        var children = sheet.getChildren( this );
        return test === undefined ? children : filterArray( children, test );
    };

    Stat.prototype.getParents = function(){
        var sheet = getSheet( this.sheet );
        return sheet.getParents( this );
    };

    var valueMethods = [
        {
            name : "constant",
            val : function( stat ){
                return stat.value;
            }
        },
        {
            name : "override",
            val : function( stat ){
                return stat.value;
            }
        },
        {
            name : "sum",
            val : function( stat ){
                var children = stat.getChildren();
                var value = 0;
                //don't use groups yet
                for( var i = 0; i < children.length; i++ ){
                    value += children[i].value;
                }
                return value;
            }
        },
        {
            name : "equation",
            val : function( stat ){
                var children = stat.getChildren();
                return children.length > 0 ? children[0].value : 0;
            }
        },
        {
            name : "stat",
            val : function( stat ){
                var children = stat.getChildren(  );
                return children.length > 0 ? children[0].value : 0;
            }
        },
        {
            name : "ability mod",
            val : function( stat ){
                var children = stat.getChildren();
                var total = children.length > 0 ? children[0].value : 0;
                return Math.floor( (total / 2) - 5 );
            }
        },
        {
            name : "class skill",
            val : function(  stat ){
                var children = stat.getChildren();
                if ( children.length === 0 ) return 0;
                var ranks = children[0];
                return ( ranks.value > 0 && stat.classSkill ? 3 : 0 );
            }
        }
    ];

    var valueMethodsMap = Map( valueMethods, "name" );

    //***************************************************************************//
    function matchesByObject( element, obj ){
        for( var test in obj ){
            if( obj.hasOwnProperty( test ) ){
                if( element[ test ] !== obj[test] ) return false;
            }
        }
        return true;
    }

    /**
     * Filters an array, based off of the parameters in test.
     * @param array
     * @param test
     * @returns {Array}
     */
    var filterArray = yore.screen = function( array, test ){
        var result = [];
        for( var i = 0; i < array.length; i++ ){
            var element = array[i];
            if( matchesByObject( element, test ) ){ result.push( element ); }
        }
        return result;
    };

    function Map( array, keyName ){
        var map = {};
        for( var i = 0; i < array.length; i++ ){
            var element = array[i];
            var key = element[ keyName ];
            map[ key ] = element;
        }
        return map;
    }

    window.yore = yore;
})();

