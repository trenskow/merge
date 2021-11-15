//
// index.js
// @trenskow/app
// 
// Created by Kristian Trenskow on 2021/11/15
// For license see LICENSE.
// 

const isObject = (value) => typeof value === 'object' && value !== null;

const merge = (...values) => {

	while (values.length > 1) {

		let [ first, second ] = values;

		if (!isObject(first) || !isObject(second)) {
			first = second;
		} else {
			if (Array.isArray(first) && Array.isArray(second)) {
				first = first.concat(second);
			} else {

				const firstKeys = Object.keys(first);
				const secondKeys = Object.keys(second);

				const oldKeys = firstKeys.filter((key) => !secondKeys.includes(key));
				const newKeys = secondKeys.filter((key) => !firstKeys.includes(key));
				const sharedKeys = firstKeys.filter((key) => secondKeys.includes(key));

				first = Object.assign(
					Object.fromEntries(oldKeys.map((key) => [key, first[key]])),
					Object.fromEntries(sharedKeys.map((key) => [key, merge(first[key], second[key])])),
					Object.fromEntries(newKeys.map((key) => [key, second[key]]))
				);

			}
		}

		values.splice(0, 2, first);

	}

	return values[0];

};

export default merge;
