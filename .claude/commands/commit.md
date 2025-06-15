請幫我 commit 目前的更動，包涵 staged 和 not staged 的變更，並符合以下條件：
1. 用英文撰寫，不要加特殊符號或 emoji
2. 根據內容以 feat, refactor, chore, doc, fix 等等開頭
3. 只寫一行 commit message 就好，勁量控制在 50 個字以內
4. 不要出現 ` 🤖 Generated with [Claude Code](https://claude.ai/code)`
5. 不要出現 `Co-Authored-By: Claude <noreply@anthropic.com>`

- 範例 1 - 假設我今天新增了一個功能是請假申請表單，commit message 應該這樣寫：  
  feat: add form for leave application
- 範例 2 - 假設我今天針對 time type 進行重構，把它從 `'fullDay'` 改成使用 enum：  
  refactor: use enum to instead of string on time type
