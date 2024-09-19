import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../components/ui/accordion"
   

const accordion = () => {
  return (
    <>
    <div className="flex items-center justify-center flex-col">
      <Accordion type="single" collapsible className="md:w-[900px] w-[300px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is PrimeBNB safe?</AccordionTrigger>
        <AccordionContent>
          Yes. Its a De-Centralized project totally handeled by a blockchain.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What is minimum investment?</AccordionTrigger>
        <AccordionContent>
          Them minimum investment on PrimeBNB is 0.01 BNB.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can we earn extra BNB?</AccordionTrigger>
        <AccordionContent>
          Yes. You can earn extra BNB by Reffering other users through your refferal link.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </div>
    </>
  )
}

export default accordion
