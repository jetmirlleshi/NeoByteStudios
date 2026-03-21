"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingFaqItems = [
  {
    question: "Posso provare i piani a pagamento gratuitamente?",
    answer:
      "S\u00EC! Tutti i piani a pagamento includono 14 giorni di prova gratuita. Non ti verr\u00E0 addebitato nulla fino alla fine del periodo di prova, e puoi cancellare in qualsiasi momento.",
  },
  {
    question: "Come funziona la fatturazione?",
    answer:
      "La fatturazione \u00E8 mensile. Il pagamento viene addebitato automaticamente il giorno in cui ti sei iscritto ogni mese. Accettiamo carte di credito, carte di debito e altri metodi di pagamento comuni tramite Stripe.",
  },
  {
    question: "Posso cambiare piano in qualsiasi momento?",
    answer:
      "Certamente. Puoi fare upgrade o downgrade del tuo piano quando vuoi. Se passi a un piano superiore, paghi solo la differenza proporzionale al periodo rimanente. Se riduci il piano, il cambiamento avr\u00E0 effetto dal prossimo ciclo di fatturazione.",
  },
  {
    question: "Cosa succede ai miei dati se cambio piano o cancello?",
    answer:
      "I tuoi dati rimangono al sicuro. Se fai downgrade al piano Free, manterrai l'accesso ai tuoi primi 2 progetti. Gli altri saranno in sola lettura. Se cancelli l'account, avrai 30 giorni per esportare tutti i tuoi dati prima della cancellazione definitiva.",
  },
  {
    question: "Cosa significa \"generazioni AI al giorno\"?",
    answer:
      "Ogni volta che chiedi all'assistente AI di generare testo, suggerire miglioramenti o controllare la coerenza, conta come una generazione. Il piano Free include 15 generazioni al giorno, Writer ne include 150, mentre Professional offre generazioni illimitate.",
  },
  {
    question: "Offrite sconti per studenti o insegnanti?",
    answer:
      "S\u00EC! Offriamo uno sconto del 50% sul piano Writer per studenti e insegnanti con un indirizzo email accademico verificato. Contattaci all'indirizzo support@neobytestudios.com con la prova della tua affiliazione accademica.",
  },
  {
    question: "Come posso cancellare il mio abbonamento?",
    answer:
      "Puoi cancellare il tuo abbonamento in qualsiasi momento dalle impostazioni del tuo account. La cancellazione avr\u00E0 effetto alla fine del periodo di fatturazione corrente. Non ci sono penali o costi nascosti.",
  },
] as const;

export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {pricingFaqItems.map((item, index) => (
        <AccordionItem key={index} value={`pricing-faq-${index}`}>
          <AccordionTrigger className="text-left text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
