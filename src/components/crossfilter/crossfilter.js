import rawData from "./data.json" with { type: 'json' };;
import crossfilter from "crossfilter2";
const formatData = (data) => {
	return data?.cell_indices.map((item, index) => ({
		indice: item,
		exp: data.expression[index],
	}));
};

const main = () => {
	// const formattedData = formatData(rawData);
	const cell_indices = [
		0,
		2,
		5,
		6,
		7,
		8,
		11,
		12,
		13,
		17,
	]
	const expressions = [
		2.8634629249572754,
		3.4890894889831543,
		1.726522445678711,
		2.3215222358703613,
		2.6584632396698,
		2.1789464950561523,
		2.2365739345550537,
		3.4019157886505127,
		1.4576793909072876,
		2.057741403579712
	]
	const data = crossfilter(cell_indices);
	data.indice = data.dimension((d) => d);
	data.expression = data.dimension((d, i) => {
		console.log('dimension expression', i, d)
		return expressions[i]
	});
	// data.indice.filterFunction((d) => [0, 2, 5]?.includes(d))
	data.expression.filterExact(3.4890894889831543)
	const filteredData = data.indice.bottom(Infinity)
	console.log("filtered data", filteredData);
};
main();
