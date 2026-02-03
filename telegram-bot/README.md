# UstozAI Telegram Bot - Ishga Tushirish

## 📋 Talablar

- Node.js (v14 yoki yuqori)
- npm (Node Package Manager)

## 🚀 O'rnatish va Ishga Tushirish

### 1. Dependencies o'rnatish

```bash
cd telegram-bot
npm install
```

### 2. Bot tokenini sozlash

`.env` fayli allaqachon yaratilgan va token qo'shilgan.

Agar yangi bot yaratmoqchi bo'lsangiz:
1. [@BotFather](https://t.me/botfather) ga boring
2. `/newbot` buyrug'ini bering
3. Bot nomini kiriting
4. Bot username kiriting
5. Tokenni `.env` fayliga qo'shing:

```
BOT_TOKEN=your_token_here
```

### 3. Botni ishga tushirish

```bash
npm start
```

yoki development mode uchun:

```bash
npm run dev
```

## ✅ Bot Ishlayotganini Tekshirish

Agar bot to'g'ri ishga tushsa, quyidagi xabarni ko'rasiz:

```
✅ UstozAI Bot ishga tushdi!
📱 Bot tayyor: @UstozAI_7bot
```

## 🎯 Botdan Foydalanish

1. Telegramda [@UstozAI_7bot](https://t.me/UstozAI_7bot) ni toping
2. `/start` buyrug'ini yuboring
3. **"🌍 Til o'rganish"** tugmasini bosing
4. Tilni tanlang va o'rganishni boshlang!

## 📚 Buyruqlar

- `/start` - Botni boshlash
- `/languages` yoki `/tillar` - Tillar ro'yxati
- `/help` - Yordam

## 🛠 Muammolar

### Bot javob bermayapti?

1. Bot ishga tushganini tekshiring (console da xabar bor)
2. Token to'g'ri ekanini tekshiring
3. Internet aloqangizni tekshiring
4. Botni qayta ishga tushiring:
   ```bash
   Ctrl+C  # to'xtatish
   npm start  # qayta ishga tushirish
   ```

### "node: command not found" xatosi?

Node.js o'rnatilmagan. [nodejs.org](https://nodejs.org) dan yuklab oling.

### Dependencies xatolari?

```bash
rm -rf node_modules
npm install
```

## 📞 Qo'shimcha Yordam

Muammo bo'lsa, botni to'xtatib qayta ishga tushiring va terminal loglarini ko'ring.
