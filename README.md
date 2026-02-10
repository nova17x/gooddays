# Good Days - いいこと日記

今日あった良いことを書き留める日記アプリ。

温かみのあるUIデザインとポジティブなプロンプトで、毎日の良いことを記録する習慣をサポートします。

## 機能

- 今日の日記を書く・編集する
- プロンプトチップで書き始めのきっかけを提供
- カレンダーで過去の日記を振り返る
- オートセーブで書き心地を大切に
- データはブラウザのlocalStorageに保存（サーバー不要）

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

- 日記データはブラウザの **localStorage** に保存されます
- サーバーやデータベースは不要です
- ブラウザのデータを消去すると日記も消えるのでご注意ください
