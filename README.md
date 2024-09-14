# jisx0208


## Description

jisx0208 provides methods about the row-cell defined by the `JIS X 0208`.


## Requirements

* [node.js](http://nodejs.org/) -- v12 or newer


## Install

    npm install @mmnaii/jisx0208


## Examples

* To convert a row-cell to the corresponding code of Shift_JIS:

```javascript
import {rowCellToSjis} from '@mmnaii/jisx0208';

// {16, 1}, [0x88, 0x9F](Shift_JIS) : "亜"
rowCellToSjis(16, 1);// [136, 159] ([0x88, 0x9F])
```

* To convert a code of EUC-JP to the corresponding row-cell:

```javascript
import {eucjpToRowCell} from '@mmnaii/jisx0208';

// {84, 6}, [0xF4, 0xA6](EUC-JP) : "熙"
eucjpToRowCell(0xF4, 0xA6);// [84, 6]
```


## Encoding

An assignment of characters to row-cells of the `JIS X 0208` follows the edition 1997.

As the encoding scheme to and from which a row-cell is converted, `EUC-JP` and `Shift_JIS` are supported.

As far as a row-cell is in the range of {1, 1} to {94, 94}, the operation that is to convert a row-cell to a code of `EUC-JP` or `Shift_JIS` and to convert again the gotten code to a row-cell always results in the same original row-cell.

```javascript
// Round-trip conversion

import {sjisToRowCell, rowCellToSjis, eucjpToRowCell, rowCellToEucjp} from '@mmnaii/jisx0208';

for (let row=1; row<=94; row++) {
	for (let cell=1; cell<=94; cell++) {
		assert.deepEqual([row, cell], sjisToRowCell(...rowCellToSjis(row, cell, true), true));
		assert.deepEqual([row, cell], eucjpToRowCell(...rowCellToEucjp(row, cell, true), true));
	}
}
// OK
```


## API

#### jisx0208.isAssigned(row, cell)

* `row` {Integer}
* `cell` {Integer}
* Returns: {Boolean}

Returns `true` if a character is defined at a row-cell {`row`, `cell`} by the `JIS X 0208`, `false` otherwise. 

```javascript
import {isAssigned} from '@mmnaii/jisx0208';

// {5, 2} : "ア"
isAssigned(5, 2);// true

// {13, 1} : "①", (CP932)
isAssigned(13, 1);// false
```


#### jisx0208.eucjpToRowCell(c1, c2, noAssert)

* `c1` {Integer} The code of the first byte of the character represented by the `EUC-JP` two bytes sequence
* `c2` {Integer} The code of the second byte of the character represented by the `EUC-JP` two bytes sequence
* `noAssert` {Boolean} Skip assignment validation? **Default**: `false`
* Returns: {Array|null}

Interpreting a two bytes sequence of codes [`c1`, `c2`] as a character represented by the `EUC-JP`, converts it to a row-cell of the `JIS X 0208` and returns an array, of which length is 2, that contains the results in order of [`row`, `cell`]. Returns `null` if `JIS X 0208` does not assigned a character at the converted row-cell.

A conversion from characters represented by using a single shift to row-cells is not supported.

Setting `noAssert` to `true` omits the validation whether a character is assigned at the converted row-cell. But if [`c1`, `c2`] cannot be converted to a row-cell in the range of {1, 1} to {94, 94}, returns `null` regardless the setting of `noAssert`.

The arguments `c1` and `c2` are converted to eight bit unsigned integers before the operation.

```javascript
import {eucjpToRowCell} from '@mmnaii/jisx0208';

// [0xA5, 0xA2](EUC-JP) : "ア"
eucjpToRowCell(0xA5, 0xA2);// [5, 2]

// [0x8E, 0xB1](EUC-JP) : "ｱ" (HALFWIDTH KATAKANA LETTER A)
eucjpToRowCell(0x8E, 0xB1);// null
eucjpToRowCell(0x8E, 0xB1, true);// null

// [0xAD, 0xA1](EUC-JP) : Not Assigned
eucjpToRowCell(0xAD, 0xA1);// null
eucjpToRowCell(0xAD, 0xA1, true);// [13, 1]
```


#### jisx0208.sjisToRowCell(c1, c2, noAssert)

* `c1` {Integer} The code of the first byte of the character represented by the `Shift_JIS` two bytes sequence
* `c2` {Integer} The code of the second byte of the character represented by the `Shift_JIS` two bytes sequence
* `noAssert` {Boolean} Skip assignment validation? **Default**: `false`
* Returns: {Array|null}

Interpreting a two bytes sequence of codes [`c1`, `c2`] as a character represented by the `Shift_JIS`, converts it to a row-cell of the `JIS X 0208` and returns an array, of which length is 2, that contains the results in order of [`row`, `cell`]. Returns `null` if `JIS X 0208` does not assigned a character at the converted row-cell.

A conversion from characters included in the character set defined by the `JIS X 0201` to row-cells is not supported.

Setting `noAssert` to `true` omits the validation whether a character is assigned at the converted row-cell. But if [`c1`, `c2`] cannot be converted to a row-cell in the range of {1, 1} to {94, 94}, returns `null` regardless the setting of `noAssert`.

The arguments `c1` and `c2` are converted to eight bit unsigned integers before the operation.

```javascript
import {sjisToRowCell} from '@mmnaii/jisx0208';

// [0x83, 0x41](Shift_JIS) : "ア"
sjisToRowCell(0x83, 0x41);// [5, 2]

// [0xB1](EUC-JP) : "ｱ" (HALFWIDTH KATAKANA LETTER A)
sjisToRowCell(0xB1);// null

// [0x87, 0x40](CP932) : "①"
sjisToRowCell(0x87, 0x40);// null
sjisToRowCell(0x87, 0x40, true);// [13, 1]
```


#### jisx0208.rowCellToEucjp(row, cell, noAssert)

* `row` {Integer} 
* `cell` {Integer} 
* `noAssert` {Boolean} Skip assignment validation? **Default**: `false`
* Returns: {Array|null}

Encodes a character assigned at a row-cell {`row`, `cell`} in `EUC-JP` and returns the result, that is a two bytes sequence of codes [`c1`, `c2`], as an array, of which length is 2. Returns `null` if `JIS X 0208` does not assigned a character at the converted row-cell.

Does not convert to characters represented by using a single shift.

Setting `noAssert` to `true` omits the validation whether a character is assigned at the row-cell {`row`, `cell`}. But if {`row`, `cell`} is not in the range of {1, 1} to {94, 94}, returns `null` regardless the setting of `noAssert`.

```javascript
import {rowCellToEucjp} from '@mmnaii/jisx0208';

// {5, 2} : "ア"
rowCellToEucjp(5, 2);// [165, 162] ([0xA5, 0xA2])

// {13, 1} : "①", (CP932)
rowCellToEucjp(13, 1);// null
rowCellToEucjp(13, 1, true);// [173, 161] (0xAD, 0xA1)
```


#### jisx0208.rowCellToSjis(row, cell, noAssert)

* `row` {Integer} 
* `cell` {Integer} 
* `noAssert` {Boolean} Skip assignment validation? **Default**: `false`
* Returns: {Array|null}

Encodes a character assigned at a row-cell {`row`, `cell`} in `Shift_JIS` and returns the result, that is a two bytes sequence of codes [`c1`, `c2`], as an array, of which length is 2. Returns `null` if `JIS X 0208` does not assigned a character at the converted row-cell.

Does not convert to characters included in the character set defined by the `JIS X 0201`.

Setting `noAssert` to `true` omits the validation whether a character is assigned at the row-cell {`row`, `cell`}. But if {`row`, `cell`} is not in the range of {1, 1} to {94, 94}, returns `null` regardless the setting of `noAssert`.

```javascript
import {rowCellToSjis} from '@mmnaii/jisx0208';

// {5, 2} : "ア"
rowCellToSjis(5, 2);// [131, 65] ([0x83, 0x41])

// {13, 1} : "①", (CP932)
rowCellToSjis(13, 1);// null
rowCellToSjis(13, 1, true);// [135, 64] ([0x87, 0x40])
```


#### jisx0208.halfkanaToRowCell(code)

* `code` {Integer}
* Returns: {Array|null}

In the `JIS X 0208` character set, finds a character corresponding to what the `code` represents by the eight bit code of the `JIS X 0201`, and returns the row-cell of the character as an array, of which length is 2, that contains the results in order of [`row`, `cell`].

But returns `null` if the `code` is not in the range where katakana graphic character set is assigned.

The argument `code` are converted to eight bit unsigned integers before the operation.

```javascript
import {halfkanaToRowCell} from '@mmnaii/jisx0208';

// [0xB1](JIS X 0201(8bit), Shift_JIS) : "ｱ" (HALFWIDTH KATAKANA LETTER A)
halfkanaToRowCell(0xB1);// [5, 2]
// {5, 2} : "ア" (KATAKANA LETTER A)

// [0x40](JIS X 0201(8bit), Shift_JIS) ; "A"
halfkanaToRowCell(0x40);// null
```

