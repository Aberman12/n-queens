// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
      var board = new Board();
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict

    size: function() {
      return this.get('n');
    },

    hasRowConflictAt: function(rowIndex) {
      //var row = this.get(rowIndex);
      //console.log(row);
      //iterate through each element of the row
      var ourRow = this.rows()[rowIndex];
      //console.log(ourRow)
      var count = 0;
      // console.log(this.get('n'));
      for (var i = 0; i < ourRow.length; i++) {
        if (ourRow[i] === 1) {
          count++;
        }
        if (count > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //iterate through each array in board looking for horizontal collisions;
      // console.log('this = ', this);
      // console.log('this.rows.length ',this.rows().length);
      // console.log('this.rows',this.rows());

      var n = this.size();
      var stuff = false
       for(var i = 0; i < n; i++){
        //  console.log(rows[i]);
         if (this.hasRowConflictAt(i)) {
           stuff = true;
         }
       }
      return stuff;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //grab the matrix
      var rows = this.rows();
      var n = this.get('n');
      //console.log('n', n)
      //initialize our counter
      var counter = 0;
      //iterate through columns "n"
      for (var i = 0; i < n; i++) {
        // console.log('master', rows)
        // console.log('our rows', rows[i])
        // console.log('one colIndex at a time', rows[i][colIndex]);
        //if any of the rows at colIndex = 1, increase counter
        if (rows[i][colIndex] === 1) {
          //console.log(rows[i][colIndex]);
          counter++;
        }
        //if we find 2+ 1's, return
        if (counter > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      //get number of columns to iterate through
      var n = this.size();
      //var colums = []
      //iterate through n colums
      for(var i = 0; i < n; i++){
        if (this.hasColConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //grab all the rows
      var rows = this.rows();
      var n = this.size();
      //assign major key
      console.log('tests', rows)
      var majorKey = majorDiagonalColumnIndexAtFirstRow;
      //initialize counter (we will return if counter > 1)
      var counter = 0;
      //iterate through first column
      for (var i = 0; i < n; i++) {
        //iterate through columns at majorKey index to see if it = 1
        if (majorKey[i] === 1) {
          var row = rows.indexOf(majorKey)+1;
          var col = i+1;
          //if it does, check the diagonal element
          counter++;

          //as long as the next element row exists, check the next element
          while(rows[row]){
            //if the next element is also one, we can return true
            if(rows[row][col] === 1){
              return true;
            }
            //check next diagonal element by advancing row + col
            row++;
            col++;
          }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var n = this.size();
      var grid = this.rows();
      for(var i = 0; i < n; i++){
        if (this.hasMajorDiagonalConflictAt(grid[i])){
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
