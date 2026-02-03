# 🚀 Telegram Botni Render.com ga Joylash (Deploy) Qilish

Botni 24/7 ishlashi uchun uni **Render.com** (bepul hosting) ga joylaymiz.

## 1-qadam: GitHubga yuklash
Agar sizning kodingiz hali GitHubda bo'lmasa, uni yuklashingiz kerak.

1.  [GitHub](https://github.com) da yangi repository oching (masalan `ustozai-bot`).
2.  Loyiha papkasida terminalni ochib quyidagi buyruqlarni bering:
    ```bash
    git init
    git add .
    git commit -m "Bot deployga tayyor"
    git branch -M main
    git remote add origin https://github.com/SIZNING_USERNAMINGIZ/ustozai-bot.git
    git push -u origin main
    ```

## 2-qadam: Render.com da Service ochish
1.  [Render.com](https://render.com) ga kiring va ro'yxatdan o'ting (GitHub orqali kirsangiz osonroq).
2.  **"New +"** tugmasini bosib **"Web Service"** ni tanlang.
3.  **"Connect a repository"** bo'limidan hozir yuklagan `ustozai-bot` repoingizni tanlang.

## 3-qadam: Sozlamalar
Render sizdan quyidagi ma'lumotlarni so'raydi:

*   **Name:** `ustozai-bot` (yoki xohlagan nomingiz)
*   **Region:** `Frankfurt` (yoki `Oregon`) - farqi yo'q
*   **Branch:** `main`
*   **Root Directory:** `telegram-bot` (Muhim! Chunki bot shu papka ichida)
*   **Runtime:** `Node`
*   **Build Command:** `npm install`
*   **Start Command:** `node bot.js`
*   **Instance Type:** `Free`

## 4-qadam: O'zgaruvchilarni (Environment Variables) kiritish
Pastdagi **"Environment Variables"** bo'limiga o'ting va **"Add Environment Variable"** ni bosib quyidagilarni qo'shing:

1.  **Key:** `BOT_TOKEN`
    **Value:** (Telegram bot tokeningiz, `.env` faylidan oling)

2.  **Key:** `GEMINI_API_KEY`
    **Value:** (Google API kalingiz, `.env` faylidan oling)

## 5-qadam: Deploy qilish
**"Create Web Service"** tugmasini bosing.

Render botni o'rnatishni boshlaydi. Loglarni kuzating. Agar hammasi to'g'ri bo'lsa, log oxirida:
`🌍 Server is running on port 10000` va `✅✅✅ BOT ISHGA TUSHDI!` degan yozuvlarni ko'rasiz.

🎉 **Tabriklayman! Botingiz endi 24/7 ishlaydi.**
