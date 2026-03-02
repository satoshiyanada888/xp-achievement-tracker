# XP Achievement Tracker

個人の「前進」を **XPで可視化**して、静かに継続できる **ローカルファースト**な自己達成トラッカーです。

- **MVP**: デイリークエスト / カスタムクエスト / XP・レベル / 履歴ログ
- **UX**: 3秒でチェック、達成時は控えめに報酬（小さなアニメ・トースト）
- **設計**: ストレージ層を抽象化しており、IndexedDB / DB同期へ移行しやすい構造

## ディレクトリ構成

```
xp-achievement-tracker/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    Dashboard.tsx
    QuestRow.tsx
    AddQuestModal.tsx
    TinyToast.tsx
    ui/
      Card.tsx
      ProgressBar.tsx
  lib/
    date.ts
    domain/
      level.ts
      quests.ts
      types.ts
    storage/
      driver.ts
      localStorageDriver.ts
      zustandStorage.ts
    store/
      useXpStore.ts
```

## セットアップ手順

```bash
cd "/Users/s_yanada/xp-achievement-tracker"
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 本番ビルド方法

```bash
npm run build
npm run start
```

## 設計思想（なぜこの形？）

- **「やった」を最短で残す**: 入力よりチェックに寄せて、日々の達成感を阻害しない
- **ログを一次情報にする**: “何を完了したか” を履歴として残し、自己効力感を積み上げる
- **過剰なゲーミフィケーションを避ける**: 短い演出は入れるが、集中を邪魔しない

## 拡張しやすい設計ポイント

- **ストレージ層の抽象化**: `lib/storage/driver.ts` を境界にしているので、
  - IndexedDB（Dexie等）へ差し替え
  - Supabase / 自前API同期（将来）
  が容易です。
- **ドメイン関数の分離**: レベル計算やクエスト定義は `lib/domain/` に閉じており、UIから独立
- **状態管理はZustand**: UIは `useXpStore` のアクションに依存し、移行コストが低い

## 次に追加しやすい機能

- 週間レポート（7日合計XP、カテゴリ別）
- ストリーク（連続達成）
- PWA対応（オフライン強化・通知）
- クラウド同期（Supabase等）
- GitHubアクティビティ連携（コミット数 → XP など）
