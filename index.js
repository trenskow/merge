//
// index.js
// @trenskow/merge
//
// Created by Kristian Trenskow on 2021/11/15
// For license see LICENSE.
//

const isObject = (value) => typeof value === 'object'
	&& value !== null
	&& (value.constructor === Object || Array.isArray(value));

const _merge = (options = {}) => {

	if (typeof options === 'string') {
		options = {
			object: options,
			array: options,
			other: options
		};
	}

	options.objectKeyLookupMethod = options.objectKeyLookupMethod || 'getOwnPropertyNames';

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

							const firstKeys = Object[options.objectKeyLookupMethod](first);
							const secondKeys = Object[options.objectKeyLookupMethod](second);

							const oldKeys = firstKeys.filter((key) => !secondKeys.includes(key));
							const newKeys = secondKeys.filter((key) => !firstKeys.includes(key));
							const sharedKeys = firstKeys.filter((key) => secondKeys.includes(key));

							const result = {};

							Object.defineProperties(result, Object.fromEntries(oldKeys.map((key) => {
								return [key, Object.getOwnPropertyDescriptor(first, key)];
							})));

							Object.defineProperties(result, Object.fromEntries(sharedKeys.map((key) => {

								const descriptor = Object.getOwnPropertyDescriptor(second, key);

								return [key, {
									value: _merge(options)(first[key], second[key]),
									configurable: descriptor.configurable,
									enumerable: descriptor.enumerable,
									writable: descriptor.enumerable
								}];

							})));

							Object.defineProperties(result, Object.fromEntries(newKeys.map((key) => {
								return [key, Object.getOwnPropertyDescriptor(second, key)];
							})));

							first = result;

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
