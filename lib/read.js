//
// read.js
// @trenskow/merge
//
// Created by Kristian Trenskow on 2021/11/15
// For license see LICENSE.
//

import { readdir, readFile } from 'fs/promises';
import { basename, dirname, extname, resolve } from 'path';

export default (_merge) => {

	return async (file, options) => {

		options = options || {};

		options.cwd = options.cwd || process.cwd();
		options.resolve = options.resolve || resolve;
		options.read = options.read || readFile;

		const merge = _merge(options.strategy);

		file = options.resolve(options.cwd, file);

		const extension = extname(file);
		const prefix = `${basename(file, extension)}.`;
		const directory = dirname(file);

		let data = JSON.parse(await options.read(file, 'utf-8'));

		const files = (await readdir(directory))
			.filter((file) => file.startsWith(prefix))
			.filter((file) => extname(file) === extension)
			.map((file) => options.resolve(directory, file));

		await Promise.all(files
			.map(async (file) => {

				const subdata = JSON.parse(await options.read(file, 'utf-8'));

				const keyPath = basename(file, extension)
					.slice(prefix.length)
					.split('.')
					.filter((part) => part !== '');

				if (keyPath.length === 0) {
					return;
				}

				let result = {};
				let current = result;

				for (const key of keyPath.slice(0, -1)) {
					current[key] = {};
					current = current[key];
				}

				current[keyPath[keyPath.length - 1]] = subdata;

				data = merge(data, result);

			})
		);

		return data;

	};

};
