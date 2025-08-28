
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'كم يستغرق وصول المنتج؟',
    answer: 'يتم التوصيل خلال 2-3 أيام عمل داخل القاهرة والجيزة، و 3-5 أيام للمحافظات الأخرى.'
  },
  {
    question: 'هل المنتج آمن للبشرة الحساسة؟',
    answer: 'نعم، المنتج مصنوع من مكونات طبيعية 100% ومُختبر من قبل أطباء الجلدية، وآمن لجميع أنواع البشرة.'
  },
  {
    question: 'متى ستظهر النتائج؟',
    answer: 'معظم العميلات يلاحظن تحسناً واضحاً في البشرة خلال أسبوع إلى أسبوعين من الاستخدام المنتظم.'
  },
  {
    question: 'هل يمكنني إرجاع المنتج؟',
    answer: 'نعم، نحن نقدم ضمان استرداد الأموال خلال 30 يوم من تاريخ الشراء إذا لم تكوني راضية عن النتائج.'
  },
  {
    question: 'كيف أستخدم المنتج؟',
    answer: 'يُستخدم المنتج مرتين يومياً صباحاً ومساءً على بشرة نظيفة وجافة مع التدليك بحركات دائرية لطيفة.'
  },
  {
    question: 'هل يمكن استخدامه مع منتجات أخرى؟',
    answer: 'نعم، يمكن استخدامه مع منتجات العناية الأخرى، لكن ننصح بإجراء اختبار حساسية أولاً.'
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                الأسئلة الشائعة
              </h2>
            </div>
            <p className="text-gray-600 text-lg">
              إجابات على أهم الأسئلة التي قد تخطر ببالك
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 py-2 bg-white shadow-sm"
              >
                <AccordionTrigger className="text-right font-semibold text-gray-800 hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-right text-gray-600 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
