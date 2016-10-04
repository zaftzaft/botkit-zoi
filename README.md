botkit-zoi
==========

# なにこれ
がんばるぞい

# インストール

```bash
$ npm i -g zaftzaft/botkit-zoi
```

# つかいかた

## 1. 反応する言葉と返信の画像を設定ファイルに書き込む
```json:eg
[
  {
    "word": "がんばる",
    "image": [
      "http://<がんばるぞいの画像URL>"
    ]
  }
]
```

## 2. 起動
```bash
$ BOTKIT_ZOI_TOKEN=xoxb-xxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxx
$ botkit-zoi -c botkit-zoi-config.json
```
