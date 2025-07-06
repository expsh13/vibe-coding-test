# テストコーディングガイドライン

このプロジェクトにおけるテストコードの作成・保守に関するルールとベストプラクティスを定義します。

## 基本原則

### 1. 日本語でのテスト記述

**すべてのテストは日本語で記述する**

```typescript
// ✅ 良い例
describe('TodoItemコンポーネント', () => {
  it('Todo内容を表示する', () => {
    // テスト内容
  })
  
  it('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    // テスト内容
  })
})

// ❌ 悪い例
describe('TodoItem Component', () => {
  it('renders todo content', () => {
    // テスト内容
  })
})
```

**理由:**
- チーム全体での理解の統一
- 仕様の明確化
- 非開発者との共有時の理解促進

### 2. AAAパターンの採用

**すべてのテストケースでAAAパターンのコメントを必須とする**

```typescript
// ✅ 必須パターン
it('新しいTodoが追加される', () => {
  // Arrange - テストデータと初期状態を準備
  const mockTodo = { content: 'テスト内容', priority: 'high' }
  render(<TodoApp />)
  
  // Act - テスト対象の操作を実行
  const input = screen.getByTestId('add-todo-input')
  fireEvent.change(input, { target: { value: mockTodo.content } })
  fireEvent.click(screen.getByTestId('add-todo-submit'))
  
  // Assert - 期待される結果を検証
  expect(screen.getByText(mockTodo.content)).toBeInTheDocument()
})
```

**AAAパターンの詳細:**

- **Arrange（準備）**: テストに必要なデータ、モック、初期状態の設定
- **Act（実行）**: テスト対象の機能やメソッドの実行
- **Assert（検証）**: 期待される結果との比較・検証

## ファイル構成ルール

### ディレクトリ構造

```
src/
├── components/
│   ├── TodoItem.tsx
│   └── __tests__/
│       └── TodoItem.test.tsx
├── utils/
│   ├── todo.ts
│   └── __tests__/
│       └── todo.test.ts
└── types/
    └── todo.ts
```

### ファイル命名規則

- テストファイル: `[対象ファイル名].test.ts/tsx`
- テストディレクトリ: `__tests__/`

## テスト記述ルール

### 1. describe文の記述

```typescript
// コンポーネントのテスト
describe('TodoItemコンポーネント', () => {})

// ユーティリティ関数のテスト
describe('Todoユーティリティ', () => {})

// 機能別グループ化
describe('createTodo', () => {})
```

### 2. it文の記述

**動作を明確に表現する**

```typescript
// ✅ 良い例
it('空の内容でフォーム送信してもonAddが呼ばれない', () => {})
it('優先度選択が正しく更新される', () => {})
it('pendingのTodoをcompletedのTodoより前にソートする', () => {})

// ❌ 悪い例
it('テスト1', () => {})
it('動作確認', () => {})
it('バリデーション', () => {})
```

### 3. beforeEach/afterEach

```typescript
describe('テストグループ', () => {
  beforeEach(() => {
    // モック関数のクリア
    vi.clearAllMocks()
  })
})
```

## テストコードのベストプラクティス

### 1. データのセットアップ

```typescript
// ✅ テストデータは明確に定義
const mockTodo: Todo = {
  id: '1',
  content: 'テストTodo内容',
  status: 'pending',
  priority: 'medium',
  createdAt: '2023-01-01T00:00:00.000Z',
}

// ✅ 再利用可能なpropsオブジェクト
const defaultProps = {
  todo: mockTodo,
  onToggle: mockOnToggle,
  onDelete: mockOnDelete,
}
```

### 2. アサーション（検証）

```typescript
// ✅ 具体的で意味のあるアサーション
expect(screen.getByTestId('todo-content-1')).toHaveTextContent('テスト内容')
expect(mockOnToggle).toHaveBeenCalledWith('1')
expect(mockOnToggle).toHaveBeenCalledTimes(1)

// ❌ 曖昧なアサーション
expect(result).toBeTruthy()
expect(element).toBeDefined()
```

### 3. モック関数の使用

```typescript
// ✅ 明確な命名とクリア
const mockOnAdd = vi.fn()
const mockOnToggle = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})
```

## エラーハンドリングテスト

### 境界値・エラーケースのテスト

```typescript
it('空白のみの内容でフォーム送信してもonAddが呼ばれない', () => {
  // Arrange - 空白文字列での入力を準備
  render(<AddTodo {...defaultProps} />)
  const input = screen.getByTestId('add-todo-input')
  const form = screen.getByTestId('add-todo-form')
  
  // Act - 空白のみの文字列で送信
  fireEvent.change(input, { target: { value: '   ' } })
  fireEvent.submit(form)
  
  // Assert - onAddが呼ばれないことを確認
  expect(mockOnAdd).not.toHaveBeenCalled()
})
```

## 非同期テストのルール

```typescript
it('非同期処理が完了する', async () => {
  // Arrange - 非同期操作の準備
  render(<AsyncComponent />)
  
  // Act - 非同期操作をトリガー
  fireEvent.click(screen.getByTestId('async-button'))
  
  // Assert - waitForを使用して結果を待機
  await waitFor(() => {
    expect(screen.getByText('完了')).toBeInTheDocument()
  })
})
```

## コードレビューチェックリスト

### テストコード作成時の確認事項

- [ ] テストの説明が日本語で記述されている
- [ ] AAAパターンのコメントが適切に配置されている
- [ ] beforeEachでモック関数がクリアされている
- [ ] テストケースが具体的で理解しやすい
- [ ] 境界値・エラーケースがカバーされている
- [ ] 非同期処理は適切にwaitForが使用されている
- [ ] モック関数の呼び出し回数・引数が検証されている

## サンプルテンプレート

### コンポーネントテストのテンプレート

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from '../ComponentName'

describe('ComponentNameコンポーネント', () => {
  const mockFunction = vi.fn()
  
  const defaultProps = {
    // プロパティの定義
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('期待される動作の説明', () => {
    // Arrange - テストデータと初期状態を準備
    
    // Act - テスト対象の操作を実行
    
    // Assert - 期待される結果を検証
  })
})
```

### ユーティリティ関数テストのテンプレート

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { functionName } from '../utility'

describe('ユーティリティ名', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('functionName', () => {
    it('期待される動作の説明', () => {
      // Arrange - 入力データを準備
      
      // Act - 関数を実行
      
      // Assert - 戻り値を検証
    })
  })
})
```

## 継続的改善

このガイドラインは以下の観点で定期的に見直しを行います：

- テストの可読性向上
- 保守性の改善
- チーム開発効率の向上
- 新しいテスト手法の導入

---

**更新履歴:**
- 2025-07-03: 初版作成