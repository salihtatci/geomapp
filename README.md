# 🗺️ Geomapp — Kelime Bulmaca

Geomatik / harita mühendisliği temalı, modern ve mobil uyumlu bir kelime bulmaca oyununun web prototipidir. Saf **HTML / CSS / JavaScript** ile yazılmıştır — derleme adımı yoktur, GitHub Pages'te doğrudan yayınlanabilir.

## ✨ Özellikler

- 🏠 Modern açılış ekranı (logo + Hoş Geldiniz)
- 🎯 Üstte ipucu kutusu, ortada crossword ızgarası, altta dairesel **word wheel**
- 🖱️ Mouse + dokunmatik destekli harf birleştirme (Pointer Events)
- 🔀 **Karıştır** — harflerin yerini değiştir
- 💡 **İpucu** — 10 puan karşılığı rastgele bir harf aç
- 📖 **Sözlük** — bulunan kelimenin anlamını gösterir
- 🏆 Puan ve seviye sistemi
- 📱 Responsive (mobil + tablet + masaüstü)
- 🎨 Şeffaf cam butonlar, yuvarlak hatlar, Poppins fontu

## 📁 Dosya Yapısı

```
geomapp/
├── index.html              # Tek sayfa giriş noktası
├── css/
│   └── style.css           # Tüm stiller (tema değişkenleri ile)
├── js/
│   ├── app.js              # Uygulama bootstrap, modal & toast
│   ├── game.js             # Oyun mantığı (level, grid, skor)
│   └── wordwheel.js        # Dairesel harf seçici modülü
├── data/
│   └── levels.json         # Seviye verileri (kolayca genişletilebilir)
├── assets/                 # (görseller için ayrılmıştır)
└── README.md
```

## 🚀 Çalıştırma

JSON dosyası `fetch` ile yüklendiği için bir HTTP sunucusu gerekir:

```bash
# Python ile
python3 -m http.server 8080

# veya Node ile
npx serve .
```

Sonra tarayıcıda: `http://localhost:8080`

## 🌐 GitHub Pages'te Yayınlama

1. Bu klasörü bir GitHub deposuna push'la.
2. **Settings → Pages → Branch: main / root** seçeneğini etkinleştir.
3. Birkaç saniye sonra `https://<kullanıcı>.github.io/<repo>/` adresinde yayında.

## ➕ Yeni Seviye / Kelime Ekleme

`data/levels.json` dosyasını düzenle. Her seviye şu yapıyı kullanır:

```json
{
  "id": 4,
  "clue": "Buraya ipucu metni…",
  "letters": ["A", "Z", "İ", "M", "U", "T"],
  "words": [
    { "word": "AZİMUT", "meaning": "Kuzey doğrultusundan saat yönünde ölçülen yatay açı." }
  ]
}
```

> **Not:** `letters` dizisi en uzun kelimenin tüm harflerini içermelidir. Kısa kelimeler bunların alt kümesi olmalıdır.

## 🛣️ Yol Haritası

- [ ] Gerçek crossword düzeni (kelime kesişimleri)
- [ ] LocalStorage ile ilerleme kaydı
- [ ] Ses efektleri & animasyonlar
- [ ] Türkçe sözlük entegrasyonu (ör. TDK API)
- [ ] **Flutter / React Native** ile mobile port

## 📜 Lisans

MIT — istediğin gibi kullan, geliştir, paylaş.
