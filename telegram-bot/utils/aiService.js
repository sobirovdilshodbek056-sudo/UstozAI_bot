// AI Service - Mock AI responses for Telegram bot

class AIService {
    async getResponse(question) {
        // Simulate API delay
        await this.delay(800 + Math.random() * 700);

        const lowerQuestion = question.toLowerCase();

        // Math questions
        if (lowerQuestion.includes('tengla') || /\d+x/.test(lowerQuestion) || lowerQuestion.includes('matematik')) {
            return this.getMathResponse(question);
        }

        // Physics questions
        if (lowerQuestion.includes('fizik') || lowerQuestion.includes('tezlik') || lowerQuestion.includes('kuch')) {
            return this.getPhysicsResponse();
        }

        // Chemistry questions
        if (lowerQuestion.includes('kimyo') || lowerQuestion.includes('atom') || lowerQuestion.includes('molekula')) {
            return this.getChemistryResponse();
        }

        // Biology questions
        if (lowerQuestion.includes('biolog') || lowerQuestion.includes('hujayra') || lowerQuestion.includes('fotosintez')) {
            return this.getBiologyResponse();
        }

        return this.getGeneralResponse();
    }

    getMathResponse(question) {
        return `🧮 *Matematika*\n\n` +
            `Keling, bosqichma-bosqich yechamiz:\n\n` +
            `1️⃣ Berilgan: ${question}\n` +
            `2️⃣ Noma'lumni ajratamiz\n` +
            `3️⃣ Hisoblashlarni bajaramiz\n\n` +
            `*Misol:* 2x + 5 = 15\n` +
            `• 2x = 15 - 5\n` +
            `• 2x = 10\n` +
            `• x = 5\n\n` +
            `✅ *Javob:* x = 5\n\n` +
            `Yana savol bo'lsa, bemalol so'rang! 😊`;
    }

    getPhysicsResponse() {
        return `🔬 *Fizika*\n\n` +
            `*Tezlik formulasi:*\n` +
            `v = s / t\n\n` +
            `Bu yerda:\n` +
            `• v - tezlik (m/s)\n` +
            `• s - masofa (m)\n` +
            `• t - vaqt (s)\n\n` +
            `*Misol:*\n` +
            `Avtomobil 120 km ni 2 soatda bosib o'tsa:\n` +
            `v = 120 / 2 = 60 km/soat\n\n` +
            `Qo'shimcha tushuntirish kerakmi? 🚗`;
    }

    getChemistryResponse() {
        return `⚗️ *Kimyo*\n\n` +
            `*Asosiy tushunchalar:*\n\n` +
            `🔹 Atom - moddaning eng kichik qismi\n` +
            `🔹 Molekula - atomlardan tashkil topgan\n` +
            `🔹 Element - bir xil atomlardan iborat\n\n` +
            `*Masalan:*\n` +
            `Suv (H₂O):\n` +
            `• 2 ta vodorod (H)\n` +
            `• 1 ta kislorod (O)\n\n` +
            `Boshqa savol? 🧪`;
    }

    getBiologyResponse() {
        return `🌱 *Biologiya*\n\n` +
            `*Fotosintez jarayoni:*\n\n` +
            `O'simliklar yorug'lik yordamida oziq moddalar ishlab chiqaradi:\n\n` +
            `6CO₂ + 6H₂O + yorug'lik → C₆H₁₂O₆ + 6O₂\n\n` +
            `Bu jarayonda:\n` +
            `✅ Karbonat angidrid (CO₂) so'riladi\n` +
            `✅ Kislorod (O₂) chiqariladi\n` +
            `✅ Glyukoza (C₆H₁₂O₆) hosil bo'ladi\n\n` +
            `Yana tushuntirish kerakmi? 🔬`;
    }

    getGeneralResponse() {
        return `💡 *Ajoyib savol!*\n\n` +
            `Men sizga yordam berishga tayyorman!\n\n` +
            `Quyidagi fanlardan savollar berishingiz mumkin:\n` +
            `• 🧮 Matematika\n` +
            `• 🔬 Fizika\n` +
            `• ⚗️ Kimyo\n` +
            `• 🌱 Biologiya\n\n` +
            `Aniqroq savol bering, men batafsil tushuntirib beraman! 📚`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new AIService();
