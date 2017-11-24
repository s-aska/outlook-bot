# Outlook 連携

Bot Frameworkから認証画面(No AuthBot)を出さずにOutlookの予定や会議室の空きをぶっこ抜きたいあなたへ

## アプリケーションの登録

### Azure Active Directory 管理センターを開く
https://aad.portal.azure.com

### アプリケーションの登録
[Azure Active Directory] > [アプリの登録] > [＋新しいアプリケーションの登録]

```
名前: お好きに
アプリケーションの種類: Web アプリ/API
サインオン URL: http://localhost
```

サインオン URLは使わないので適当で良いです、アプリケーションの種類をネイティブにすると動きません。

### [必要なアクセス権限] > [Office 365 Exchange Online]
下記2つを有効に
- Read calendars in all mailboxes <- カレンダー一覧、イベント一覧取得に必要
- Read all users' basic profiles <- 会議室一覧取得に必要

### [アクセス許可の付与]
これをやっておかないと Access Token 取っても権限が付かない

## env.rc

```
export TENANT_ID='YOUR_DOMAIN.onmicrosoft.com'
export APPLICATION_ID='YOUR_APPLICATION_ID'
```

- TENANT_ID ... Office 365 のドメインです。
- APPLICATION_ID ... 前項で作ったアプリケーションIDです。

## 証明書の生成

```
./makecert.sh
```

## マニフェスト用の設定生成

```
node settings.js
```

## 予定一覧取得

```
node app.js
```

## for httpie

```
■ 予定一覧
http -vv https://outlook.office.com/api/v2.0/users/USER_NAME@$TENANT_ID.onmicrosoft.com/events Authorization:"Bearer $ACCESS_TOKEN"

■ 会議室一覧
http -vv https://outlook.office.com/api/beta/users/USER_NAME@$TENANT_ID.onmicrosoft.com/findrooms Authorization:"Bearer $ACCESS_ATOKEN"
```
