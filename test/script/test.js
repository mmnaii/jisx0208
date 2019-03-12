import test from 'ava';

const fs = require("fs");

const target = "../../src/jisx0208.js";

console.log("test file: ", target);
const jisx0208 = require(target);

const resources = {};


test.before("readFile", async t=>{

	const readFile = (file)=>{
		return new Promise((resolve, reject)=>{
			fs.readFile(file, (err, data)=>{
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};

	resources.assigned = await readFile("./test/resource/row_cell_assigned.txt");
	resources.sjisbin = await readFile("./test/resource/row_cell_sjis.bin");
	resources.eucbin = await readFile("./test/resource/row_cell_euc.bin");

	resources.halfkana = await readFile("./test/resource/halfkana.txt");
	resources.fullkana = await readFile("./test/resource/fullkana.txt");

});

test("isAssigned", t=>{
	t.log("**test; isAssigned()");

	t.plan(96 * 96);
	for (let row=0; row<=95; row++) {
		for (let cell=0; cell<=95; cell++) {
			const value = jisx0208.isAssigned(row, cell);
			if (row >= 1 && row <= 94 && cell >= 1 && cell <= 94) {
				resources.assigned[(row - 1) * 94 + (cell - 1)] == 0x31 ? t.true(value) : t.false(value);
			} else {
				t.false(value);
			}
		}
	}

});

test("rowCellToSjis", t=>{

	t.log("**test; rowCellToSjis()");
	t.plan(96 * 96 * 2 + 10);

	for (let row=0; row<=95; row++) {
		for (let cell=0; cell<=95; cell++) {

			if (row >= 1 && row <= 94 && cell >= 1 && cell <= 94) {
				let index = (row - 1) * 94 * 2 + (cell - 1) * 2;

				t.deepEqual(jisx0208.rowCellToSjis(row, cell, true), [resources.sjisbin[index], resources.sjisbin[index + 1]], `result of rowCellToSjis() is not expected, at row ${row}, cell ${cell}, with noAssert is true.`);

				if (resources.assigned[(row - 1) * 94 + (cell - 1)] === 0x31) {
					t.deepEqual(jisx0208.rowCellToSjis(row, cell), [resources.sjisbin[index], resources.sjisbin[index + 1]], `result of rowCellToSjis() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				} else {
					t.is(jisx0208.rowCellToSjis(row, cell), null, `result of rowCellToSjis() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				}
			} else {
				t.is(jisx0208.rowCellToSjis(row, cell, true), null, `result of rowCellToSjis() is not expected, when row or cell is out of range, with noAssert is true.`);
				t.is(jisx0208.rowCellToSjis(row, cell), null, `result of rowCellToSjis() is not expected, when row or cell is out of range, with noAssert is false.`);
			}
		}
	}

	t.is(jisx0208.rowCellToSjis(-1, -1), null, "arguments are negative integers.");
	t.is(jisx0208.rowCellToSjis(-1, -1, true), null, "arguments are negative integers.");
	t.deepEqual(jisx0208.rowCellToSjis(3.14, 3.14), jisx0208.rowCellToSjis(3, 3), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToSjis(3.14, 3.14, true), jisx0208.rowCellToSjis(3, 3, true), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToSjis(17.7, 17.7), jisx0208.rowCellToSjis(17, 17), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToSjis(17.7, 17.7, true), jisx0208.rowCellToSjis(17, 17, true), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToSjis("0x10", "0x10"), jisx0208.rowCellToSjis(0x10, 0x10), "arguments are strings of hex.");
	t.deepEqual(jisx0208.rowCellToSjis("0x10", "0x10", true), jisx0208.rowCellToSjis(0x10, 0x10, true), "arguments are strings of hex.");
	t.is(jisx0208.rowCellToSjis({}, {}), null, "arguments are objects.");
	t.is(jisx0208.rowCellToSjis({}, {}, true), null, "arguments are objects.");
});

test("rowCellToEucjp", t=>{

	t.log("**test; rowCellToEucjp()");
	t.plan(96 * 96 * 2 + 10);
	for (let row=0; row<=95; row++) {
		for (let cell=0; cell<=95; cell++) {

			if (row >= 1 && row <= 94 && cell >= 1 && cell <= 94) {
				let index = (row - 1) * 94 * 2 + (cell - 1) * 2;

				t.deepEqual(jisx0208.rowCellToEucjp(row, cell, true), [resources.eucbin[index], resources.eucbin[index + 1]], `result of rowCellToEucjp() is not expected, at row ${row}, cell ${cell}, with noAssert is true.`);

				if (resources.assigned[(row - 1) * 94 + (cell - 1)] === 0x31) {
					t.deepEqual(jisx0208.rowCellToEucjp(row, cell), [resources.eucbin[index], resources.eucbin[index + 1]], `result of rowCellToEucjp() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				} else {
					t.is(jisx0208.rowCellToEucjp(row, cell), null, `result of rowCellToEucjp() is not expected, at row ${row}, cell ${cell}, with noAssert is false.`);
				}
			} else {
				t.is(jisx0208.rowCellToEucjp(row, cell, true), null, `result of rowCellToEucjp() is not expected, when row or cell is out of range, with noAssert is true.`);
				t.is(jisx0208.rowCellToEucjp(row, cell), null, `result of rowCellToEucjp() is not expected, when row or cell is out of range, with noAssert is false.`);
			}
		}
	}

	t.is(jisx0208.rowCellToEucjp(-1, -1), null, "arguments are negative integers.");
	t.is(jisx0208.rowCellToEucjp(-1, -1, true), null, "arguments are negative integers.");
	t.deepEqual(jisx0208.rowCellToEucjp(3.14, 3.14), jisx0208.rowCellToEucjp(3, 3), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToEucjp(3.14, 3.14, true), jisx0208.rowCellToEucjp(3, 3, true), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToEucjp(17.7, 17.7), jisx0208.rowCellToEucjp(17, 17), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToEucjp(17.7, 17.7, true), jisx0208.rowCellToEucjp(17, 17, true), "arguments are not integers.");
	t.deepEqual(jisx0208.rowCellToEucjp("0x10", "0x10"), jisx0208.rowCellToEucjp(0x10, 0x10), "arguments are strings of hex.");
	t.deepEqual(jisx0208.rowCellToEucjp("0x10", "0x10", true), jisx0208.rowCellToEucjp(0x10, 0x10, true), "arguments are strings of hex.");
	t.is(jisx0208.rowCellToEucjp({}, {}), null, "arguments are objects.");
	t.is(jisx0208.rowCellToEucjp({}, {}, true), null, "arguments are objects.");
});

test("sjisToRowCell", t=>{

	t.log("**test; sjisToRowCell()");
	t.plan(256 * 256 * 2 + 12);

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
				inRange.isAssigned ? t.deepEqual(result, inRange.rowCell, `result of sjisToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`) : t.is(result, null, `result of sjisToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`);
				t.deepEqual(resultNoAssert, inRange.rowCell, `result of sjisToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is true.`);
			} else {
				t.is(result, null);
				t.is(resultNoAssert, null);
			}
		}
	}

	t.deepEqual(jisx0208.sjisToRowCell(-127, -114), jisx0208.sjisToRowCell(129, 142), "arguments are negative integers.");
	t.deepEqual(jisx0208.sjisToRowCell(-127, -114, true), jisx0208.sjisToRowCell(129, 142, true), "arguments are negative integers.");
	t.deepEqual(jisx0208.sjisToRowCell(129 + 256, 142 + 256), jisx0208.sjisToRowCell(129, 142), "arguments are larger than 8 bits.");
	t.deepEqual(jisx0208.sjisToRowCell(129 + 256, 142 + 256, true), jisx0208.sjisToRowCell(129, 142, true), "arguments are larger than 8 bits.");
	t.deepEqual(jisx0208.sjisToRowCell(-(127 + 256), -(114 + 256)), jisx0208.sjisToRowCell(129, 142), "arguments are larger than 8 bits and negative.");
	t.deepEqual(jisx0208.sjisToRowCell(-(127 + 256), -(114 + 256), true), jisx0208.sjisToRowCell(129, 142, true), "arguments are larger than 8 bits and negative.");
	t.deepEqual(jisx0208.sjisToRowCell(129.3, 142.6), jisx0208.sjisToRowCell(129, 142), "arguments are not integers.");
	t.deepEqual(jisx0208.sjisToRowCell(129.3, 142.6, true), jisx0208.sjisToRowCell(129, 142, true), "arguments are not integers.");
	t.deepEqual(jisx0208.sjisToRowCell("0x81", "0x40"), jisx0208.sjisToRowCell(0x81, 0x40), "arguments are strings of hex.");
	t.deepEqual(jisx0208.sjisToRowCell("0x81", "0x40", true), jisx0208.sjisToRowCell(0x81, 0x40, true), "arguments are strings of hex.");
	t.is(jisx0208.sjisToRowCell({}, {}), null, "arguments are objects.");
	t.is(jisx0208.sjisToRowCell({}, {}, true), null, "arguments are objects.");
});

test("eucjpToRowCell", t=>{

	t.log("**test; eucjpToRowCell()");
	t.plan(256 * 256 * 2 + 12);

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
				inRange.isAssigned ? t.deepEqual(result, inRange.rowCell, `result of eucjpToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`) : t.is(result, null, `result of eucjpToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is false.`);
				t.deepEqual(resultNoAssert, inRange.rowCell, `result of eucjpToRowCell() is not expected, at 0x${b1.toString(16)}, 0x${b2.toString(16)}, with noAssert is true.`);
			} else {
				t.is(result, null);
				t.is(resultNoAssert, null);
			}
		}
	}

	t.deepEqual(jisx0208.eucjpToRowCell(-80, -66), jisx0208.eucjpToRowCell(176, 190), "arguments are negative integers.");
	t.deepEqual(jisx0208.eucjpToRowCell(-80, -66, true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are negative integers.");
	t.deepEqual(jisx0208.eucjpToRowCell(176 + 256, 190 + 256), jisx0208.eucjpToRowCell(176, 190), "arguments are larger than 8 bits.");
	t.deepEqual(jisx0208.eucjpToRowCell(176 + 256, 190 + 256, true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are larger than 8 bits.");
	t.deepEqual(jisx0208.eucjpToRowCell(-(80 + 256), -(66 + 256)), jisx0208.eucjpToRowCell(176, 190), "arguments are larger than 8 bits and negative.");
	t.deepEqual(jisx0208.eucjpToRowCell(-(80 + 256), -(66 + 256), true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are larger than 8 bits and negative.");
	t.deepEqual(jisx0208.eucjpToRowCell(176.3, 190.6), jisx0208.eucjpToRowCell(176, 190), "arguments are not integers.");
	t.deepEqual(jisx0208.eucjpToRowCell(176.3, 190.6, true), jisx0208.eucjpToRowCell(176, 190, true), "arguments are not integers.");
	t.deepEqual(jisx0208.eucjpToRowCell("0xa3", "0xc2"), jisx0208.eucjpToRowCell(0xa3, 0xc2), "arguments are strings of hex.");
	t.deepEqual(jisx0208.eucjpToRowCell("0xa3", "0xc2", true), jisx0208.eucjpToRowCell(0xa3, 0xc2, true), "arguments are strings of hex.");
	t.is(jisx0208.eucjpToRowCell({}, {}), null, "arguments are objects.");
	t.is(jisx0208.eucjpToRowCell({}, {}, true), null, "arguments are objects.");
});

test("halfkanaToRowCell", t=>{

	t.log("**test; halfkanaToRowCell");

	for (let b=0; b<256; b++) {
		if (b >= 0xa1 && b <= 0xdf) {
			t.deepEqual(jisx0208.halfkanaToRowCell(b), jisx0208.sjisToRowCell(resources.fullkana[(b - 0xa1) * 2], resources.fullkana[(b - 0xa1) * 2 + 1]), `result of halfkanaToRowCell() is not expected, at 0x${b.toString(16).padStart(2, "0")}`);
		} else {
			t.is(jisx0208.halfkanaToRowCell(b), null, `result of halfkanaToRowCell() is not expected, at 0x${b.toString(16).padStart(2, "0")}`);
		}
	}

	t.deepEqual(jisx0208.halfkanaToRowCell(-79), jisx0208.halfkanaToRowCell(177), "argument is negative integer.");
	t.deepEqual(jisx0208.halfkanaToRowCell(177 + 256), jisx0208.halfkanaToRowCell(177), "argument is larger than 8 bits.");
	t.deepEqual(jisx0208.halfkanaToRowCell(-(79 + 256)), jisx0208.halfkanaToRowCell(177), "argument is larger than 8 bits and negative.");
	t.deepEqual(jisx0208.halfkanaToRowCell(177.3), jisx0208.halfkanaToRowCell(177), "argument is not integer.");
	t.deepEqual(jisx0208.halfkanaToRowCell("0xb2"), jisx0208.halfkanaToRowCell(0xb2), "argument is strings of hex.");
	t.is(jisx0208.halfkanaToRowCell({}), null, "argument is object.");
});

test("roundtrip", t=>{

	t.log("**test: rowcell -> rowCellToSjis() -> sjisToRowCell()");
	t.log("**test: rowcell -> rowCellToEucjp() -> eucjpToRowCell()");

	t.plan(94 * 94 * 2);
	for (let row=1; row<=94; row++) {
		for (let cell=1; cell<=94; cell++) {
			t.deepEqual([row, cell], jisx0208.sjisToRowCell(...jisx0208.rowCellToSjis(row, cell, true), true), `rowcell -> rowCellToSjis() -> sjisToRowCell() is not equal, at row ${row}, cell ${cell} .`);
			t.deepEqual([row, cell], jisx0208.eucjpToRowCell(...jisx0208.rowCellToEucjp(row, cell, true), true), `rowcell -> rowCellToEucjp() -> eucjpToRowCell() is not equal, at row ${row}, cell ${cell} .`);
		}
	}
});

