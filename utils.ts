export const generateCoordinateSystem = (
  dimensionality: number,
  basis: number[] = [-1, 0, +1],
  includeOrigin: boolean = false,
) => {
  // We'll use the basis length on a couple of occasions:
  const basisLength = basis.length;

  // We initialise a coordinates array of the total required length...
  const coordinates = new Array(Math.pow(basis.length, dimensionality));
  for (let o = 0; o < coordinates.length; o++) {
    // ...and with each element set to an empty array:
    coordinates[o] = new Array(dimensionality);
  }

  // Then we fill the coordinates array with all permutations of the basis array:
  for (let c = 0; c < coordinates.length; c++) {
    const coordinate = coordinates[c];
    for (let d = 0; d < dimensionality; d++) {
      // TODO: This is a neat pattern, should document it:
      coordinate[d] =
        basis[Math.floor(c / Math.pow(dimensionality, d)) % basisLength];
    }
  }

  return coordinates;
};
