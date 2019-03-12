# jisx0208


## Description

jisx0208は、`JIS X 0208`で規定された区点に関する変換機能を提供する。


## Requirements

* [node.js](http://nodejs.org/) -- v8 or newer


## Install

    npm install jisx0208


## Examples

* 区点から、その文字に対応するShift_JISでの符号を得る:

```javascript
const jisx0208 = require('jisx0208');

// {16, 1}, [0x88, 0x9F](Shift_JIS) : "亜"
jisx0208.rowCellToSjis(16, 1);// [136, 159] ([0x88, 0x9F])
```

* EUC-JPの符号から、その文字の区点を得る:

```javascript
const jisx0208 = require('jisx0208');

// {84, 6}, [0xF4, 0xA6](EUC-JP) : "熙"
jisx0208.eucjpToRowCell(0xF4, 0xA6);// [84, 6]
```


## Encoding

区点への文字の割り当ては、`JIS X 0208`1997年版に従う。

区点からの変換先、および区点への変換元となるエンコーディングスキームとしては、`EUC-JP`と`Shift_JIS`をサポートする。

区点が{1, 1}から{94, 94}の範囲内にある限り、区点から`EUC-JP`または`Shift_JIS`の符号に変換し、それを再度区点に変換すると、必ず元の区点と同じ値となる。

```javascript
// Round-trip conversion

const jisx0208 = require('jisx0208');

for (let row=1; row<=94; row++) {
	for (let cell=1; cell<=94; cell++) {
		assert.deepEqual([row, cell], jisx0208.sjisToRowCell(...jisx0208.rowCellToSjis(row, cell, true), true));
		assert.deepEqual([row, cell], jisx0208.eucjpToRowCell(...jisx0208.rowCellToEucjp(row, cell, true), true));
	}
}
// OK
```


## API

#### jisx0208.isAssigned(row, cell)

* `row` {Integer}
* `cell` {Integer}
* Returns: {Boolean}

区点{`row`, `cell`}に、`JIS X 0208`で文字が定義されている場合`true`を返し、そうでない場合`false`を返す。

```javascript
const jisx0208 = require('jisx0208');

// {5, 2} : "ア"
jisx0208.isAssigned(5, 2);// true

// {13, 1} : "①", (CP932)
jisx0208.isAssigned(13, 1);// false
```


#### jisx0208.eucjpToRowCell(c1, c2, noAssert)

* `c1` {Integer} `EUC-JP`2byteで表される文字の1byte目の符号
* `c2` {Integer} `EUC-JP`2byteで表される文字の2byte目の符号
* `noAssert` {Boolean} 未定義領域の判定をスキップする **Default**: `false`
* Returns: {Array|null}

2byteの符号の並び[`c1`, `c2`]を、`EUC-JP`で表される文字と解釈して`JIS X 0208`の区点に変換し、[`区`, `点`]の順で格納した長さ2の配列を返す。その区点に`JIS X 0208`で文字が定義されていない場合、`null`を返す。

シングルシフト制御文字によって表現される文字から区点への変換は、対応しない。

`noAssert`を`true`に設定すると、得られた区点に文字が定義されているかどうかの判定を省略する。ただし、[`c1`, `c2`]が区点{1, 1}から{94, 94}の範囲に変換できない場合、`noAssert`の指定にかかわらず`null`を返す。

引数`c1`、`c2`は、8bit符号無し整数に変換された上で処理される。

```javascript
const jisx0208 = require('jisx0208');

// [0xA5, 0xA2](EUC-JP) : "ア"
jisx0208.eucjpToRowCell(0xA5, 0xA2);// [5, 2]

// [0x8E, 0xB1](EUC-JP) : "ｱ" (HALFWIDTH KATAKANA LETTER A)
jisx0208.eucjpToRowCell(0x8E, 0xB1);// null
jisx0208.eucjpToRowCell(0x8E, 0xB1, true);// null

// [0xAD, 0xA1](EUC-JP) : Not Assigned
jisx0208.eucjpToRowCell(0xAD, 0xA1);// null
jisx0208.eucjpToRowCell(0xAD, 0xA1, true);// [13, 1]
```


#### jisx0208.sjisToRowCell(c1, c2, noAssert)

* `c1` {Integer} `Shift_JIS`2byteで表される文字の1byte目の符号
* `c2` {Integer} `Shift_JIS`2byteで表される文字の2byte目の符号
* `noAssert` {Boolean} 未定義領域の判定をスキップする **Default**: `false`
* Returns: {Array|null}

2byteの符号の並び[`c1`, `c2`]を、`Shift_JIS`で表される文字と解釈して`JIS X 0208`の区点に変換し、[`区`, `点`]の順で格納した長さ2の配列を返す。その区点に`JIS X 0208`で文字が定義されていない場合、`null`を返す。

JIS X 0201で規定する文字集合に含まれる文字から区点への変換は、対応しない。

`noAssert`を`true`に設定すると、得られた区点に文字が定義されているかどうかの判定を省略する。ただし、[`c1`, `c2`]が区点{1, 1}から{94, 94}の範囲に変換できない場合、`noAssert`の指定にかかわらず`null`を返す。

引数`c1`、`c2`は、8bit符号無し整数に変換された上で処理される。

```javascript
const jisx0208 = require('jisx0208');

// [0x83, 0x41](Shift_JIS) : "ア"
jisx0208.sjisToRowCell(0x83, 0x41);// [5, 2]

// [0xB1](EUC-JP) : "ｱ" (HALFWIDTH KATAKANA LETTER A)
jisx0208.sjisToRowCell(0xB1);// null

// [0x87, 0x40](CP932) : "①"
jisx0208.sjisToRowCell(0x87, 0x40);// null
jisx0208.sjisToRowCell(0x87, 0x40, true);// [13, 1]
```


#### jisx0208.rowCellToEucjp(row, cell, noAssert)

* `row` {Integer} 
* `cell` {Integer} 
* `noAssert` {Boolean} 未定義領域の判定をスキップする **Default**: `false`
* Returns: {Array|null}

区点{`row`, `cell`}で定義される文字を、`EUC-JP`で表した場合の2byteの符号の並び[`c1`, `c2`]を、長さ2の配列として返す。区点{`row`, `cell`}に`JIS X 0208`で文字が定義されていない場合、`null`を返す。

シングルシフト制御文字を用いた表現には変換しない。

`noAssert`を`true`に設定すると、区点{`row`, `cell`}に文字が定義されているかどうかの判定を省略する。ただし、{`row`, `cell`}が{1, 1}から{94, 94}の範囲にない場合、`noAssert`の指定にかかわらず`null`を返す。

```javascript
const jisx0208 = require('jisx0208');

// {5, 2} : "ア"
jisx0208.rowCellToEucjp(5, 2);// [165, 162] ([0xA5, 0xA2])

// {13, 1} : "①", (CP932)
jisx0208.rowCellToEucjp(13, 1);// null
jisx0208.rowCellToEucjp(13, 1, true);// [173, 161] (0xAD, 0xA1)
```


#### jisx0208.rowCellToSjis(row, cell, noAssert)

* `row` {Integer} 
* `cell` {Integer} 
* `noAssert` {Boolean} 未定義領域の判定をスキップする **Default**: `false`
* Returns: {Array|null}

区点{`row`, `cell`}で定義される文字を、`Shift_JIS`で表した場合の2byteの符号の並び[`c1`, `c2`]を、長さ2の配列として返す。区点{`row`, `cell`}に`JIS X 0208`で文字が定義されていない場合、`null`を返す。

JIS X 0201で規定する文字集合に含まれる文字には変換しない。

`noAssert`を`true`に設定すると、区点{`row`, `cell`}に文字が定義されているかどうかの判定を省略する。ただし、{`row`, `cell`}が{1, 1}から{94, 94}の範囲にない場合、`noAssert`の指定にかかわらず`null`を返す。

```javascript
const jisx0208 = require('jisx0208');

// {5, 2} : "ア"
jisx0208.rowCellToSjis(5, 2);// [131, 65] ([0x83, 0x41])

// {13, 1} : "①", (CP932)
jisx0208.rowCellToSjis(13, 1);// null
jisx0208.rowCellToSjis(13, 1, true);// [135, 64] ([0x87, 0x40])
```


#### jisx0208.halfkanaToRowCell(code)

* `code` {Integer}
* Returns: {Array|null}

`code`を、`JIS X 0201`8ビット符号によって文字を表現していると解釈し、その文字に対応する`JIS X 0208`内の文字の区点を、[`区`, `点`]の順で格納した長さ2の配列を返す。

ただし、`code`が`JIS X 0201`8ビット符号で片仮名用図形文字集合が割り当てられている範囲にない値の場合、`null`を返す。

引数`code`は、8bit符号無し整数に変換された上で処理される。

```javascript
const jisx0208 = require('jisx0208');

// [0xB1](JIS X 0201(8bit), Shift_JIS) : "ｱ" (HALFWIDTH KATAKANA LETTER A)
jisx0208.halfkanaToRowCell(0xB1);// [5, 2]
// {5, 2} : "ア" (KATAKANA LETTER A)

// [0x40](JIS X 0201(8bit), Shift_JIS) ; "A"
jisx0208.halfkanaToRowCell(0x40);// null
```

