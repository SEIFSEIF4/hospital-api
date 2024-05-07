import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://needed-crawdad-33363.upstash.io",
  token: "AYJTAAIncDExNjU2ZWQzNDk5NjU0YjViYTYwMmQ3MDQ3ZTBjMThjZnAxMzMzNjM",
});

const hospitalList = [
  "ACIBADEM ATAŞEHIR TIP MERKEZI",
  "ACIBADEM BAHÇEŞEHIR TIP MERKEZI",
  "YEDITEPE ÜNIVERSITESI GENETIK TANI MERKEZI",
  "ACIBADEM BEYLIKDÜZÜ CERRAHI TIP MERKEZI",
  "YEDITEPE ÜNIVERSITESI HASTANESI BAĞDAT CADDESI POLIKLINIĞI",
  "DB’EST CLINIC",
  "ACIBADEM FULYA HASTANESI",
  "ACIBADEM ETILER TIP MERKEZI",
  "MEDICANA AVCILAR HASTANESI",
  "ACIBADEM SPORTS",
  "GÖKTÜRK FLORENCE NIGHTINGALE TIP MERKEZI",
  "YEDITEPE ÜNIVERSITESI KOZYATAĞI HASTANESI",
  "GAYRETTEPE FLORENCE NIGHTINGALE HASTANESI",
  "VM MEDICAL PARK PENDIK HASTANESI",
  "HISAR HOSPITAL ÇAMLICA",
  "ACIBADEM MEHMET ALI AYDINLAR ÜNIVERSITESI ATAKENT HASTANESI",
  "ACIBADEM BAKIRKÖY HASTANESI",
  "MEDICANA ÇAMLICA HASTANESI",
  "NPİSTANBUL BEYIN HASTANESI",
  "MIRA CLINIC",
  "YEDITEPE ÜNIVERSITESI DIŞ HEKIMLIĞI FAKÜLTESI VE DIŞ HASTANESI",
  "YEDITEPE ÜNIVERSITESI GÖZ MERKEZI",
  "ACIBADEM KOZYATAĞI HASTANESI",
  "ACIBADEM GÖKTÜRK TIP MERKEZI",
  "KADIKÖY FLORENCE NIGHTINGALE HASTANESI",
  "ŞIŞLI KOLAN INTERNATIONAL HOSPITAL",
  "MEMORIAL ATAŞEHIR HASTANESI",
  "MEDICANA BAHÇELIEVLER HASTANESI",
  "ACIBADEM BAHÇEŞEHIR TIP MERKEZI",
  "ACIBADEM BEYLIKDÜZÜ CERRAHI TIP MERKEZI",
  "YEDITEPE ÜNIVERSITESI HASTANESI BAĞDAT CADDESI POLIKLINIĞI",
  "DB’EST CLINIC",
  "IMEDICANA AVCLAR HASTANESI",
  "XA CLINIC",
  "ACIBADEM BAĞDAT CADDESI TIP MERKEZI",
  "GÖKTÜRK FLORENCE NIGHTINGALE TIP MERKEZI",
  "YEDITEPE ÜNIVERSITESI KOZYATAĞI HASTANESI",
  "APEX CLINIC",
  "GAYRETTEPE FLORENCE NIGHTINGALE HASTANESI",
  "VM MEDICAL PARK PENDIK HASTANESI",
  "HISAR HOSPITAL ÇAMLICA",
  "ACIBADEM MEHMET ALI AYDINLAR ÜNIVERSITESI ATAKENT HASTANESI",
  "MEDICANA KADIKÖY HASTANESI",
  "BAHÇEŞEHIR ÜNIVERSITE HASTANESI MEDICAL PARK GÖZTEPE",
  "RENATE CLINIC",
  "MIRA CLINIC",
  "MEMORIAL BAHÇELIEVLER HASTANESI",
  "YEDITEPE ÜNIVERSITESI DIŞ HEKIMLIĞI FAKÜLTESI VE DIŞ HASTANESI",
  "YEDITEPE ÜNIVERSITESI GÖZ MERKEZI",
  "ACIBADEM KOZYATAĞI HASTANESI",
  "ACIBADEM GÖKTÜRK TIP MERKEZI",
  "KADIKÖY FLORENCE NIGHTINGALE HASTANESI",
  "ATAŞEHIR FLORENCE NIGHTINGALE HASTANESI",
  "MEDICANA BAHÇELIEVLER HASTANESI",
];

hospitalList.forEach((hospital) => {
  const term = hospital.toUpperCase();
  const terms: { score: 0; member: string }[] = [];

  for (let i = 0; i <= term.length; i++) {
    terms.push({ score: 0, member: term.substring(0, i) });
  }
  terms.push({ score: 0, member: term + "*" });

  const populateDb = async () => {
    // @ts-expect-error
    await redis.zadd("infoHospitals", ...terms);
  };

  populateDb();
});
