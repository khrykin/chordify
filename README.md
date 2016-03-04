# Chordify
You want to write a songbook in some markup language (HTML, LaTeX, etc...) and you've got monospaced text with chords somewhere in the internet... OK, then you need `chordify`.

## CLI Installation & Usage
First, install [node](https://nodejs.org).
On OSX you do `$ brew install node`. Then `$ npm install -g chordify`.

Then type `$ chordify` to see options list.

Usage:

```
$ chordify --[option] [param]
```

Latex and [ultimateguitar.com](ultimateguitar.com) example:

```
$ chordify --url https://tabs.ultimate-guitar.com/p/pulp/joyriders_crd.htm --selector .js-tab-content --pre \\chord{{chord}}{ --after } --gutter \\space{20}

```

Output:

```

Trying to find some chords at:
https://tabs.ultimate-guitar.com/p/pulp/joyriders_crd.htm

FETCHED 200 OK


RESULT 1



#----------------------------------PLEASE NOTE---------------------------------#
#This file is the author's own work and represents their interpretation of the #
#song. You may only use this file for private study, scholarship, or research. #
#------------------------------------------------------------------------------##
Date: Fri, 8 Dec 1995 20:15:31 +0100
From: XD321DT01@ntu.ac.uk (Wavey Davey!)
Subject: correct chords for "Joyriders" by Pulp

Joyriders, by Pulp

I couldn't get the original one I did, that e-mail account got wiped.
So here they are once again
Transcribed by Dave Twisleton xd321dt01@ntu.ac.uk
Lyrics from Anthony Bailey's Pulp Pages:
http://www.cs.man.ac.uk/~baileya/Pulp/L-joyriders.html

\chord{C}{} We like driving on a\chord{G}{}Saturday\chord{Am}{}night

\chord{C}{} past the Leisure Centre, \chord{G}{l}eft at the li\chord{B}{g}hts

Oh we don't look for tr\chord{C}{o}uble, but if it co\chord{F}{m}es we don't r\chord{Em}{u}n

Looking out for tr\chord{C}{o}uble is what w\chord{F}{e} call f\chord{Em}{u}n

\chord{B}{\space{20}}\space{20}
Hey y\chord{B}{o}u, you in the Jesus sandals

\chord{C}{w}ouldn't you l\chord{G}{i}ke to c\chord{B}{o}me

over and watch some vandals

\chord{C}{s}mashing up som\chord{G}{e}one's ho\chord{B}{m}e?

[VERSE 2] (same  chords as 1)

We can't help it we're so thick we can't think
can't think of anything but shit, sleep and drink
Oh and we like women; "Up the women!" we say
and if we get lucky yeah we might even meet some one day


\chord{C}{M}ister, we just want your c\chord{Em}{a}r

`cos we're t\chord{C}{a}king a girl to the re\chord{Em}{s}ervoir

\chord{F}{O}h all the pap\chord{F#}{e}rs say it's a tr\chord{B}{a}gedy
but don't you want to come and see?

\chord{C}{\space{20}}\space{20}\chord{G}{\space{20}}\space{20}\chord{Am}{\space{20}}\space{20}
\chord{C}{\space{20}}\space{20}\chord{G}{\space{20}}\space{20}\chord{B}{\space{20}}\space{20}
\chord{C}{\space{20}}\space{20}\chord{F}{\space{20}}\space{20}\chord{Em}{\space{20}}\space{20}
\chord{C}{\space{20}}\space{20}\chord{F}{\space{20}}\space{20}\chord{Em}{\space{20}}\space{20}
\chord{B}{\space{20}}\space{20}\chord{C}{\space{20}}\space{20}\chord{G}{\space{20}}\space{20}
\chord{B}{\space{20}}\space{20}\chord{C}{\space{20}}\space{20}\chord{G}{\space{20}}\space{20}
\chord{B}{\space{20}}\space{20}

Mister we just want your car
`cos we're taking a girl to the reservoir
Oh all the papers say it's a tragedy
Mister...

[end]
it's a tr\chord{B}{a}gedy.
```

Have fun!

## Javascript API

` import chordify from 'chordify';`

<a name="module_chordify"></a>
<a name="module_chordify..chordify"></a>
### chordify(string, pre, before, after, gutter, debug) ⇒ <code>string</code>
Main chrodifying function

**Kind**: inner method of <code>[chordify](#module_chordify)</code>  
**Returns**: <code>string</code> - output  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | String to inspect for chords |
| pre | <code>string</code> | String to be placed before chord's target character |
| before | <code>string</code> | String to be placed before chord's target character. `{chord}` will be replaced with actual chord signature. |
| after | <code>string</code> | String to be placed after chord's target character. `{chord}` will be replaced with actual chord signature. |
| gutter | <code>string</code> | String to be appended to the end of `after` in chords-only lines |
| debug | <code>boolean</code> | If set, outputs object with parsing info |
