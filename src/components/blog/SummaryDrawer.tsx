import { useState, useEffect, useRef } from 'react';
import { Skeleton, Card, CardBody, Button } from "@nextui-org/react";
import { Sparkle } from "@phosphor-icons/react";

interface SummaryDrawerProps {
  geminiApiKey: string;
  // biome-ignore lint/suspicious/noExplicitAny: so that it works with astro native components
  [key: string]: any;
}



const SummaryDrawer: React.FC<SummaryDrawerProps> = ({ geminiApiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const fetchSummary = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);

    const contentElement = document.querySelector('.content');
    if (!contentElement) {
      setError('Content not found');
      setIsLoading(false);
      return;
    }

    const content = contentElement.textContent || '';

    const optimizedPrompt = `Summarize the following text in a concise and informative manner, ensuring the output is valid HTML with proper formatting:

${content}

Please structure the summary using the following HTML tags:
1. Use <h2> or <h3> for titles and subtitles.
2. Enclose each paragraph within <p class="mb-4"> tags.
3. Utilize <ul> or <ol> for lists if necessary.
4. Apply <strong> tags for emphasis.

Maintain a professional and objective tone.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: optimizedPrompt }] }]
        }),
      });

      const data = await response.json();
      const summaryText = data.candidates[0].content.parts[0].text;
      setSummary(summaryText);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('An error occurred while generating the summary. Please try again later.');
      
      if (retryCount < 3) {
        setTimeout(() => fetchSummary(retryCount + 1), 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: BIOME is just not working
  useEffect(() => {
    if (isOpen && !summary) {
      fetchSummary();
    }
  }, [isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: BIOME is just not working
  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
    }
  }, [summary]);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="bordered" 
        radius="full"
        className="relative group overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-sky-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        <span className="absolute inset-[2px] bg-stone-200 dark:bg-gray-900 rounded-full"/>
        <span className="relative z-10 flex items-center">
          <Sparkle className='w-4 h-4 me-2'/>
          Summarize
        </span>
      </Button>
      <div className={`fixed my-5 border-foreground/20 border-1 border-solid rounded-xl top-16 right-0 bottom-0 w-[95%]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                %] md:w-96 bg-background shadow-lg transform ${isOpen ? 'translate-x-0 right-5' : 'translate-x-full right-0'} transition-transform duration-300 ease-in-out overflow-y-auto z-50`}>
        <Card className='h-full'>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Summary</h2>
              <Button size="sm" variant="light" onClick={() => setIsOpen(false)}>Close</Button>
            </div>
            {isLoading ? (
              <div>
                <p className="mb-2">Generating summary...</p>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={`skeleton-${i+1}`} className="w-full h-4 rounded mb-2" />
                ))}
                <Skeleton className="w-2/3 h-4 rounded" />
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              // biome-ignore lint/security/noDangerouslySetInnerHtml: this is a blog post summary
              <div ref={summaryRef} dangerouslySetInnerHTML={{ __html: summary }} className="prose dark:prose-invert max-w-none"/>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default SummaryDrawer;
