import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { WarningCircle, Info, CheckCircle, XCircle, Lightbulb, Note } from "@phosphor-icons/react";

type ShowCaseProps = {
  content: string | string[];
  type: 'tip' | 'note' | 'warning' | 'important';
  title?: string;
  subtitle?: string;
};

export const ShowCase: React.FC<ShowCaseProps> = ({ content, type, title, subtitle }) => {
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'tip':
        return 'bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50';
      case 'note':
        return 'bg-purple-50/80 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50';
      case 'warning':
        return 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50';
      case 'important':
        return 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50';
      default:
        return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb size={20} weight="fill" />;
      case 'note':
        return <Note size={20} weight="fill" />;
      case 'warning':
        return <WarningCircle size={20} weight="fill" />;
      case 'important':
        return <CheckCircle size={20} weight="fill" />;
      default:
        return null;
    }
  };

  const getDefaultTitle = (type: string) => {
    switch (type) {
      case 'tip':
        return 'Pro Tip';
      case 'note':
        return 'Note';
      case 'warning':
        return 'Warning';
      case 'important':
        return 'Important';
      default:
        return '';
    }
  };

  return (
    <Card 
      className={`not-prose ${getTypeStyle(type)} border-1 shadow-sm mb-8`}
      radius="lg"
    >
      <CardHeader className="flex gap-3 px-6 py-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current/10">
          {getIcon(type)}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{title || getDefaultTitle(type)}</p>
          {subtitle && <p className="text-xs text-current/70">{subtitle}</p>}
        </div>
      </CardHeader>
      <Divider className="opacity-50" />
      <CardBody className="px-6 py-4">
        {Array.isArray(content) ? (
          <Listbox 
            className="gap-2 p-0"
            itemClasses={{
              base: "px-4 py-2 rounded-lg data-[hover=true]:bg-current/5 transition-colors",
            }}
          >
            {content.map((item) => (
              <ListboxItem key={item} className="text-sm">
                {item}
              </ListboxItem>
            ))}
          </Listbox>
        ) : (
          <p className="text-sm leading-relaxed">{content}</p>
        )}
      </CardBody>
    </Card>
  );
};
