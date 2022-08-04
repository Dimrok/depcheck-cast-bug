# depcheck cast bug

Minimal example.

## The problem(s)

### invalid files do not cause a error

Because invalid files are ignored by depcheck, this can create false positives if an invalid file contains a dependency.

#### Example

[index.ts](./index.ts) imports `fast-glob`, which is declared in [package.json](./package.json) as a dependency.

If I run `yarn --silent depcheck`, the command will return -1 (255).

```bash
$ yarn --silent depcheck
Unused dependencies
* fast-glob
$ echo $?
255
```

However, if I run it with the flag `--json`, I can see that `<root>/depcheck-cast-bug/index.ts` was listed as invalid,
despite the fact it is valid typescript file (`yarn run build` to prove it).

```json
{
  "dependencies": [
    "fast-glob"
  ],
  "devDependencies": [],
  "missing": {},
  "using": {
    "depcheck": [
      "<root>/depcheck-cast-bug/package.json"
    ],
    "typescript": [
      "<root>/depcheck-cast-bug/package.json"
    ]
  },
  "invalidFiles": {
    "<root>/depcheck-cast-bug/index.ts": "SyntaxError: Unterminated JSX contents. (4:18)\n    at Parser._raise (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:541:17)\n    at Parser.raiseWithData (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:534:17)\n    at Parser.raise (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:495:17)\n    at Parser.jsxReadToken (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:7100:20)\n    at Parser.getTokenFromCode (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:7485:19)\n    at Parser.getTokenFromCode (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:10098:18)\n    at Parser.nextToken (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:2016:12)\n    at Parser.next (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:1922:10)\n    at Parser.eat (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:1927:12)\n    at Parser.expect (<root>/depcheck-cast-bug/node_modules/depcheck/node_modules/@babel/parser/lib/index.js:3554:10)"
  },
  "invalidDirs": {}
}
```

### <> cast is not supported

In the example files [index.ts](./index.ts), I use the less conventional cast operator <>.

```typescript
const b: any = 'foo';
const c = <string>b;
```

This causes an error, where tsc considers it valid code (`yarn run build` to prove it).
