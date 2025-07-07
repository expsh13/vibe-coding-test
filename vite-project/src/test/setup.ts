import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../mocks/node";

// テスト実行前にMSWサーバーを起動
beforeAll(() => server.listen());

// 各テスト後にハンドラーをリセット
afterEach(() => server.resetHandlers());

// テスト終了後にMSWサーバーを停止
afterAll(() => server.close());
