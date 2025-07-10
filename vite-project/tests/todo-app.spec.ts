import { test, expect } from "@playwright/test";

test.describe("Todo アプリケーション", () => {
  test.beforeEach(async ({ page }) => {
    // ページを開く（MSWが自動で有効）
    await page.goto("/");
  });

  test("初期表示で既存のTodoが表示される", async ({ page }) => {
    // Arrange - ページ読み込み完了を待つ
    await page.waitForSelector('[data-testid="todo-app-with-api"]');

    // Act - 特別な操作なし（初期表示のテスト）

    // Assert - MSWのモックデータが表示される
    await expect(page.getByText("Todo App (API版)")).toBeVisible();
    await expect(page.getByText("モックTodo1")).toBeVisible();
    await expect(page.getByText("モックTodo2")).toBeVisible();
  });

  test("新しいTodoを追加できる", async ({ page }) => {
    // Arrange - ページ読み込み完了を待つ
    await page.waitForSelector('[data-testid="todo-app-with-api"]');

    // Act - 新しいTodoを追加
    await page.fill('[data-testid="add-todo-input"]', "E2Eテストで追加");
    await page.selectOption('[data-testid="add-todo-priority"]', "high");
    await page.click('[data-testid="add-todo-submit"]');

    // Assert - 新しいTodoが一覧に表示される
    await expect(page.getByText("E2Eテストで追加")).toBeVisible();
  });

  test("Todoの完了状態を切り替えできる", async ({ page }) => {
    // Arrange - ページ読み込み完了を待つ
    await page.waitForSelector('[data-testid="todo-app-with-api"]');

    // Act - 最初のTodoのチェックボックスをクリック
    const firstCheckbox = page.locator('[data-testid="todo-checkbox-1"]');
    await firstCheckbox.click();

    // Assert - チェックボックスがチェック状態になる
    await expect(firstCheckbox).toBeChecked();
  });

  test("Todoを削除できる", async ({ page }) => {
    // Arrange - ページ読み込み完了を待つ
    await page.waitForSelector('[data-testid="todo-app-with-api"]');

    // 削除前にTodoが存在することを確認
    await expect(page.getByText("モックTodo1")).toBeVisible();

    // Act - 最初のTodoの削除ボタンをクリック
    await page.click('[data-testid="todo-delete-1"]');

    // Assert - Todoが一覧から消える
    await expect(page.getByText("モックTodo1")).not.toBeVisible();
  });
});
