## A simple way to version your long lived json payloads

```ts
const upVersion = new VersionJson('version');

upversion
  .add(1, p => p)
  .add(2, p => {
    p.newData = p.data;
    delete p.data;
    return p;
  });

const newData = upversion.process({ version: 1, data: 'hello world'})

newData {
  version: 2,
  newData: 'hello world'
}
```

if you data doesn't have a field that can be used for versioning, you can use a function too

```ts
const upVersion = new VersionJson(payload => {
  if ('newData' in p) return 2;
  if ('data' in p) return 1;
});

upversion
  .add(1, p => p)
  .add(2, p => {
    p.newData = p.data;
    delete p.data;
    return p;
  });

const newData = upversion.process({ version: 1, data: 'hello world'})

newData {
  version: 2,
  newData: 'hello world'
}
```

