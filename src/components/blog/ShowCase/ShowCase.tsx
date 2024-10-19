import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { WarningCircle, Info, CheckCircle, XCircle } from "@phosphor-icons/react";

type ShowCaseProps = {
  content: string | string[];
  type: 'danger' | 'info' | 'warning' | 'success';
};

export const ShowCase: React.FC<ShowCaseProps> = ({ content, type }) => {
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 text-red-600';
      case 'info':
        return 'bg-blue-50 text-blue-600';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600';
      case 'success':
        return 'bg-green-50 text-green-600';
      default:
        return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <XCircle size={50} className="text-red-100" />;
      case 'info':
        return <Info size={50} className="text-blue-100" />;
      case 'warning':
        return <WarningCircle size={50} className="text-yellow-100" />;
      case 'success':
        return <CheckCircle size={50} className="text-green-100" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`not-prose ${getTypeStyle(type)}`}>
      <CardHeader className="flex  gap-3">
        {getIcon(type)}
        <div className="flex flex-col">
          <p className="text-md font-medium">Tip</p>
          <p className="text-sm text-default-500">Subtitle</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {Array.isArray(content) ? (
          <Listbox>
            {content.map((item) => (
              <ListboxItem key={item} >
                {item}
              </ListboxItem>
            ))}
          </Listbox>
        ) : (
          <p className="mt-2">{content}</p>
        )}
      </CardBody>
    </Card>
  );
};
