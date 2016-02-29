# Chordify

<a name="chordify"></a>
## chordify(string, pre, before, after, gutter) ⇒ <code>string</code>
Main chrodifying function

**Kind**: global function  
**Returns**: <code>string</code> - output  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | string to inspect for chords |
| pre | <code>string</code> | string to be placed before chord's target character |
| before | <code>string</code> | string to be placed before chord's target character. `{chord}` will be replaced with actual chord signature. |
| after | <code>string</code> | string to be placed after before chord's target character. `{chord}` will be replaced with actual chord signature. |
| gutter | <code>string</code> | string to be appended to the end of `after` in chords-only lines |
