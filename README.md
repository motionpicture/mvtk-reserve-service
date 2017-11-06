<img src="https://motionpicture.jp/images/common/logo_01.svg" alt="motionpicture" title="motionpicture" align="right" height="56" width="98"/>

# MvtkReserve client library for Node.js

[![CircleCI](https://circleci.com/gh/motionpicture/mvtk-reserve-service.svg?style=svg&circle-token=e29e443f67a815be67d500d478ae3b8e413e7bab)](https://circleci.com/gh/motionpicture/mvtk-reserve-service)

node.jsでMvtkReserveサービスを使うためのライブラリです。


## Table of contents

* [Usage](#usage)
* [Example](#code-samples)
* [Jsdoc](#jsdoc)
* [License](#license)


## Usage

```shell
npm install @motionpicture/mvtk-reserve-service
```

```js
const mvtkReserve = require('@motionpicture/mvtk-reserve-service');
```

### 以下環境変数の設定が必須です。

```shell
set MVTK_RESERVE_ENDPOINT=*****APIのエンドポイント*****
```

## Code Samples

コードサンプルは [example](https://github.com/motionpicture/mvtk-reserve-service/tree/master/example) にあります。


## Jsdoc

`npm run doc`でjsdocを作成できます。./docに出力されます。

## License

ISC
