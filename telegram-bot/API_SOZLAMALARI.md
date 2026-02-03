# 🔑 Google Gemini API Sozlamalarini To'g'irlash

Sizda chiqayotgan **404 xatosi** kodda emas, balki Google hisobingiz sozlamalarida **Generative Language API** yoqilmaganligini bildiradi.

Buni to'g'irlash uchun quyidagi qadamlarni bajaring:

### 1-qadam: Google AI Studio'ga kiring
Browserda mana bu manzilni oching:
👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 2-qadam: API Key tekshirish yoki yangisini olish
*   Agar ro'yxatda "UstozAI" yoki boshqa nomli kalit bo'lsa, **o'sha proyektni tanlang**.
*   Yoki **"Create API key"** tugmasini bosib yangi kalit yarating.
*   **Muhim:** "Create API key in new project" variantini tanlagan ma'qul.

### 3-qadam: API Keyni yangilash
Olingan yangi kalitni (boshlanishi `AIza...`) nusxalang va bot papkasidagi `.env` faylini ochib, eskisini o'rniga qo'ying:

```env
GEMINI_API_KEY=SIZNING_YANGI_KALITINGIZ
```

### 4-qadam: Botni qayta ishga tushirish
Keyni o'zgartirgandan so'ng, terminalda botni o'chirib (Ctrl+C) qayta yoqing:

```bash
node bot.js
```

---
**Qo'shimcha:** Agar baribir o'xshamasa, Google Cloud Console ([console.cloud.google.com](https://console.cloud.google.com)) ga kirib, loyihangizda **"Generative Language API"** qidirib, uni **"ENABLE"** qilishingiz kerak bo'ladi.
