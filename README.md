# Outlook 連携

Bot Frameworkから認証画面(No AuthBot)を出さずにOutlookの予定や会議室の空きをぶっこ抜きたいあなたへ

## 参考情報

- 参考1: https://tsmatz.wordpress.com/2015/04/09/azure-ad-backend-server-side-deamon-service/
- 参考2: https://www.slideshare.net/AyakoUruno/bot-office-365-microsoft-bot-framework-microsoft-graph-api-ux

参考2 では client_secret で取れるAccess Tokenが仕えるとありますが現在では証明書を利用した強いAccess Tokenが必要になっており、参考1を元にこれを作りました。

どこを見ても makecert.exe で証明書を作るとあるのですがWindowsを購入しなくても openssl で作れるようにしています、ご安心下さい。

## アプリケーションの登録

https://portal.azure.com or https://aad.portal.azure.com

マルチテナントしたい場合は https://portal.azure.com から登録して自テナントで管理者による承諾フローを確認すると良い。

承諾フローは管理者権限で下記URLをクリックし、承諾ボタンをクリックすれば良い。（localhostへのアクセスはエラーになるが権限は付与される）

https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&prompt=admin_consent&client_id=$APPLICATION_ID&resource=https%3a%2f%2foutlook.office.com%2f&redirect_uri=http%3A%2F%2Flocalhost

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

国コードとか聞かれますがいつもの要領で適当に答えましょう。

## マニフェスト用の設定生成

```
node settings.js
```

マニフェストの keyCredentials に突っ込む設定が出力されます。

```
"keyCredentials": [<ここにペースト>],
```

## 予定一覧取得

```
node app.js
```

## for httpie

```
■ 予定一覧
http -v https://outlook.office.com/api/v2.0/users/USER_NAME@$TENANT_ID.onmicrosoft.com/events Authorization:"Bearer $ACCESS_TOKEN"

■ 会議室一覧
http -v https://outlook.office.com/api/beta/users/USER_NAME@$TENANT_ID.onmicrosoft.com/findrooms Authorization:"Bearer $ACCESS_ATOKEN"
```
