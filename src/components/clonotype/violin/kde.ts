// export const kde = () => {
// 	const dataSource = [
// 		0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0,
// 		20,
// 	];
// 	// const xiData = [
// 	// 	66, 53, 43, 42, 41, 40, 35, 31, 30, 29, 26, 25, 24, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,
// 	// 	9, 8, 7, 6, 5, 4, 3, 2, 1,
// 	// ];
// 	const xiData = [
// 		66, 53, 43, 42, 41, 40, 35, 31, 30, 29, 26, 25, 24, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,
// 		9, 8, 7, 6, 5, 4, 3, 2, 1,
// 	];
// 	// const animationDuration = 4000;
// 	// const range = 20,
// 	// 	startPoint = 88;
// 	// for (let i = 0; i < range; i++) {
// 	// 	xiData[i] = startPoint + i;
// 	// }
// 	const data = [];

// 	function GaussKDE(xi, x) {
// 		return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(Math.pow(xi - x, 2) / -2);
// 	}

// 	const N = dataSource.length;

// 	for (let i = 0; i < xiData.length; i++) {
// 		let temp = 0;
// 		for (let j = 0; j < dataSource.length; j++) {
// 			temp = temp + GaussKDE(xiData[i], dataSource[j]);
// 		}
// 		data.push([xiData[i], (1 / N) * temp]);
// 	}
// 	return data;
// };
function gaussianKernel(x, bandwidth) {
	return (1 / (bandwidth * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(x / bandwidth, 2));
}

function kdeCalc(data, x, bandwidth) {
	let density = 0;
	for (let i = 0; i < data.length; i++) {
		density += gaussianKernel(x - data[i], bandwidth);
	}
	return density / data.length;
}

export const kde = () => {
	// const dataSource = [
	// 	0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0,
	// 	20,
	// ];
	const dataSource = Array(67).fill(0);
	dataSource[41] = 2;
	dataSource[5] = 2;
	dataSource[3] = 2;
	dataSource[1] = 20;
	// const xiData = [
	// 	66, 53, 43, 42, 41, 40, 35, 31, 30, 29, 26, 25, 24, 20, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2,
	// 	1,
	// ];
	const xiData = Array(67)
		.fill(0)
		?.map((item, i) => i);
	const bandwidth = 1;
	const kdeValues = xiData.map((x) => [x, kdeCalc(dataSource, x, bandwidth)]);
	return kdeValues;
};
