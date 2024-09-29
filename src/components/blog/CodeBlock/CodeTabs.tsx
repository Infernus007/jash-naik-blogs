import React, { useState, useEffect , useRef} from 'react';
import { Tabs, Tab, Card, CardBody, CardFooter, Snippet , Skeleton} from "@nextui-org/react";
import { FileJs, FileTs, FileTsx, FileJsx, BracketsCurly, FileHtml, FileCss, FilePy, TerminalWindow } from '@phosphor-icons/react';

const languageIcons = {
  js: FileJs,
  javascript: FileJs,
  ts: FileTs,
  typescript: FileTsx,
  jsx: FileJsx,
  tsx: FileTsx,
  json: BracketsCurly,
  html: FileHtml,
  css: FileCss,
  python: FilePy,
  py: FilePy,
  bash: TerminalWindow,
  sh: TerminalWindow,
};

export default function CodeTabs({ code }) {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);


  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code.props.value, 'text/html');
    const figures = doc.querySelectorAll('figure');
    
    const blocks = Array.from(figures).map((figure) => {
      const titleElement = figure.querySelector('[data-rehype-pretty-code-title]');
      const preElement = figure.querySelector('pre');
      const captionElement = figure.querySelector('figcaption');


      let title = titleElement?.textContent;
      const language = preElement?.getAttribute('data-language');
      if (!title) {
        title = language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Code';
      }
      
      const content = preElement?.outerHTML || '';
      const caption = captionElement?.textContent ? captionElement.textContent === title ? "" : captionElement.textContent : '';

      return { title, content, language , caption };
    });

    setCodeBlocks(blocks);
    setLoading(false);
  }, [code]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      const tabContents = containerRef.current.querySelectorAll('[data-slot="panel"]');
console.log(tabContents);
      const heights = Array.from(tabContents).map(el => el.offsetHeight);
      const maxHeight = Math.max(...heights);
      containerRef.current.style.height = `${maxHeight}px`;
    }
  }, [loading]);

  if (loading) {
    return <Skeleton className='w-full h-[350px]'></Skeleton>; // Replace with your skeleton loader
  }

  return (
    <div className="flex w-full flex-col not-prose"
        ref={containerRef} 
    >
      <Tabs aria-label="Code examples">
        {codeBlocks.map((block, index) => {
          const IconComponent = languageIcons[block.language?.toLowerCase()] || Code;
          return (
            <Tab
            key={index}
              title={
                <div className="flex items-center space-x-2 relative">
                  <IconComponent size={18} />
                  <span>{block.title}</span>
                </div>
              }
            >
              
              <Card className='' 
              
              >
              <Snippet symbol="" classNames={{
                base : "relative w-full block w-auto h-auto m-0 p-0 text-base font-normal text-inherit bg-transparent rounded-none",
                copyButton : "absolute right-1 top-1 bg-content1",
                content : "",
              pre : "w-full"
              }}>
                <CardBody>
                  <div dangerouslySetInnerHTML={{ __html: block.content }} />
                </CardBody>
                </Snippet>
                {block.caption && (
                <CardFooter>
                    <div className="mb-2 text-sm text-gray-600">{block.caption}</div>
                </CardFooter>
                  )}
              </Card>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}
