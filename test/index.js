//
// index.js
// @trenskow/merge
//
// Created by Kristian Trenskow on 2021/11/15
// For license see LICENSE.
//

import merge from '../index.js';

const { expect } = await import('chai');

describe('merge', () => {

	describe('strategy: merge', () => {

		it ('should come back with last value if last value is not an object.', () => {
			expect(merge('this', 'is', 'my', 'value')).to.be.a.string('value');
		});

		it ('should come back with arrays concatenated.', () => {
			expect(merge([0, 1], [2, 3])).to.eql([0, 1, 2, 3]);
		});

		it ('should come back with objects merged if both are objects', () => {
			expect(merge({ first: 1, shared: 2 }, { shared: 3, second: 2 })).to.eql({ first: 1, shared: 3, second: 2 });
		});

		it ('should come back with complex object.', () => {
			expect(merge({
				test: false,
				myArray: [1, 2, 3],
				obj: {
					first: true,
					shared: 123,
					myObject: {
						first: true
					}
				}
			}, {
				test: true,
				myArray: [4, 5, 6],
				obj: {
					shared: 345,
					second: true,
					myObject: {
						first: false
					}
				}
			})).to.eql({
				test: true,
				myArray: [ 1, 2, 3, 4, 5, 6 ],
				obj: {
					first: true,
					shared: 345,
					myObject: {
						first: false
					},
					second: true
				}
			});
		});

		it ('should come back with merged object (with non-enumerable properties).', () => {
			expect(merge({
				test: false,
			}, Object.defineProperty({}, 'nonEnumerable', {
				value: 123,
				enumerable: false
			}))).to.eql(Object.defineProperty({
				test: false,
			}, 'nonEnumerable', {
				value: 123,
				enumerable: false
			}));
		});

	});

	describe('strategy: first', () => {

		it ('should come back with last value if last value is not an object.', () => {
			expect(merge.strategy('first')('this', 'is', 'my', 'value')).to.be.a.string('this');
		});

		it ('should come back with arrays concatenated.', () => {
			expect(merge.strategy('first')([0, 1], [2, 3])).to.eql([0, 1]);
		});

		it ('should come back with objects merged if both are objects', () => {
			expect(merge.strategy('first')({ first: 1, shared: 2 }, { shared: 3, second: 2 })).to.eql({ first: 1, shared: 2 });
		});

		it ('should come back with complex object.', () => {
			expect(merge.strategy('first')({
				test: false,
				myArray: [1, 2, 3],
				obj: {
					first: true,
					shared: 123,
					myObject: {
						first: true
					}
				}
			}, {
				test: true,
				myArray: [4, 5, 6],
				obj: {
					shared: 345,
					second: true,
					myObject: {
						first: false
					}
				}
			})).to.eql({
				test: false,
				myArray: [1, 2, 3],
				obj: {
					first: true,
					shared: 123,
					myObject: {
						first: true
					}
				}
			});
		});

	});

	describe('strategy: second', () => {

		it ('should come back with last value if last value is not an object.', () => {
			expect(merge.strategy('second')('this', 'is', 'my', 'value')).to.be.a.string('value');
		});

		it ('should come back with arrays concatenated.', () => {
			expect(merge.strategy('second')([0, 1], [2, 3])).to.eql([2, 3]);
		});

		it ('should come back with objects merged if both are objects', () => {
			expect(merge.strategy('second')({ first: 1, shared: 2 }, { shared: 3, second: 2 })).to.eql({ shared: 3, second: 2 });
		});

		it ('should come back with complex object.', () => {
			expect(merge.strategy('second')({
				test: false,
				myArray: [1, 2, 3],
				obj: {
					first: true,
					shared: 123,
					myObject: {
						first: true
					}
				}
			}, {
				test: true,
				myArray: [4, 5, 6],
				obj: {
					shared: 345,
					second: true,
					myObject: {
						first: false
					}
				}
			})).to.eql({
				test: true,
				myArray: [4, 5, 6],
				obj: {
					shared: 345,
					second: true,
					myObject: {
						first: false
					}
				}
			});
		});

	});

});
