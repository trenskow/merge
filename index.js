//
// index.js
// @trenskow/merge
//
// Created by Kristian Trenskow on 2021/11/15
// For license see LICENSE.
//

const isObject = (value) => typeof value === 'object' && value !== null;

const _merge = (options = {}) => {

	if (typeof options === 'string') {
		options = {
			object: options,
			array: options,
			other: options
		};
	}

	return (...values) => {

		while (values.length > 1) {

			let [ first, second ] = values;

			if (!isObject(first) || !isObject(second)) {
				switch (options.other || 'second') {
					case 'second':
						first = second;
						break;
					default:
						break;
				}
			} else {
				if (Array.isArray(first) && Array.isArray(second)) {
					switch (options.array || 'merge') {
						case 'merge':
							first = first.concat(second);
							break;
						case 'second':
							first = second;
							break;
						default:
							break;
					}
				} else {

					switch (options.object || 'merge') {
						case 'merge': {

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

							break;

						}

						case 'second':
							first = second;
							break;

						default:
							break;

					}

				}
			}

			values.splice(0, 2, first);

		}

		return values[0];

	};

};

const merge = _merge();

merge.strategy = _merge;

export default merge;
