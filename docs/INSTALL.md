# 行わけの導入・更新

対象は個人用Skillディレクトリです。管理されたプロジェクト用ディレクトリやsymlinkを使う環境では、その管理方法を優先します。

## 初回導入

[README](../README.md#導入する)のコマンドで取得・テストし、使用するホストへ `skills/gyowake/` の内容をコピーします。

| ホスト | 一般的な導入先 |
| --- | --- |
| `~/.agents/skills/` を読むホスト | `~/.agents/skills/gyowake/` |
| Claude Code | `~/.claude/skills/gyowake/` |

`SKILL.md` と、参照する `references/`・`scripts/`・`assets/`・`demo/` をまとめて配置します。探索場所・再読込方法は利用中のホストの版と設定に従います。

READMEの初回コマンドは既存ファイルやsymlinkがあると停止します。既存設定を残して内容を確認し、更新手順へ進んでください。

## 更新する

ソースcheckoutのブランチと変更を確認して更新します。ローカル変更や履歴の分岐がある場合は、それを保全してから統合してください。

```sh
cd gyowake
git status --short --branch
git pull --ff-only
npm test
git rev-parse HEAD
```

テスト成功後にバックアップして更新します。Claude Code用の例です。別ホストでは `target` を表の導入先に合わせます。

```sh
(
  set -eu
  target="$HOME/.claude/skills/gyowake"
  test -d "$target"
  test ! -L "$target"
  backup="${target}.backup-$(date +%Y%m%dT%H%M%S)-$$"
  test ! -e "$backup"
  test ! -L "$backup"
  cp -R "$target" "$backup"
  cp -R skills/gyowake/. "$target/"
  test -s "$target/SKILL.md"
  printf '更新先: %s\n復旧用コピー: %s\n' "$target" "$backup"
)
```

この更新は廃止ファイルを自動削除しません。構成変更がある版では変更履歴に従って別ディレクトリへの導入を検討します。バックアップは動作確認まで保持してください。

## 読込を確認する

再読込後に次を依頼します。

> 行わけを使い、読み込んだSkillの名前・版・所在と、参照ファイルを確認してください。対象URLの監査だけを行い、ソース変更や公開は行わないでください。

`name: gyowake`、版 `0.3.0-preview.2`、正しい所在を確認します。検出されない場合は探索先、参照ファイル、再読込と、ディレクトリの二重化を確認します。期待する配置は `gyowake/SKILL.md` です。

## 旧Kaigyoから移行する

1. 旧ディレクトリと設定を残し、新しい `gyowake` ディレクトリへ導入する。
2. 新版の名前・版と、監査モードの読込を確認する。
3. 同じ対象への旧版・新版の重複適用を避け、ホストの手順で参照を切り替える。
4. 旧版は復旧用に保全し、不要になった段階で整理する。

対象サイトのソース、他のSkill、既存symlinkは自動変更しません。`KaigyoCore` を参照する既存サイトは互換エイリアスを使えます。

問題は[Issues](https://github.com/netsujo-inc/gyowake/issues)へ、対象版・OS・シェル・ホストの版・コマンド・エラーと小さな再現例を添えて報告してください。認証情報や非公開顧客資料は含めないでください。
