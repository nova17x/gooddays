# Good Days - いいこと日記

今日あった良いことを書き留める日記アプリ。

温かみのあるUIデザインとポジティブなプロンプトで、毎日の良いことを記録する習慣をサポートします。

[📱 アプリを開く (Vercel)](https://gooddays.vercel.app)

## 機能

- **毎日の振り返り**: カレンダー形式で過去の「いいこと」を一覧表示
- **プロンプトチップ**: 「嬉しかったこと」「感謝」など、書き始めのきっかけを提供
- **安心のデータ管理**: データはブラウザに保存され、JSONファイルへのバックアップ・復元も可能
- **PWA対応**: ホーム画面に追加してアプリのように使えます

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zen Maru Gothic フォント

## 使い始め方

### 必要なもの

- [Node.js](https://nodejs.org/) v18 以上
- npm（Node.js に同梱）

### インストールと起動

```bash
# 1. リポジトリをクローン
git clone https://github.com/nova17x/gooddays.git
cd gooddays

# 2. 依存パッケージをインストール
npm install

# 3. 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開くとアプリが使えます。

### データについて

- 日記データはブラウザの **IndexedDB** に保存されます
- サーバーやデータベースは不要です
- ブラウザのデータを消去すると日記も消えるのでご注意ください
