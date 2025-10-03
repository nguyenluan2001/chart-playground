// Reference from https://docs-v4.strapi.io/dev-docs/api/entity-service/filter

const OPERATOR = {
	CONTAINS: "$contains",
	GT: "$gt",
	GTE: "$gte",
	LT: "$lt",
	LTE: "$lte",
	AND: "$and",
	OR: "$or",
};

const operatorFunc: Record<string, Function> = {
	$contains: (a: string, b: string) => a?.includes(b),
	$containsi: (a: string, b: string) => a?.toLowerCase()?.includes(b?.toLowerCase()),
	$gt: (a: number, b: number) => a > b,
	$gte: (a: number, b: number) => a >= b,
	$lt: (a: number, b: number) => a < b,
	$lte: (a: number, b: number) => a <= b,
};

const compare = (data: any, filter: any): boolean => {
	const [field, operatorObj] = filter;
	if (!operatorObj) return true;

	const [operator, operatorVal] = Object.entries(operatorObj)[0];

	if (operator === OPERATOR.AND) {
		let result = true;
		for (const _operatorObj of operatorObj[OPERATOR.AND]) {
			result = result && compare(data, [field, _operatorObj]);
		}
		return result;
	}

	if (operator === OPERATOR.OR) {
		let result = false;
		for (const _operatorObj of operatorObj[OPERATOR.OR]) {
			result = result || compare(data, [field, _operatorObj]);
		}
		return result;
	}
	return operatorFunc?.[operator](data[field], operatorVal);
};

const checkValid = (data: any, filters: any) => {
	const filterEntries = Object.entries(filters);

	const result = filterEntries?.every((filter) => compare(data, filter));
	return result;
};

const formatValue = (value: number, isFormatted = true) => {
	if (!isFormatted) return value;
	const isInteger = Number.isInteger(+`${value}`);

	if (isInteger) return Number.parseInt(`${value}`);

	return Number.parseFloat(`${value}`)?.toFixed(2);
};

export { checkValid };
