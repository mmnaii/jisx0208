const rowcell = require("./table/rowcell.js");
const jisx0201kana = require("./table/jisx0201kana.js");

function toUint8(a) {
	return Number(a) >>> 0 & 255;
}

const Jisx0208 = {

	isAssigned(row, cell) {
		/*
			Returns true if the JIS X 0208 assigns a charactor to the {row, cell}.
		*/
		return Boolean(this.getCharactor(row, cell));
	},

	getCharactor(row, cell) {
		if (row === row >>> 0 && cell === cell >>> 0 && 1 <= row && row <= 94 && 1 <= cell && cell <= 94) {
			return rowcell[row][cell];
		} else {
			return "";
		}
	},

	sjisToRowCell(c1, c2, noAssert) {
		/*
			Number	c1,			The code of the first byte of the character represented by the Shift_JIS two bytes sequence.
			Number	c2,			The code of the second byte of the character represented by the Shift_JIS two bytes sequence.
			Boolean	noAssert,		Skip the validation of assignment at the row-cell?
		*/
		c1 = toUint8(c1);
		c2 = toUint8(c2);

		if ((0x81 <= c1 && c1 <= 0x9f || 0xe0 <= c1 && c1 <= 0xef) && (0x40 <= c2 && c2 <= 0xfc && c2 != 0x7f)) {
			const [cd1, cd2] = [c1 - 0x81 + (c1 >= 0xe0 ? (0x9f - 0xdf) : 0), c2 - (c2 > 0x7f ? 0x41 : 0x40)];
			const [row, cell] = [(cd1 * 2 + (cd2 < 94 ? 0 : 1)) + 1, (cd2 >= 94 ? cd2 - 94 : cd2) + 1];

			return noAssert || this.isAssigned(row, cell) ? [row, cell] : null;
		} else {
			return null;
		}
	},

	rowCellToSjis(row, cell, noAssert) {
		/*
			Number	row,			The row of the JIS X 0208.
			Number	cell,			The cell of JIS X 0208.
			Boolean	noAssert,		Skip the validation of assignment at the row-cell?
		*/
		row = parseInt(Number(row));
		cell = parseInt(Number(cell));

		if (!noAssert && !this.isAssigned(row, cell)) {
			return null;
		} else if (1 <= row && row <= 94 && 1 <= cell && cell <= 94) {
			const b1 = row <= 62 ? ((row - 1) / 2 >>> 0) + 0x81 : (((row - 63) / 2) >>> 0) + 0xe0;
			const b2 = cell + (row % 2 ? (cell <= 63 ? 0x3f : 0x40) : 0x9e);
			return [b1, b2];
		} else {
			return null;
		}
	},

	eucjpToRowCell(c1, c2, noAssert) {
		/*
			Number	c1,			The code of the first byte of the character represented by the EUC-JP two bytes sequence.
			Number	c2,			The code of the second byte of the character represented by the EUC-JP two bytes sequence.
			Boolean	noAssert,		Skip the validation of assignment at the row-cell?
		*/
		c1 = toUint8(c1);
		c2 = toUint8(c2);

		if (0xa1 <= c1 && c1 <= 0xfe && 0xa1 <= c2 && c2 <= 0xfe) {
			const [row, cell] = [c1 - 0xa0, c2 - 0xa0];
			return noAssert || this.isAssigned(row, cell) ? [row, cell] : null;
		} else {
			return null;
		}
	},

	rowCellToEucjp(row, cell, noAssert) {
		/*
			Number	row,			The row of the JIS X 0208.
			Number	cell,			The cell of JIS X 0208.
			Boolean	noAssert,		Skip the validation of assignment at the row-cell?
		*/
		row = parseInt(Number(row));
		cell = parseInt(Number(cell));

		if (!noAssert && !this.isAssigned(row, cell)) {
			return null;
		} else if (1 <= row && row <= 94 && 1 <= cell && cell <= 94) {
			return [row + 0xa0, cell + 0xa0];
		} else {
			return null;
		}
	},

	halfkanaToRowCell(code) {
		/* 
			Number	code,		The code value of the JIS X 0201 halfwidth kana.
			Returns:	Array	The row-cell of the JIS X 0208.
		*/

		code = toUint8(code);

		const rc = jisx0201kana[code];
		return rc ? [...rc] : null;
	}
};


module.exports = Jisx0208;


