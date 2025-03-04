import React from 'react';

export default function SudokuBoard() {
  return (
    <div className='sudoku-board'>
      <h2>Sudoku Challenge</h2>
      <div className='grid'>
        {[...Array(9)].map((_, row) => (
          <div key={row} className='row'>
            {[...Array(9)].map((_, col) => (
              <input key={col} type='text' maxLength='1' className='cell' />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
