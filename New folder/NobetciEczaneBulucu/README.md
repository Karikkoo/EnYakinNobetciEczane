# Nöbetçi Eczane Bulucu (AI)

Bu proje, Google Gemini yapay zeka teknolojisini ve Google Haritalar verilerini kullanarak, bulunduğunuz konuma en yakın nöbetçi eczaneyi bulan modern bir web uygulamasıdır.

## 🚀 Özellikler

- **Konum Tespiti:** Tarayıcı üzerinden anlık konumunuzu alır.
- **Yapay Zeka Analizi:** Gemini 2.5 Flash modeli ile Google Haritalar verilerini ("Grounding") kullanarak en güncel ve en yakın nöbetçi eczaneyi belirler.
- **Yol Tarifi:** Bulunan eczane için Google Haritalar bağlantısı ve mobil cihazlar için QR kod oluşturur.
- **Modern Arayüz:** React 19 ve Tailwind CSS ile geliştirilmiş, mobil uyumlu ve şık bir tasarım.

## 🛠️ Teknolojiler

- **Frontend:** React 19, TypeScript
- **Stil:** Tailwind CSS
- **AI & Data:** Google GenAI SDK (`@google/genai`), Google Maps Grounding

## 📦 Kurulum ve Çalıştırma

Bu proje ES Modules kullanmaktadır ve modern tarayıcılarda doğrudan çalışabilir (bir build işlemine ihtiyaç duymadan `esm.sh` üzerinden bağımlılıkları çeker).

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/kullaniciadi/nobetci-eczane-bulucu.git
   cd nobetci-eczane-bulucu
   ```

2. API Anahtarı:
   Bu uygulama çalışmak için geçerli bir Google GenAI API anahtarına ihtiyaç duyar. Kod içerisinde `process.env.API_KEY` kullanıldığı varsayılmıştır. Yerel geliştirme ortamınızda bu değişkenin tanımlı olduğundan emin olun.

3. Uygulamayı bir yerel sunucu ile başlatın (Örneğin VS Code Live Server veya Python http.server):
   ```bash
   python3 -m http.server
   ```

## ⚠️ Önemli Not

Bu uygulama Google Haritalar Grounding özelliğini kullanır. Bu özellik ücretli bir Google Cloud projesi gerektirebilir.

## Lisans

MIT
