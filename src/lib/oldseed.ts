import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const hospitalList = [
  "Acibadem Atasehir Outpatient Clinic",
  "Acibadem Bahcesehir Outpatient Clinic",
  "Yeditepe University Genetic Diseases Centre",
  "Acibadem Beylikduzu Surgical Outpatient Clinic",
  "Yeditepe University Bagdat Street Polyclinic",
  "Db'est Clinic",
  "Acibadem Fulya Hospital",
  "Acibadem Etiler Outpatient Clinic",
  "Medicana Avcilar Hospital",
  "XA Clinic",
  "Acibadem Bagdat Outpatient Clinic",
  "Acibadem Sports Medical Center",
  "Florence Nightingale Medical Center Gokturk",
  "Yeditepe University Kozyatagi Hospital",
  "Florence Nightingale Hospital Gayrettepe",
  "VM Medical Park Hospital Pendik",
  "Hisar Hospital Camlica",
  "Acibadem Atakent Hospital",
  "Acibadem Bakirkoy Hospital",
  "Medicana Camlica Medical Centre",
  "Medicana Kadikoy Hospital",
  "NP Brain Hospital",
  "Mira Clinic",
  "Memorial Hizmet Hospital",
  "Yeditepe University Dental Hospital",
  "Yeditepe University Eye Centre",
  "Acibadem Kozyatagi Hospital",
  "Acibadem Gokturk Outpatient Clinic",
  "Florence Nightingale Hospital Kadikoy",
  "Florence Nightingale Hospital Atasehir",
  "Kolan International Hospital Sisli",
  "Memorial Atasehir Hospital",
  "Medicana Bahcelievler Hospital",
  "Acibadem Bahcesehir Outpatient Clinic Istanbul",
  "Acibadem Beylikduzu Surgical Outpatient Clinic Istanbul",
  "Yeditepe University Bagdat Street Polyclinic Istanbul",
  "Db'est Clinic Istanbul",
  "Flora Clinic Istanbul",
  "Acibadem Fulya Hospital Istanbul",
  "Acibadem Etiler Outpatient Clinic Istanbul",
  "Medicana Avcilar Hospital Istanbul",
  "XA Clinic Istanbul",
  "Acibadem Bagdat Outpatient Clinic Istanbul",
  "Florence Nightingale Medical Center Gokturk Istanbul",
  "Yeditepe University Kozyatagi Hospital Istanbul",
  "APEX Clinic Istanbul",
  "Florence Nightingale Hospital Gayrettepe Istanbul",
  "VM Medical Park Hospital Pendik Istanbul",
  "Hisar Hospital Camlica Istanbul",
  "Acibadem Atakent Hospital Istanbul",
  "Medicana Kadikoy Hospital Istanbul",
  "Medical Park Hospital Goztepe Istanbul",
  "NP Brain Hospital Istanbul",
  "Renate Clinic Istanbul",
  "Mira Clinic Istanbul",
  "Memorial Hizmet Hospital Istanbul",
  "Yeditepe University Dental Hospital Istanbul",
  "Yeditepe University Eye Centre Istanbul",
  "Acibadem Kozyatagi Hospital Istanbul",
  "Acibadem Gokturk Outpatient Clinic Istanbul",
  "Florence Nightingale Hospital Kadikoy Istanbul",
  "Florence Nightingale Hospital Atasehir Istanbul",
  "Kolan International Hospital Sisli Istanbul",
  "Memorial Atasehir Hospital Istanbul",
  "Medicana Bahcelievler Hospital Istanbul",
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
    await redis.zadd("hospitals", ...terms);
  };

  populateDb();
});
