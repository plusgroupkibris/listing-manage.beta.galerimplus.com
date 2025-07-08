export interface EquipmentGroup {
  id: string; // Donanım grubu kimliği (Örn: "guvenlik", "konfor")
  groupName: string; // Donanım grubu adı (Örn: "Güvenlik", "Konfor")
  features: EquipmentFeature[]; // Grup içindeki özellikler
}

export interface EquipmentFeature {
  id: string; // Özellik kimliği (Örn: "abs", "ebd")
  name: string; // Özellik adı (Örn: "ABS", "EBD")
  description?: string | null; // Özelliğin açıklaması
  infoLink?: string | null; // Detaylı bilgi için bağlantı (örneğin: "https://otosozluk.galerimplus.com/term/abs-anti-lock-braking-system")
}

export const equipmentGroups: EquipmentGroup[] = [
  {
    id: "ic-donanım",
    groupName: "İç Donanım",
    features: [
      {
        id: "deri-koltuk",
        name: "Deri Koltuk",
      },
      {
        id: "kumas-koltuk",
        name: "Kumaş Koltuk",
      },
      {
        id: "deri-kumas-koltuk",
        name: "Deri/Kumaş Koltuk",
      },
      {
        id: "elektrikli-on-camlar",
        name: "Elektrikli Ön Camlar",
      },
      {
        id: "on-kol-dayama",
        name: "Ön Kol Dayama",
      },
      {
        id: "arka-kol-dayama",
        name: "Arka Kol Dayama",
      },
      {
        id: "anahtarsiz-surus",
        name: "Anahtarsız Sürüş",
      },
      {
        id: "6-ileri-vites",
        name: "6 İleri Vites",
      },
      {
        id: "7-ileri-vites",
        name: "7 İleri Vites",
      },
      {
        id: "hidrolik-direksiyon",
        name: "Hidrolik Direksiyon",
      },
      {
        id: "fonksiyonel-direksiyon",
        name: "Fonksiyonel Direksiyon",
      },
      {
        id: "ayarlanabilir-direksiyon",
        name: "Ayarlanabilir Direksiyon",
      },
      {
        id: "deri-direksiyon",
        name: "Deri Direksiyon",
      },
      {
        id: "ahsap-direksiyon",
        name: "Ahşap Direksiyon",
      },
      {
        id: "isitmali-direksiyon",
        name: "Isıtmalı Direksiyon",
      },
      {
        id: "elektrikli-koltuklar",
        name: "Elektrikli Koltuklar",
      },
      {
        id: "hafizali-koltuklar",
        name: "Hafızalı Koltuklar",
      },
      {
        id: "katlanir-koltuklar",
        name: "Katlanır Koltuklar",
      },
      {
        id: "on-isitmali-koltuklar",
        name: "Ön Isıtmalı Koltuklar",
      },
      {
        id: "arka-isitmali-koltuklar",
        name: "Arka Isıtmalı Koltuklar",
      },
      {
        id: "sogutmali-koltuklar",
        name: "Soğutmalı Koltuklar",
      },
      {
        id: "hiz-sabitleyici",
        name: "Hız Sabitleyici",
      },
      {
        id: "adaptive-cruise-control",
        name: "Adaptive Cruise Control",
      },
      {
        id: "sogutmali-torpido",
        name: "Soğutmalı Torpido",
      },
      {
        id: "yol-bilgisayari",
        name: "Yol Bilgisayarı",
      },
      {
        id: "krom-kaplama",
        name: "Krom Kaplama",
      },
      {
        id: "ahsap-kaplama",
        name: "Ahşap Kaplama",
      },
      {
        id: "head-up-display",
        name: "Head-up Display",
      },
      {
        id: "start-stop",
        name: "Start/Stop",
      },
      {
        id: "geri-gorus-kamerasi",
        name: "Geri Görüş Kamerası",
      },
      {
        id: "on-gorus-kamerasi",
        name: "Ön Görüş Kamerası",
      },
      {
        id: "3-sira-koltuk",
        name: "3.Sıra Koltuk",
      },
      {
        id: "klima-dijital",
        name: "Klima Dijital",
      },
      {
        id: "klima-analog",
        name: "Klima Analog",
      },
    ],
  },
  {
    id: "dis-donanım",
    groupName: "Dış Donanım",
    features: [
      {
        id: "hardtop",
        name: "Hardtop",
      },
      {
        id: "far-led",
        name: "Far Led",
      },
      {
        id: "far-halojen",
        name: "Far Halojen",
      },
      {
        id: "far-xenon",
        name: "Far Xenon",
      },
      {
        id: "far-bi-xenon",
        name: "Far Bi Xenon",
      },
      {
        id: "far-sis",
        name: "Far Sis",
      },
      {
        id: "far-adaptif",
        name: "Far Adaptif",
      },
      {
        id: "far-sensoru",
        name: "Far Sensörü",
      },
      {
        id: "far-yikama",
        name: "Far Yıkama",
      },
      {
        id: "elektrikli-aynalar",
        name: "Elektrikli Aynalar",
      },
      {
        id: "aynar-katlanir",
        name: "Aynalar Katlanır",
      },
      {
        id: "aynar-isitmali",
        name: "Aynalar Isıtmalı",
      },
      {
        id: "aynar-hafizali",
        name: "Aynalar Hafızalı",
      },
      {
        id: "park-sensoru-arka",
        name: "Park Sensörü Arka",
      },
      {
        id: "park-sensoru-on",
        name: "Park Sensörü Ön",
      },
      {
        id: "park-asistani",
        name: "Park Asistanı",
      },
      {
        id: "alasim-jant",
        name: "Alaşım Jant",
      },
      {
        id: "sunroof",
        name: "Sunroof",
      },
      {
        id: "panoramik-cam-tavan",
        name: "Panoramik Cam Tavan",
      },
      {
        id: "yagmur-sensoru",
        name: "Yağmur Sensörü",
      },
      {
        id: "arka-cam-buz-cozucu",
        name: "Arka Cam Buz Çözücü",
      },
      {
        id: "panoramik-on-cam",
        name: "Panoramik Ön Cam",
      },
      {
        id: "romork-cekici-demiri",
        name: "Römork Çekici Demiri",
      },
      {
        id: "akilli-bagaj-kapagi",
        name: "Akıllı Bagaj Kapağı",
      },
    ],
  },
  {
    id: "eglence-sistemi",
    groupName: "Eğlence Sistemi",
    features: [
      {
        id: "radyo-kasetcalar",
        name: "Radyo-Kasetçalar",

        infoLink: "https://otosozluk.galerimplus.com/term/radyo-kasetcalar",
      },
      {
        id: "radyo-cd-calar",
        name: "Radyo Cd Çalar",

        infoLink: "https://otosozluk.galerimplus.com/term/radyo-cd-calar",
      },
      {
        id: "radyo-mp3-calar",
        name: "Radyo-Mp3 Çalar",

        infoLink: "https://otosozluk.galerimplus.com/term/radyo-mp3-calar",
      },
      {
        id: "navigasyon",
        name: "Navigasyon",

        infoLink: "https://otosozluk.galerimplus.com/term/navigasyon",
      },
      {
        id: "tv",
        name: "Tv",

        infoLink: "https://otosozluk.galerimplus.com/term/tv",
      },
      {
        id: "bluetooth-telefon",
        name: "Bluetooth-Telefon",

        infoLink: "https://otosozluk.galerimplus.com/term/bluetooth-telefon",
      },
      {
        id: "usb",
        name: "Usb",

        infoLink: "https://otosozluk.galerimplus.com/term/usb",
      },
      {
        id: "aux",
        name: "Aux",

        infoLink: "https://otosozluk.galerimplus.com/term/aux",
      },
      {
        id: "ipod-baglantisi",
        name: "İpod Bağlantısı",

        infoLink: "https://otosozluk.galerimplus.com/term/ipod-baglantisi",
      },
      {
        id: "6-hoparlor",
        name: "6+ Hoparlör",

        infoLink: "https://otosozluk.galerimplus.com/term/6-hoparlor",
      },
      {
        id: "cd-degistirici",
        name: "Cd Değiştirici",

        infoLink: "https://otosozluk.galerimplus.com/term/cd-degistirici",
      },
      {
        id: "arka-eglence-paketi",
        name: "Arka Eğlence Paketi",

        infoLink: "https://otosozluk.galerimplus.com/term/arka-eglence-paketi",
      },
      {
        id: "dvd-degistirici",
        name: "Dvd Değiştirici",

        infoLink: "https://otosozluk.galerimplus.com/term/dvd-degistirici",
      },
    ],
  },
  {
    id: "guvenlik",
    groupName: "Güvenlik",
    features: [
      {
        id: "abc",
        name: "Abc",
      },
      {
        id: "abs",
        name: "Abs",

        infoLink:
          "https://otosozluk.galerimplus.com/term/abs-anti-lock-braking-system",
      },
      {
        id: "aeb",
        name: "Aeb",
      },
      {
        id: "ebp",
        name: "Ebp",
      },
      {
        id: "asr",
        name: "Asr",
      },
      {
        id: "esp-vsa",
        name: "Esp/Vsa",
      },
      {
        id: "airmatic",
        name: "Airmatic",
      },
      {
        id: "edl",
        name: "Edl",
      },
      {
        id: "eba",
        name: "Eba",
      },
      {
        id: "ebd",
        name: "Ebd",
      },
      {
        id: "tcs",
        name: "Tcs",
      },
      {
        id: "bas",
        name: "Bas",
      },
      {
        id: "distronic",
        name: "Distronic",
      },
      {
        id: "yokus-kalkis-destegi",
        name: "Yokuş Kalkış Desteği",
      },
      {
        id: "zirhli-arac",
        name: "Zırhlı Araç",
      },
      {
        id: "gece-gorus",
        name: "Gece Görüş",
      },
      {
        id: "seritten-ayrilma-ikazi",
        name: "Şeritten Ayrılma İkazı",
      },
      {
        id: "serit-degistirme-yardimcisi",
        name: "Şerit Değiştirme Yrd",
      },
      {
        id: "hava-yastigi-surucu",
        name: "Hava Yastığı Sürücü",
      },
      {
        id: "hava-yastigi-yolcu",
        name: "Hava Yastığı Yolcu",
      },
      {
        id: "hava-yastigi-yan",
        name: "Hava Yastığı Yan",
      },
      {
        id: "hava-yastigi-diz",
        name: "Hava Yastığı Diz",
      },
      {
        id: "hava-yastigi-perde",
        name: "Hava Yastığı Perde",
      },
      {
        id: "hava-yastigi-tavan",
        name: "Hava Yastığı Tavan",
      },
      {
        id: "kor-nokta-uyari",
        name: "Kör Nokta Uyarı",
      },
      {
        id: "lastik-ariya-gostergesi",
        name: "Lastik Arıza Göstergesi",
      },
      {
        id: "yorgunluk-tespit",
        name: "Yorgunluk Tespit",
      },
      {
        id: "isofix",
        name: "Isofix",
      },
      {
        id: "alarm",
        name: "Alarm",
      },
      {
        id: "cocuk-kilidi",
        name: "Çocuk Kilidi",
      },
      {
        id: "merkezi-kilit",
        name: "Merkezi Kilit",
      },
      {
        id: "immobilizer",
        name: "İmmobilizer",
      },
      {
        id: "carpisma-onleyici",
        name: "Çarpışma Önleyici",
      },
      {
        id: "egim-inis-kontrolu",
        name: "Eğim İniş Kontrolü",
      },
      {
        id: "otomatik-park-sistemi",
        name: "Otomatik Park Sistemi",
      },
    ],
  },
];

export function getSelectedCarSupportedEquipmentGroups(
  category: string,
  brand: string,
  model: string,
  submodel: string
): EquipmentGroup[] {
  // Örnek: Belirli bir marka ve model için desteklenen gövde tiplerini döndür
  //su anlık hepsi dönüyor.
  return equipmentGroups;
}
