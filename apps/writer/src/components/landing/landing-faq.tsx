"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Cos'\u00E8 NeoByteWriter?",
    answer:
      "NeoByteWriter \u00E8 uno strumento di scrittura creativa pensato per autori di fiction. Combina un editor professionale con strumenti di worldbuilding, un assistente AI e analisi della prosa per aiutarti a scrivere il tuo romanzo in modo efficiente e organizzato.",
  },
  {
    question: "Come funziona l'assistente AI?",
    answer:
      "L'assistente AI ti aiuta durante la scrittura in diversi modi: pu\u00F2 generare testo a partire da un contesto, suggerire miglioramenti stilistici, controllare la coerenza della trama e dei personaggi, e proporti idee quando hai il blocco dello scrittore. Tutto viene fatto rispettando il tuo stile e la tua voce narrativa.",
  },
  {
    question: "Posso esportare il mio lavoro?",
    answer:
      "Certo! Con il piano gratuito puoi esportare in Markdown. I piani a pagamento ti permettono di esportare anche in DOCX (compatibile con Word e Google Docs) e di generare la bibbia del tuo mondo come documento completo, pronto da condividere con editori o beta reader.",
  },
  {
    question: "I miei dati sono al sicuro?",
    answer:
      "La sicurezza dei tuoi dati \u00E8 la nostra priorit\u00E0. Tutti i dati vengono crittografati sia in transito che a riposo. Effettuiamo backup automatici giornalieri e i tuoi manoscritti non vengono mai utilizzati per addestrare modelli AI. Sei sempre il proprietario del tuo lavoro.",
  },
  {
    question: "Posso cambiare piano in qualsiasi momento?",
    answer:
      "S\u00EC, puoi passare a un piano superiore o inferiore in qualsiasi momento. Se passi a un piano superiore, paghi solo la differenza proporzionale al periodo rimanente. Se riduci il piano, il cambiamento avr\u00E0 effetto dal prossimo ciclo di fatturazione. Non ci sono vincoli o penali.",
  },
] as const;

export function LandingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
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
