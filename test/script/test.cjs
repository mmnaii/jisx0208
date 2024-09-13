console.log("##test: required from CommonJS");

const test = require("node:test");

const fs = require("node:fs").promises;
const assert = require("node:assert");

const jisx0208 = require("../../lib/jisx0208.cjs");


const resources = {};

test("test.before", async t=>{
	/* test.before */

	resources.assigned = await fs.readFile("./test/resource/row_cell_assigned.txt");
	resources.sjisbin = await fs.readFile("./test/resource/row_cell_sjis.bin");
	resources.eucbin = await fs.readFile("./test/resource/row_cell_euc.bin");

	resources.halfkana = await fs.readFile("./test/resource/halfkana.txt");
	resources.fullkana = await fs.readFile("./test/resource/fullkana.txt");

});

test("isAssigned", t=>{
	/* test; isAssigned() */
	// t.plan(96 * 96);

	for (let row=0; row<=95; row++) {
		for (let cell=0; cell<=95; cell++) {
			const value = jisx0208.isAssigned(row, cell);
			if (row >= 1 && row <= 94 && cell >= 1 && cell <= 94) {
				resources.assigned[(row - 1) * 94 + (cell - 1)] === 0x31 ? assert.strictEqual(value, true) : assert.strictEqual(value, false);
			} else {
				assert.strictEqual(value, false);
			}
		}
	}

});

test("rowCellToSjis", t=>{
	/* test; rowCellToSjis() */
	// t.plan(96 * 96 * 2 + 10);

	for (let row=0; row<=95; row++) {
		for (let cell=0; cell<=95; cell++) {

			if (row >= 1 && row <= 94 && cell >= 1 && cell <= 94) {
				let index = (row - 1) * 94 * 2 + (cell - 1) * 2;

				assert.deepEqual(jisx0208.rowCellToSjis(row, cell, true), [resources.sjisbin[index], resources.sjisbin[index + 1]], `result of rowCellToSjis() is not expected, at row ${row}, cell ${cell}, with noAssert is true.`);

				if (resources.assigned[(row - 1) * 94 + (cell - 1)] === 0x31) {
					assert.deepEqual(jisx0208.rowCellToSjis(row, cell), [resources.sjisbin[index], resources.sjisbin[index + 1]], `result of rowCellToSjis() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				} else {
					assert.strictEqual(jisx0208.rowCellToSjis(row, cell), null, `result of rowCellToSjis() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				}
			} else {
				assert.strictEqual(jisx0208.rowCellToSjis(row, cell, true), null, `result of rowCellToSjis() is not expected, when row or cell is out of range, with noAssert is true.`);
				assert.strictEqual(jisx0208.rowCellToSjis(row, cell), null, `result of rowCellToSjis() is not expected, when row or cell is out of range, with noAssert is false.`);
			}
		}
	}

	assert.strictEqual(jisx0208.rowCellToSjis(-1, -1), null, "arguments are negative integers.");
	assert.strictEqual(jisx0208.rowCellToSjis(-1, -1, true), null, "arguments are negative integers.");
	assert.deepEqual(jisx0208.rowCellToSjis(3.14, 3.14), jisx0208.rowCellToSjis(3, 3), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToSjis(3.14, 3.14, true), jisx0208.rowCellToSjis(3, 3, true), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToSjis(17.7, 17.7), jisx0208.rowCellToSjis(17, 17), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToSjis(17.7, 17.7, true), jisx0208.rowCellToSjis(17, 17, true), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToSjis("0x10", "0x10"), jisx0208.rowCellToSjis(0x10, 0x10), "arguments are strings of hex.");
	assert.deepEqual(jisx0208.rowCellToSjis("0x10", "0x10", true), jisx0208.rowCellToSjis(0x10, 0x10, true), "arguments are strings of hex.");
	assert.strictEqual(jisx0208.rowCellToSjis({}, {}), null, "arguments are objects.");
	assert.strictEqual(jisx0208.rowCellToSjis({}, {}, true), null, "arguments are objects.");
});

test("rowCellToEucjp", t=>{
	/* test; rowCellToEucjp() */
	// t.plan(96 * 96 * 2 + 10);

	for (let row=0; row<=95; row++) {
		for (let cell=0; cell<=95; cell++) {

			if (row >= 1 && row <= 94 && cell >= 1 && cell <= 94) {
				let index = (row - 1) * 94 * 2 + (cell - 1) * 2;

				assert.deepEqual(jisx0208.rowCellToEucjp(row, cell, true), [resources.eucbin[index], resources.eucbin[index + 1]], `result of rowCellToEucjp() is not expected, at row ${row}, cell ${cell}, with noAssert is true.`);

				if (resources.assigned[(row - 1) * 94 + (cell - 1)] === 0x31) {
					assert.deepEqual(jisx0208.rowCellToEucjp(row, cell), [resources.eucbin[index], resources.eucbin[index + 1]], `result of rowCellToEucjp() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				} else {
					assert.strictEqual(jisx0208.rowCellToEucjp(row, cell), null, `result of rowCellToEucjp() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				}
			} else {
				assert.strictEqual(jisx0208.rowCellToEucjp(row, cell, true), null, `result of rowCellToEucjp() is not expected, when row or cell is out of range, with noAssert is true.`);
				assert.strictEqual(jisx0208.rowCellToEucjp(row, cell), null, `result of rowCellToEucjp() is not expected, when row or cell is out of range, with noAssert is false.`);
			}
		}
	}

	assert.strictEqual(jisx0208.rowCellToEucjp(-1, -1), null, "arguments are negative integers.");
	assert.strictEqual(jisx0208.rowCellToEucjp(-1, -1, true), null, "arguments are negative integers.");
	assert.deepEqual(jisx0208.rowCellToEucjp(3.14, 3.14), jisx0208.rowCellToEucjp(3, 3), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToEucjp(3.14, 3.14, true), jisx0208.rowCellToEucjp(3, 3, true), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToEucjp(17.7, 17.7), jisx0208.rowCellToEucjp(17, 17), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToEucjp(17.7, 17.7, true), jisx0208.rowCellToEucjp(17, 17, true), "arguments are not integers.");
	assert.deepEqual(jisx0208.rowCellToEucjp("0x10", "0x10"), jisx0208.rowCellToEucjp(0x10, 0x10), "arguments are strings of hex.");
	assert.deepEqual(jisx0208.rowCellToEucjp("0x10", "0x10", true), jisx0208.rowCellToEucjp(0x10, 0x10, true), "arguments are strings of hex.");
	assert.strictEqual(jisx0208.rowCellToEucjp({}, {}), null, "arguments are objects.");
	assert.strictEqual(jisx0208.rowCellToEucjp({}, {}, true), null, "arguments are objects.");
});

test("sjisToRowCell", t=>{
	/* test; sjisToRowCell() */
	// t.plan(256 * 256 * 2 + 12);

	let sjis = [];
	for (let row=1, index=0; row<=94; row++) {
		for (let cell=1; cell<=94; cell++, index++) {
			sjis[resources.sjisbin[index * 2] * 256 + resources.sjisbin[index * 2 + 1]] = {
				isAssigned: resources.assigned[index] === 0x31,
				rowCell: [row, cell]
			};
		}
	}

	for (let b1=0; b1<256; b1++) {
		for (let b2=0; b2<256; b2++) {
			const result = jisx0208.sjisToRowCell(b1, b2);
			const resultNoAssert = jisx0208.sjisToRowCell(b1, b2, true);
			const inRange = sjis[b1 * 256 + b2];
			if (inRange) {
				inRange.isAssigned ? assert.deepEqual(result, inRange.rowCell, `result of sjisToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`) : assert.strictEqual(result, null, `result of sjisToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`);
				assert.deepEqual(resultNoAssert, inRange.rowCell, `result of sjisToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is true.`);
			} else {
				assert.strictEqual(result, null);
				assert.strictEqual(resultNoAssert, null);
			}
		}
	}

	assert.deepEqual(jisx0208.sjisToRowCell(-127, -114), jisx0208.sjisToRowCell(129, 142), "arguments are negative integers.");
	assert.deepEqual(jisx0208.sjisToRowCell(-127, -114, true), jisx0208.sjisToRowCell(129, 142, true), "arguments are negative integers.");
	assert.deepEqual(jisx0208.sjisToRowCell(129 + 256, 142 + 256), jisx0208.sjisToRowCell(129, 142), "arguments are larger than 8 bits.");
	assert.deepEqual(jisx0208.sjisToRowCell(129 + 256, 142 + 256, true), jisx0208.sjisToRowCell(129, 142, true), "arguments are larger than 8 bits.");
	assert.deepEqual(jisx0208.sjisToRowCell(-(127 + 256), -(114 + 256)), jisx0208.sjisToRowCell(129, 142), "arguments are larger than 8 bits and negative.");
	assert.deepEqual(jisx0208.sjisToRowCell(-(127 + 256), -(114 + 256), true), jisx0208.sjisToRowCell(129, 142, true), "arguments are larger than 8 bits and negative.");
	assert.deepEqual(jisx0208.sjisToRowCell(129.3, 142.6), jisx0208.sjisToRowCell(129, 142), "arguments are not integers.");
	assert.deepEqual(jisx0208.sjisToRowCell(129.3, 142.6, true), jisx0208.sjisToRowCell(129, 142, true), "arguments are not integers.");
	assert.deepEqual(jisx0208.sjisToRowCell("0x81", "0x40"), jisx0208.sjisToRowCell(0x81, 0x40), "arguments are strings of hex.");
	assert.deepEqual(jisx0208.sjisToRowCell("0x81", "0x40", true), jisx0208.sjisToRowCell(0x81, 0x40, true), "arguments are strings of hex.");
	assert.strictEqual(jisx0208.sjisToRowCell({}, {}), null, "arguments are objects.");
	assert.strictEqual(jisx0208.sjisToRowCell({}, {}, true), null, "arguments are objects.");
});

test("eucjpToRowCell", t=>{
	/* test; eucjpToRowCell() */
	// t.plan(256 * 256 * 2 + 12);

	let euc = [];
	for (let row=1, index=0; row<=94; row++) {
		for (let cell=1; cell<=94; cell++, index++) {
			euc[resources.eucbin[index * 2] * 256 + resources.eucbin[index * 2 + 1]] = {
				isAssigned: resources.assigned[index] === 0x31,
				rowCell: [row, cell]
			};
		}
	}

	for (let b1=0; b1<256; b1++) {
		for (let b2=0; b2<256; b2++) {
			const result = jisx0208.eucjpToRowCell(b1, b2);
			const resultNoAssert = jisx0208.eucjpToRowCell(b1, b2, true);
			const inRange = euc[b1 * 256 + b2];
			if (inRange) {
				inRange.isAssigned ? assert.deepEqual(result, inRange.rowCell, `result of eucjpToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`) : assert.strictEqual(result, null, `result of eucjpToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`);
				assert.deepEqual(resultNoAssert, inRange.rowCell, `result of eucjpToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is true.`);
			} else {
				assert.strictEqual(result, null);
				assert.strictEqual(resultNoAssert, null);
			}
		}
	}

	assert.deepEqual(jisx0208.eucjpToRowCell(-80, -66), jisx0208.eucjpToRowCell(176, 190), "arguments are negative integers.");
	assert.deepEqual(jisx0208.eucjpToRowCell(-80, -66, true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are negative integers.");
	assert.deepEqual(jisx0208.eucjpToRowCell(176 + 256, 190 + 256), jisx0208.eucjpToRowCell(176, 190), "arguments are larger than 8 bits.");
	assert.deepEqual(jisx0208.eucjpToRowCell(176 + 256, 190 + 256, true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are larger than 8 bits.");
	assert.deepEqual(jisx0208.eucjpToRowCell(-(80 + 256), -(66 + 256)), jisx0208.eucjpToRowCell(176, 190), "arguments are larger than 8 bits and negative.");
	assert.deepEqual(jisx0208.eucjpToRowCell(-(80 + 256), -(66 + 256), true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are larger than 8 bits and negative.");
	assert.deepEqual(jisx0208.eucjpToRowCell(176.3, 190.6), jisx0208.eucjpToRowCell(176, 190), "arguments are not integers.");
	assert.deepEqual(jisx0208.eucjpToRowCell(176.3, 190.6, true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are not integers.");
	assert.deepEqual(jisx0208.eucjpToRowCell("0xa3", "0xc2"), jisx0208.eucjpToRowCell(0xa3, 0xc2), "arguments are strings of hex.");
	assert.deepEqual(jisx0208.eucjpToRowCell("0xa3", "0xc2", true), jisx0208.eucjpToRowCell(0xa3, 0xc2, true), "arguments are strings of hex.");
	assert.strictEqual(jisx0208.eucjpToRowCell({}, {}), null, "arguments are objects.");
	assert.strictEqual(jisx0208.eucjpToRowCell({}, {}, true), null, "arguments are objects.");
});

test("halfkanaToRowCell", t=>{
	/* test; halfkanaToRowCell() */

	for (let b=0; b<256; b++) {
		if (b >= 0xa1 && b <= 0xdf) {
			assert.deepEqual(jisx0208.halfkanaToRowCell(b), jisx0208.sjisToRowCell(resources.fullkana[(b - 0xa1) * 2], resources.fullkana[(b - 0xa1) * 2 + 1]), `result of halfkanaToRowCell() is not expected, at 0x${b.toString(16).padStart(2, "0")}`);
		} else {
			assert.strictEqual(jisx0208.halfkanaToRowCell(b), null, `result of halfkanaToRowCell() is not expected, at 0x${b.toString(16).padStart(2, "0")}`);
		}
	}

	assert.deepEqual(jisx0208.halfkanaToRowCell(-79), jisx0208.halfkanaToRowCell(177), "argument is negative integer.");
	assert.deepEqual(jisx0208.halfkanaToRowCell(177 + 256), jisx0208.halfkanaToRowCell(177), "argument is larger than 8 bits.");
	assert.deepEqual(jisx0208.halfkanaToRowCell(-(79 + 256)), jisx0208.halfkanaToRowCell(177), "argument is larger than 8 bits and negative.");
	assert.deepEqual(jisx0208.halfkanaToRowCell(177.3), jisx0208.halfkanaToRowCell(177), "argument is not integer.");
	assert.deepEqual(jisx0208.halfkanaToRowCell("0xb2"), jisx0208.halfkanaToRowCell(0xb2), "argument is strings of hex.");
	assert.strictEqual(jisx0208.halfkanaToRowCell({}), null, "argument is object.");
});

test("roundtrip", t=>{
	/* test: rowcell -> rowCellToSjis() -> sjisToRowCell() */
	/* test: rowcell -> rowCellToEucjp() -> eucjpToRowCell() */
	// t.plan(94 * 94 * 2);

	for (let row=1; row<=94; row++) {
		for (let cell=1; cell<=94; cell++) {
			assert.deepEqual([row, cell], jisx0208.sjisToRowCell(...jisx0208.rowCellToSjis(row, cell, true), true), `rowcell -> rowCellToSjis() -> sjisToRowCell() is not equal, at row ${row}, cell ${cell} .`);
			assert.deepEqual([row, cell], jisx0208.eucjpToRowCell(...jisx0208.rowCellToEucjp(row, cell, true), true), `rowcell -> rowCellToEucjp() -> eucjpToRowCell() is not equal, at row ${row}, cell ${cell} .`);
		}
	}
});
