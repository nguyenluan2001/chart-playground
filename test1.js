const total_cell = 147484;
const n_lays = 5;
const cellsPerCluster = Math.floor(total_cell / n_lays);
let orphanCells = (total_cell - cellsPerCluster * n_lays);
const layerCells = []

for (let i = 0; i < n_lays; i++) {
  if (orphanCells > 0) {
    layerCells.push(cellsPerCluster + 1)
    orphanCells--
  } else {
    layerCells.push(cellsPerCluster)
  }
}

console.log('layerCells', layerCells)